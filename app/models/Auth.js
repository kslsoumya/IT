
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const Auth = new Schema ({
    userId: {
        type: String
    },
    authToken :{
        type: String
    },
    tokenSecret : {
        type: String
    },
    tokenGenTime :{
        type: Date,
        default : time.now()
    }
})


mongoose.model('Auth',Auth)