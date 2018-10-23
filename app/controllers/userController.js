const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('../libs/generatePwdLib')
const token = require('../libs/tokenLib')
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'dprivate00@gmail.com',
        pass: 'lkjhgfdsa0987'
    }
})

/* Models */
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')


// start user signup function 

let signUpFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body.email + '---------');
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    logger.error('Email didnt meet the requirement', 'User Controller:validateUserInput()', 10)
                    let apiResponse = response.generate(true, 'Email is not Valid', 400, null)
                    reject(apiResponse)
                } else if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Password didnt meet the requirement', 400, null)
                    reject(apiResponse)

                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User creation', 'User Controller:ValidateUserInput()', 5)
                let apiResponse = response.generate(true, 'One or more parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }


    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'email': req.body.email })
                .exec((err, retrievedUserDetails) => {
                    console.log(retrievedUserDetails + '------------userDetails')
                    if (err) {
                        logger.error('Failed To Create User', 'User Controller:Create User()', 10)
                        let apiResponse = response.generate(true, 'Failed to create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        // console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            userName: req.body.userName,
                            email: req.body.email,
                            password: passwordLib.hashPassword(req.body.password),
                            mobile: req.body.mobile,
                            dob: req.body.dob,
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                logger.error('Failed To Create New User', 'User Controller:Create User()', 10)
                                let apiResponse = response.generate(true, 'Failed to create  New User', 500, err)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject()
                                delete newUserObj._id;
                                delete newUserObj.__v;
                                resolve(newUserObj)
                            }
                        })

                    } else {
                        logger.error('User already Exists', 'User Controller:Create User()', 4)
                        let apiResponse = response.generate(true, 'Email/UserName already Exists', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            let welcomeText = `Hi ${req.body.userName} . Welcome to IssueTracker!!!`;
            var mailOptions = {
                from: '"IssueTracker" <dprivate00@gmail.com>',
                to: req.body.email,
                subject: `Welcome ${req.body.userName}`,
                text: welcomeText
            }
            // console.log(mailOptions);
            transporter.sendMail(mailOptions, (error, resp) => {
                if (error) {
                    logger.error('Failed To Send Email', 'User Controller:sendEmail()', 10)
                    let apiResponse = response.generate(true, 'Failed To Send Email', 500, error)
                    res.send(apiResponse)
                } else {
                    // console.log(resp);
                    delete resolve.password
                    let apiResponse = response.generate(false, 'User created successfully', 200, resolve)
                    res.send(apiResponse)
                }

            })
        })

        .catch((err) => {
            res.send(err)

        })

}// end user signup function 


// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.userName) {
                UserModel.findOne({ 'userName': req.body.userName }, (err, userDetails) => {
                    // console.log(userDetails.userId+'-------------')
                    if (err) {
                        logger.error('Failed to retrieve User Details', 'User Controller:find User()', 4)
                        let apiResponse = response.generate(true, 'Failed to Find User Details', 403, null)
                        reject(apiResponse)

                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'User Controller:find User()', 4)
                        let apiResponse = response.generate(true, 'No User Found', 404, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'User Controller:find User()', 10)
                        resolve(userDetails);
                    }
                })

            } else {
                logger.error('UserName is missing', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'UserName is missing', 404, null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePwd(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    logger.error(err.message, 'User Controller:validate password()', 4)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    retrievedUserObject = retrievedUserDetails.toObject();
                    delete retrievedUserObject.password
                    delete retrievedUserObject._id
                    delete retrievedUserObject.__v
                    delete retrievedUserObject.createdOn
                    delete retrievedUserDetails.modifiedOn
                    resolve(retrievedUserObject)
                } else {
                    logger.error(err, 'User Controller:validate password()', 4)
                    let apiResponse = response.generate(true, ' Wrong Password Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }


    let generateToken = (userDetails) => {
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    logger.error(err.message, 'User Controller:generate token()', 4)
                    let apiResponse = response.generate(true, ' Failed to generate token', 400, null)
                    reject(apiResponse)

                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    // console.log(tokenDetails.token + '---token details')
                    resolve(tokenDetails)
                }
            })

        })
    }


    let saveToken = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ 'userId': tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    logger.error(err.message, 'User Controller:save token()', 4)
                    let apiResponse = response.generate(true, ' Failed to save token', 500, null)
                    reject(apiResponse)

                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'User Controller:save token()', 4)
                            let apiResponse = response.generate(true, ' Failed to save token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token,
                        retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret,
                        retrievedTokenDetails.tokenGenTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'User Controller:save token()', 4)
                            let apiResponse = response.generate(true, ' Failed to update token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })

        })
    }



    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login successful', 200, resolve)
            // console.log(resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            let apiResponse = response.generate(true, 'Login Unsuccessful', 400, err)
            res.status(err.status)
            res.send(apiResponse)

        })
}


// end of the login function 

// send password reset Link-------

let sendResetLink = (req, res) => {
    if (req.params.userName) {
        UserModel.findOne({ 'userName': req.params.userName }, (err, userDetails) => {
            if (err) {
                logger.error('Failed to retrieve User Details', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'Failed to Find User Details', 403, null)
                res.send(apiResponse)
            } else if (check.isEmpty(userDetails)) {
                logger.error('No User Found', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info('User Found', 'User Controller:find User()', 10)
                let welcomeText = `Hi ${req.params.userName} . please click on the following link to reset you password \n
                http://localhost:4200/resetPwd/${userDetails.userId}?userName=${userDetails.userName}`
                    ;
                var mailOptions = {
                    from: '"IssueTracker" <dprivate00@gmail.com>',
                    to: userDetails.email,
                    subject: `Password Reset Link`,
                    text: welcomeText
                }
                // console.log(mailOptions);
                transporter.sendMail(mailOptions, (error, resp) => {
                    if (error) {
                        logger.error('Failed To Send Email', 'User Controller:sendEmail()', 10)
                        let apiResponse = response.generate(true, 'Failed To Send Email', 500, error)
                        res.send(apiResponse)
                    } else {
                        // console.log(resp);
                        // delete resolve.password
                        let apiResponse = response.generate(false, 'Password reset Link sent', 200)
                        res.send(apiResponse)
                    }

                })
            }
        })
    } else {
        logger.error('UserName is missing', 'User Controller:find User()', 4)
        let apiResponse = response.generate(true, 'UserName is missing', 500, null)
        res.send(apiResponse)

    }
}
// end of sendResetLink function -----------

// Start of Reset Password function------------


let resetPwd = (req, res) => {
    if (req.body.userId) {
        UserModel.findOne({ 'userId': req.body.userId }, (err, userDetails) => {
            if (err) {
                logger.error('Failed to retrieve User Details', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'Failed to Find User Details', 403, null)
                res.send(apiResponse)
            } else if (check.isEmpty(userDetails)) {
                logger.error('No User Found', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info('User Found', 'User Controller:find User()', 10)
                userDetails.password = passwordLib.hashPassword(req.body.password);
                userDetails.save((err, result) => {
                    if (err) {
                        logger.error('Failed To save Password', 'User Controller:resetPwd()', 10)
                        let apiResponse = response.generate(true, 'Failed To save Password', 500, error)
                        res.send(apiResponse)
                    } else {
                        let mailText = `Hi ${userDetails.userName} \n.
                        Your Password is changed successfully!! Check If it is you!`
                        var mailOptions = {
                            from: '"IssueTracker" <dprivate00@gmail.com>',
                            to: userDetails.email,
                            subject: `Password Change`,
                            text: mailText
                        }
                        transporter.sendMail(mailOptions, (error, resp) => {
                            if (error) {
                                logger.error('Failed To Send Email', 'User Controller:forgotPwd()', 10)
                                let apiResponse = response.generate(true, 'Failed To Send Email', 500, error)
                                res.send(apiResponse)
                            } else {
                                result = result.toObject()
                                delete result.password;
                                delete result.__v;
                                delete result._id;
                                // console.log(resp);
                                let apiResponse = response.generate(false, 'Password Reset Successful', 200, result)
                                res.send(apiResponse)
                            }
                        });
                    }
                })
            }
        })

    } else {
        logger.error('Failed To reset Password', 'User Controller:resetPwd()', 10)
        let apiResponse = response.generate(true, 'Failed To reset Password', 500, error)
        res.send(apiResponse)
    }
}

// End of Reset Password-----

// Start of ListAllUsers----
let listAllUsers = (req, res) => {
    let query = {
        userId: { $ne: req.query.id }
    }
    UserModel.find(query)
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(`Error Occured : ${err}`, 'controller : listAllUsers', 10)
                let apiResponse = response.generate(true, 'Some error Occured', 500, err)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'controller : listAllUsers', 10)
                let apiResponse = response.generate(true, 'No User Found!!', 404, err)
                res.send(apiResponse)
            } else {
                logger.info('Users Found Succesfully', 'controller : listAllUsers', 10)
                let apiResponse = response.generate(false, 'Users Found Succesfully!!', 200, result)
                res.send(apiResponse)
            }
        })
}
//  End if List All Users---


// logOut Function---------

let logout = (req, res) => {
    AuthModel.remove({ 'authToken': req.params.authToken }, (err, result) => {
        if (err) {
            logger.error(err.message, 'User Controller:logout()', 10)
            let apiResponse = response.generate(true, `Error occured:${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, `Already Logged out or Invalid UserId`, 400, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, `Logged out succesfully`, 200, result)
            res.send(apiResponse)
        }
    })

} // end of the logout function.


module.exports = {
    signUpUser: signUpFunction,
    loginUser: loginFunction,
    sendResetLink : sendResetLink,
    resetPwd: resetPwd,
    listAllUsers: listAllUsers,
    logoutUser: logout

}// end exports