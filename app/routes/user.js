const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")

const auth = require('../middlewares/Auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    // params: userName, email, mobile, password,dob
    app.post(`${baseUrl}/register`, userController.signUpUser);

    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/register User Registration
     *
     * @apiParam {string} email emailId of the user. (body params) (required)
     * @apiParam {string} userName userName of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} dob dob of the user. (body params) (required)
     * @apiParam {string} mobile mobile of the user. (body params) (required)
     * 
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Created Successfully",
            "status": 200,
            "data": {
                        "userId": "s4sqke5wM",
                        "userName": "nancy",
                        "email": "nancy.joe@hotmail.com",
                        "mobile": 909090989,
                        "dob": "1980-11-10T18:30:00.000Z",
                        "createdOn": "2018-10-23T05:18:14.000Z"
                    }
        }
    */

    app.post(`${baseUrl}/login`, userController.loginUser);

    
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login User Login
     *
     * @apiParam {string} userName userName of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.A",
                "userDetails": {
                    "userId": "s4sqke5wM",
                    "userName": "nancy",
                    "email": "nancy.joe@hotmail.com",
                    "mobile": 909090989,
                    "dob": "1980-11-10T18:30:00.000Z"
                    }
        }
    */

   app.get(`${baseUrl}/send/resetLink/:userName`, userController.sendResetLink);
    

    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/send/resetLink/:userName Password Reset Link
     *
     * @apiParam {string} userName userName of the user. (route params) (required)
     *
     * 
     * @apiSuccessExample {object} Success-Response:
                        {
                    "error": false,
                    "message": "Password reset Link sent",
                    "status": 200
                }
    */







    app.put(`${baseUrl}/resetPwd`, userController.resetPwd);

      /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/forgotPwd  Reset Password
     *
     * @apiParam {string} userId userId of the user. (body params) (required)
     *  @apiParam {string} password new Password of the user. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
                {
                    "error": false,
                    "message": "Password Reset Successful",
                    "status": 200,
                    "data": {
                        "userId": "kgy4rY_F_",
                        "userName": "abcXyz",
                        "email": "xyz@gmail.com",
                        "mobile": 9090000000,
                        "dob": "8878-07-08T00:00:00.000Z",
                        "createdOn": "2018-10-15T12:36:39.000Z"
                        }
                }
 */

app.get(`${baseUrl}/get/all`,auth.isAuthenticated,userController.listAllUsers);


 /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/get/all  Get All Users
     *
     * @apiParam {authToken} authToken authToken of the user. (body params or query param) (required)
     *
     * @apiSuccessExample {object} Success-Response:
     *
            {
                "error": false,
                "message": "Users Found Succesfully!!",
                "status": 200,
                "data": [
                    {
                        "userId": "5RDh-lOgD",
                        "userName": "lkj",
                        "email": "lkj@gmail.com",
                        "mobile": 8787898988,
                        "dob": "0878-07-08T00:00:00.000Z",
                        "createdOn": "2018-10-15T12:48:36.000Z"
                    }
                    
                ]
            }
 */



    app.post(`${baseUrl}/logout`, userController.logoutUser);

    
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout  User Logout
     *
     * 
     * @apiParam {string} authToken authToken of the user.(params or bodyParams or queryParams)(required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     *    {
     *       "error": false,
     *       "message": "Logged Out Successfully",
     *       "status": 200,
     *       "data": {
     *                   "n": 0,
     *                   "ok": 1
     *               }
     *   }
     * 
     * 
    */


}
