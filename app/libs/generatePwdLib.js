const bcrypt = require('bcrypt')
const saltRounds = 10

const logger = require('./loggerLib')



let hashPassword = (myPlainTextPwd) => {
    let salt = bcrypt.genSaltSync(saltRounds)
    let hash = bcrypt.hashSync(myPlainTextPwd, salt)
    return hash
}

let comparePwd = (oldPwd, hashPwd, cb) => {
    bcrypt.compare(oldPwd, hashPwd, (err, res) => {
        if (err) {
            logger.error(err, 'Comparsion Error', 5)
            cb(err, null)
        } else {
            cb(null, res)
        }
    })
}


let comparePwdSync = (myPlainTextPwd, hash) => {
    return bcrypt.compareSync(myPlainTextPwd, hash)
}

module.exports = {
    hashPassword: hashPassword,
    comparePwd: comparePwd,
    comparePwdSync: comparePwdSync
}
