
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const issues = new Schema ({
    issueId : {
        type :String,
        unique:true
    },
    reporterId :{
        type: String
    },
    repName :{
        type: String
    },
    assignee : {
        type : String
        // unique: true
    },
    status: {
        type:String
    },
    title : {
        type:String
    },
    description :{
        type : String
    },
    watchers :{
        type :Array
    },
    comments : {
        type :Object
    },
    createdOn : {
        type : String
    }
})


issues.index({
    title: 'text'
  });


mongoose.model('Issue',issues)