const shortId = require('shortid');
const mongoose = require('mongoose')
const express = require('express')
const issueModel = mongoose.model('Issue')
// Libs----
const logger = require('../libs/loggerLib')
const apiResponse = require('../libs/responseLib')
const check = require('../libs/checkLib')
const timeLib = require('../libs/timeLib')

// Lists all the Issues

let listIssues = (req, res) => {

    let query = {
        assignee: { $eq: req.params.userName }
    }
    issueModel.find(query)
        .select('-__v -_id')
        .skip(parseInt(req.query.skip) || 0)
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(`Error Occured : ${err}`, 'controller : listIssues', 10)
                let response = apiResponse.generate(true, 'Some error Occured', 500, err)
                res.send(response)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'controller : listIssues', 10)
                let response = apiResponse.generate(true, 'No Issue Found!!', 404, [])
                res.send(response)
            } else {
                logger.info('Issues Found Succesfully', 'controller : listIssues', 10)
                let response = apiResponse.generate(false, 'Issues Found Succesfully!!', 200, result)
                res.send(response)
            }
        })
}

// Details of Issue-------

let IssueDetail = (req, res) => {
    issueModel.findOne({ 'issueId': req.params.id }, (err, result) => {
        if (err) {
            logger.error(`Error Occured : ${err}`, 'controller : Issue Detail', 10)
            let response = apiResponse.generate(true, 'Some error Occured', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No Issue Found', 'controller : Issue Detail', 10)
            let response = apiResponse.generate(true, 'No Issue Found!!', 404, err)
            res.send(response)
        } else {
            logger.info('Issues Found Succesfully', 'controller : Issue Detail', 10)
            let response = apiResponse.generate(false, 'Issue Found Succesfully!!', 200, result)
            res.send(response)
        }
    })
}

// Creating a Issue------------

let createIssue = (req, res) => {
    const uniqueId = shortId.generate()
    const today = timeLib.now();

    let IssueEntry = new issueModel({
        issueId: uniqueId,
        reporterId: req.body.reporterId,
        repName: req.body.reporterName,
        assignee: req.body.assignee,
        title: req.body.title,
        status: req.body.status,
        description: req.body.desc,
        comments: req.body.comments,
        createdOn: new Date().getDate() + '/' + new Date().getMonth() + '/' + new Date().getFullYear()
    })
    IssueEntry.save((err, result) => {
        if (err) {
            logger.error(`Some Error Occured ${err}`, 'controller:createIssue', 10)
            let response = apiResponse.generate(true, 'Some Error Occured', 500, err)
            res.send(response)
        } else {
            let response = apiResponse.generate(false, 'Issue Created Successfully!!', 200, result)
            res.send(response)
        }
    })
}

// Updating the details of a Issue ----------

let editIssue = (req, res) => {
    let options = req.body;
    issueModel.update({ 'issueId': req.params.id }, options, { multi: true }).exec((err, result) => {

        if (err) {
            logger.error(`Some Error Occured ${err}`, 'controller:editIssue', 10)
            let response = apiResponse.generate(true, 'Some error Occured!!', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No Issue Found!!', 'controller:editIssue', 10)
            let response = apiResponse.generate(true, 'No Issue Found', 404, err)
            res.send(response)
        } else {
            logger.info('Issue updated Successfully !!', 'controller:editIssue', 10)
            let response = apiResponse.generate(false, 'Issue updated Successfully !!', 200, result)
            res.send(response)
        }
    });
}

// Deleting a Issue  ------

let deleteIssue = (req, res) => {
    issueModel.remove({ 'issueId': req.params.id }, (err, result) => {
        // console.log(req.params.id + '-------');
        if (err) {
            logger.error(`Some Error Occured ${err}`, 'controller:deleteIssue', 10)
            let response = apiResponse.generate(true, 'Some error Occured!!', 500, err)
            res.send(response)
        } else if (check.isEmpty(result) || result.n === 0) {
            logger.info('No Issue Found!!', 'controller:deleteIssue', 10)
            let response = apiResponse.generate(true, 'No Issue Found', 404, err)
            res.send(response)
        } else {
            logger.info('Issue removed Successfully !!', 'controller:deleteIssue', 10)
            let response = apiResponse.generate(false, 'Issue removed Successfully !!', 200, result)
            res.send(response)
        }
    })
}

// Search an Issue

let searchIssues = (req, res) => {

    issueModel.find( { $text: { $search: req.params.searchText ,$caseSensitive: false}})
        .select('-__v -_id')
        .skip(parseInt(req.query.skip) || 0)
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(`Error Occured : ${err}`, 'controller : searchIssues', 10)
                let response = apiResponse.generate(true, 'Some error Occured', 500, err)
                res.send(response)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'controller : searchIssues', 10)
                let response = apiResponse.generate(true, 'No Issue Found!!', 404, [])
                res.send(response)
            } else {
                logger.info('Issues Found Succesfully', 'controller : searchIssues', 10)
                let response = apiResponse.generate(false, 'Issues Found Succesfully!!', 200, result)
                res.send(response)
            }
        })
}


// Watch an Issue

let watchIssue = (req, res) => {
    var userId = req.body.userId;
    var userName = req.body.userName;
    issueModel.findOne({ 'issueId': req.params.issueId }, (err, result) => {
        if (err) {
            logger.error(`Error Occured : ${err}`, 'controller :Watch Issue', 10)
            let response = apiResponse.generate(true, 'Some error Occured', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No Issue Found', 'controller : Watch Issue', 10)
            let response = apiResponse.generate(true, 'No Issue Found!!', 404, err)
            res.send(response)
        } else {
            logger.info('Issue Found Succesfully', 'controller : Watch Issue', 10)

            if (result.watchers.findIndex((val) => { return val.id === userId }) === -1 || result.watchers.length ===0) {
                result.watchers.push({ id: userId, name: userName });
                result.save((err, result) => {
                    if (err) {
                        logger.error(`Error Occured : ${err}`, 'controller :Watch Issue', 10)
                        let response = apiResponse.generate(true, 'Some error Occured', 500, err)
                        res.send(response)
                    } else {
                        logger.info('Watcher added Succesfully', 'controller : Watch Issue', 10)
                        let response = apiResponse.generate(false, 'Watcher added Succesfully!!', 200, result)
                        res.send(response)
                    }
                })

            } else {
                logger.info(`Not added`, 'controller :Watch Issue', 10)
                let response = apiResponse.generate(true, 'Not added', 500, null)
                res.send(response)

            }
        }
    })
}

// UnWatch an Issue


let unWatchIssue = (req, res) => {
    var userId = req.params.userId;
    issueModel.findOne({ 'issueId': req.params.issueId }, (err, result) => {
        if (err) {
            logger.error(`Error Occured : ${err}`, 'controller :Watch Issue', 10)
            let response = apiResponse.generate(true, 'Some error Occured', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No Issue Found', 'controller : Watch Issue', 10)
            let response = apiResponse.generate(true, 'No Issue Found!!', 404, err)
            res.send(response)
        } else {
            logger.info('Issue Found Succesfully', 'controller : Watch Issue', 10)
            result.watchers.splice(result.watchers.findIndex((val) => { return val.id === userId }), 1)
            result.save((err, result) => {
                if (err) {
                    logger.error(`Error Occured : ${err}`, 'controller :Watch Issue', 10)
                    let response = apiResponse.generate(true, 'Some error Occured', 500, err)
                    res.send(response)
                } else {
                    logger.info('Watcher removed Succesfully', 'controller : Watch Issue', 10)
                    let response = apiResponse.generate(false, 'Watcher removed Succesfully!!', 200, result)
                    res.send(response)
                }
            })

        }
    })
}

// Get watchers of a specific issue

let getWatchers = (req, res) => {
    issueModel.findOne({ 'issueId': req.params.issueId }, (err, result) => {
        if (err) {
            logger.error(`Error Occured : ${err}`, 'controller : getWatchers', 10)
            let response = apiResponse.generate(true, 'Some error Occured', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No Issue Found', 'controller : getWatchers', 10)
            let response = apiResponse.generate(true, 'No Issue Found!!', 404, err)
            res.send(response)
        } else {
            let index =result.watchers.findIndex((val) => {return val.id === req.params.userId })
            if(index !== -1) {
            result.watchers.splice(index, 1)
            }
            logger.info('Watcher Found Succesfully', 'controller : getWatchers', 10)
            let response = apiResponse.generate(false, 'Watchers Found Succesfully!!', 200, result.watchers)
            res.send(response)
        }
    })

}


module.exports = {
    listIssues: listIssues,
    IssueDetail: IssueDetail,
    createIssue: createIssue,
    editIssue: editIssue,
    deleteIssue: deleteIssue,
    searchIssues : searchIssues,
    watchIssue: watchIssue,
    unWatchIssue: unWatchIssue,
    getWatchers: getWatchers
}

