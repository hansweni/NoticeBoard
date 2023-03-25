const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports ={
    signAccessToken : (userId) => {
        return new Promise((resolve, reject) => {
        const payload = {}
        const secret = process.env.ACCESS_TOKEN_SECRET
        const option = {
            expiresIn : '30m',
            issuer : "Himanshu.com",
            audience : userId
        }
        JWT.sign(payload, secret, option, (err, token) => {
            if (err){
                console.log(err.message)
                reject(createError.InternalServerError)
            }
            resolve(token)
        })

        })
    }
}
