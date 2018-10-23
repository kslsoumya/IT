const jwt = require('jsonwebtoken')
const shortId = require('shortid')
const secretKey = 'someVeryRandomStringThatNobodyCanGuess';

let generateToken = (data, cb) => {

    // generate a jwt 

    try {
        let claims = {
            jwtId: shortId.generate(),
            iat: Date.now(),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            sub: 'authToken',
            iss: 'Issue Tracker',
            data: data
        }
        let tokenDetails = {
            token: jwt.sign(claims, secretKey),
            tokenSecret : secretKey
        }
        cb(null, tokenDetails)
    } catch (err) {
        console.log(err)
        cb(err, null)
    }
}


let verifyClaim = (token, cb) => {

    // verify a token symmetric

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log('Error while verifying token')
            console.log(err)
            cb(err, null)
        } else {
            console.log('user Verified')
            console.log(decoded)
            cb(null, decoded)
        }
    })
}


let verifyClaimWithoutSecret = (token,cb)=>{
    jwt.verify(token,secretKey,(err,decoded)=>{
        if (err) {
            console.log('Error while verifying token')
            console.log(err)
            cb(err, null)
    } else {
        console.log('user Verified')
            console.log(decoded)
            cb(null, decoded)

    }
})
}


module.exports = {
    generateToken : generateToken,
    verifyClaim : verifyClaim,
    verifyClaimWithoutSecret : verifyClaimWithoutSecret
}