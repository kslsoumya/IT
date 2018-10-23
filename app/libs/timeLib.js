const moment = require('moment')
const momenttz = require('moment-timezone')
const timeZone = 'Asia/Calcutta'
let now = () => {
  return moment.utc().format()
}

let getLocalTime = () => {
  return moment().tz(timeZone).format()
}

let parsedDate =(date) => {
  return moment.utc(date).format()
}

let convertToLocalTime = (time) => {
  return momenttz.tz(time, timeZone).format('LLLL')
}
let convertFormat =(date) =>{
  return moment(date).format('LLLL')
}


module.exports = {
  now: now,
  getLocalTime: getLocalTime,
  convertToLocalTime: convertToLocalTime,
  parsedDate : parsedDate,
  convertFormat : convertFormat
}