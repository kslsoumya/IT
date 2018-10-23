let socketio = require('socket.io')
const events = require('events')
const mongoose = require('mongoose')
const tokenLib = require('../libs/tokenLib')
const issueModel = mongoose.model('Issue');


let setServer = (server) => {
    let onlineUsers =[];

    let io = socketio.listen(server)
    let myIo = io.of('/')

    myIo.on('connection', (socket) => {

        socket.on('set-user', (authToken) => {
            console.log('set-user called')
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth Token' })
                } else {
                    console.log('user is verified.. setting details of user')
                    let currentUser = user.data;
                    socket.userId = currentUser.userId
                    if (onlineUsers.indexOf(currentUser.userId) === -1) {
                        onlineUsers.push(currentUser.userId)
                        socket.join(currentUser.userName);
                    }
                }
            })
        })
        socket.on('modifyIssue', (id) => {
            issueModel.findOne({ 'issueId': id }, (err, result) => {
                if (err) {
                    console.log(error + 'In sending Notification------------');
                } else {
                    console.log(result+'issue----')
                    const data = {
                        issueId: id,
                        msg: `The Issue ${result.title} has been updated.`
                    }
                    socket.to(id).emit('issueUpdate', data)
                    socket.to(result.repName).emit('issueUpdate', data)
                    socket.to(result.assignee).emit('issueUpdate', data)
                }


            })
        })

        socket.on('watchIssue', (issueId) => {
            socket.join(issueId);
        })

        socket.on('unWatchIssue', (issueId) => {
            socket.leave(issueId);
        })

        socket.on('disConnect', () => {
            // console.log('user is disconnected');
            // console.log(socket.userId)
            var removeIndex = onlineUsers.map((user) => {
                return user.userId
            }).indexOf(socket.userId)
            onlineUsers.splice(removeIndex, 1)
            console.log(onlineUsers)
            socket.leave(socket.room)
        })
    })




}


module.exports = {
    setServer: setServer
}