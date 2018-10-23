const express = require('express')
const config = require('../../config/appConfig')
const issueController = require('../controllers/issueController')

const auth = require('../middlewares/Auth')

let setRouter = (app) => {
    let baseUrl = config.apiVersion+'/issues';

    // Routes regarding the Issues -------------

    app.get(baseUrl + '/get/all/:userName', auth.isAuthenticated, issueController.listIssues);

     /**
   * @api {get}  /api/v1/issues/get/all  Get all Issues
   * @apiVersion 0.0.1
   * @apiName Get all Issues
   * @apiGroup Issues
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} skip skip.(Send skip as a query Param or header Param or Body param)(optional parameter for pagination)
   * 
   * @apiSuccessExample {json} Success-Response:
                   {
                    "error": false,
                    "message": "Issues Found Succesfully!!",
                    "status": 200,
                    "data": [
                        {
                            "watchers": [],
                            "issueId": "NKIHLfg2T",
                            "reporterId": "kgy4rY_F_",
                            "repName": "soumya",
                            "assignee": "soumya",
                            "title": "phonee",
                            "status": "New",
                            "description": "<p>changed desc second time fewf</p>",
                            "comments": "fhsdjkhsjkd",
                            "createdOn": "22/9/2018"
                        }
                    ]
                }
   * 
   *
   */





    


    app.get(baseUrl + '/search/:searchText', auth.isAuthenticated, issueController.searchIssues);

    /**
   * @api {get}  /api/v1/issues/search/:searchText  Search an Issue
   * @apiVersion 0.0.1
   * @apiName Search an Issue
   * @apiGroup Issues
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * 
   * @apiSuccessExample {json} Success-Response:
               {
                      "error": false,
                      "message": "Issues Found Succesfully!!",
                      "status": 200,
                      "data": [
                          {
                              "watchers": [],
                              "issueId": "3PmhERM0g",
                              "reporterId": "r7zr9lBYw",
                              "repName": "pqr",
                              "assignee": "abc",
                              "title": "phone",
                              "status": "New",
                              "description": "<p>jsdhjhsj</p>",
                              "comments": "sjhfjkdshkjfhsd",
                              "createdOn": "22/9/2018"
                          },
                          {
                              "watchers": [],
                              "issueId": "NKIHLfg2T",
                              "reporterId": "kgy4rY_F_",
                              "repName": "soumya",
                              "assignee": "abc",
                              "title": "phonee",
                              "status": "New",
                              "description": "<p>changed desc second time fewf</p>",
                              "comments": "fhsdjkhsjkd",
                              "createdOn": "22/9/2018"
                          }
                      ]
              }
   *
   * 
   *
   */

    app.get(baseUrl + '/detail/:id', auth.isAuthenticated, issueController.IssueDetail);


     /**
   * @api {get}  /api/v1/issues/detail/:id   Get Issue Details
   * @apiVersion 0.0.1
   * @apiName Get details of Issue
   * @apiGroup Issues
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   *  @apiParam {String}id     The id of the Issue passed as a URL parameter 
   *
   * 
   * @apiSuccessExample {json} Success-Response:
                   {
                      "error": false,
                      "message": "Issue Found Succesfully!!",
                      "status": 200,
                      "data": {
                          "watchers": [],
                          "_id": "5bcd6fd0550ad63984740a9b",
                          "issueId": "3PmhERM0g",
                          "reporterId": "r7zr9lBYw",
                          "repName": "pqr",
                          "assignee": "abc",
                          "title": "phone",
                          "status": "New",
                          "description": "<p>jsdhjhsj</p>",
                          "comments": "sjhfjkdshkjfhsd",
                          "createdOn": "22/9/2018",
                          "__v": 0
                      }
                  }
   *
   *
   */


    app.post(baseUrl + '/create', auth.isAuthenticated, issueController.createIssue);

      /**
   * @apiGroup Issues
   * @api {post}  /api/v1/issues/create   Create an Issue
   * @apiVersion 0.0.1
   * @apiName  Create an Issue
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} title title of the Issue passed as a body parameter.
   * @apiParam {String} assignee assignee of the Issue passed as a body parameter.
   * @apiParam {Boolean} comments comments of the Issue passed as a body parameter.
   * @apiParam {String} desc Description of the Issue passed as a body parameter.
   * @apiParam {String} reporterId Id of the reporter passed as a body parameter.
   * @apiParam {String} reporterName Name of the reporter passed as a body parameter.
   * @apiParam {String} status  Status of the Issue passed as a body parameter
   * 
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
                    {
                         "error":false,
                          "message":"Issue Created Successfully!!",
                          "status":200,
                           "data": [
                                {
                                    "watchers": [],
                                    "issueId": "NKIHLfg2T",
                                    "reporterId": "kgy4rY_F_",
                                    "repName": "soumya",
                                    "assignee": "abc",
                                    "title": "phonee",
                                    "status": "New",
                                    "description": "<p>changed desc second time fewf</p>",
                                    "comments": "fhsdjkhsjkd",
                                    "createdOn": "22/9/2018"
                                }
                            ]
   *                }
   *
   */


    
    app.put(baseUrl + '/update/:id', auth.isAuthenticated, issueController.editIssue);

      /**
   * @apiGroup Issues
   * @api {put}  /api/v1/issues/update/:id   Update an Issue 
   * @apiVersion 0.0.1
   * @apiName  Update  Issue
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} id Id of the Issue passed as a URL parameter.
   * @apiParam {String} option  value to be changed passed as a body parameter
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   *     {
   *       "error": False,
   *       "message": "Issue Updated Successfully!!",
   *        "status": 200,    
   *       "data": {
   *                   "n": 0,
   *                   "ok": 1
   *               }
   *     }
   *
   *
   */


    app.post(baseUrl + '/delete/:id', auth.isAuthenticated, issueController.deleteIssue);
     /**
   * @api {post}  /api/v1/issues/remove/:id    Delete an Issue
   * @apiVersion 0.0.1
   * @apiName  Delete an Issue
   * @apiGroup Issues
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} id Id of the Issue passed as a URL parameter.
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   *     {
   *       "error": False,
   *       "message": "Issue Deleted Successfully!!",
   *        "status": 200,    
   *        "data": {
   *                   "n": 0,
   *                   "ok": 1
   *               } 
   *     }
   *
   * 
   *
   * 
   *
   */


  app.post(baseUrl + '/watch/:issueId', auth.isAuthenticated, issueController.watchIssue);
  /**
* @apiGroup Issues
* @api {post}  /api/v1/issues/watch/:id    Watch an Issue
* @apiVersion 0.0.1
* @apiName  Watch an Issue
*
* @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
* @apiParam {String} id Id of the Issue passed as a URL parameter.
* @apiParam {String} userId Id of the user passed as a body parameter.
*  @apiParam {String} userName Name of the user passed as a body parameter.
* 
* @apiSuccessExample {json} Success-Response:
           {
                  "error": false,
                  "message": "Watcher added Succesfully!!",
                  "status": 200,
                  "data": {
                      "watchers": [
                          {
                              "id": "r7zr9lBYw",
                              "name": "pqr"
                          }
                      ],
                      "_id": "5bcd6fd0550ad63984740a9b",
                      "issueId": "3PmhERM0g",
                      "reporterId": "r7zr9lBYw",
                      "repName": "pqr",
                      "assignee": "abc",
                      "title": "phone",
                      "status": "New",
                      "description": "<p>jsdhjhsj</p>",
                      "comments": "sjhfjkdshkjfhsd",
                      "createdOn": "22/9/2018",
                      "__v": 1
                  }
          }
* 
*
* 
*
*/



app.get(baseUrl + '/unWatch/:issueId/:userId', auth.isAuthenticated, issueController.unWatchIssue);
/**
* @api {post}  /api/v1/issues/unWatch/:issueId/:userId    UnWatch an Issue
* @apiVersion 0.0.1
* @apiName   UnWatch an Issue
* @apiGroup Issues
*
* @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
* @apiParam {String} issueId  Id of the Issue passed as a URL parameter.
* @apiParam {String} userId   Id of the User passed as a URL parameter.
* 
* 
* @apiSuccessExample {json} Success-Response:
              {
                    "error": false,
                    "message": "Watcher removed Succesfully!!",
                    "status": 200,
                    "data": {
                        "watchers": [],
                        "_id": "5bcd6fd0550ad63984740a9b",
                        "issueId": "3PmhERM0g",
                        "reporterId": "r7zr9lBYw",
                        "repName": "pqr",
                        "assignee": "abc",
                        "title": "phone",
                        "status": "New",
                        "description": "<p>jsdhjhsj</p>",
                        "comments": "sjhfjkdshkjfhsd",
                        "createdOn": "22/9/2018",
                        "__v": 2
                    }
              }
*
* 
*
* 
*
*/



app.get(baseUrl + '/watchers/:issueId/:userId', auth.isAuthenticated, issueController.getWatchers);
/**
* @api {post}  /api/v1/issues/watchers/:issueId    Get Watchers
* @apiVersion 0.0.1
* @apiName  Get Watchers
* @apiGroup Issues
*
* @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
* @apiParam {String} issueId Id of the Issue passed as a URL parameter.
* @apiParam {String} userId  Id of the User passed as a URL parameter.
* 
* @apiSuccessExample {json} Success-Response:
               {
                    "error": false,
                    "message": "Watchers Found Succesfully!!",
                    "status": 200,
                    "data": [
                        {
                            "id": "r7zr9lBYw",
                            "name": "pqr"
                        }
                    ]
                }
*
* 
*
* 
*
*/

   }
   

module.exports = {
    setRouter: setRouter
}