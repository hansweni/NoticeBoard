const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports ={
verifyAccessToken: (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies['ACCESS_TOKEN']) throw createError.Unauthorized('Session Expired Login Again');
        JWT.verify(cookies.ACCESS_TOKEN, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if (err) {
                throw createError.Unauthorized('Not A Valid Token');
            }
        }) 
        next(); 
    }catch (error) {
       res.status(401).send(error);
    }
   
  }
}