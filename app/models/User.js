'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  userName: {
    type: String,
    unique : true,
    default: ''
  },
  password: {
    type: String,
    default: 'passskdajakdjkadsj'
  },
  email: {
    type: String,
    unique : true,
    default: ''
  },
  mobile: {
    type: Number,
    default: 0
  },
  dob: {
    type : Date,
    default :''
  },
  createdOn :{
    type:Date,
    default:""
  }

})


mongoose.model('User', userSchema);