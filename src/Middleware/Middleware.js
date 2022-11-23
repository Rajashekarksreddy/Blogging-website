let jwt = require('jsonwebtoken')

const aunthetication = async function(req,res, next){
    const token = req.headers["x-api-key"]
    if(!token){
    res.status(403).send({status:false, message:"missing aunthetication token in request"})
    }

    const decodedToken = jwt.verify(token , "uranium");

    if(!decodedToken){
        return res.status(403).send({status:false, message:'invalid aunthetication token in request'})
    }

    next()
}


const autherization = async function(req, res, next){
    let authorId = req.body.authorId
    if(!authorId){
        return res.status(400).send({status:false, message:"authorid required"})
    }

    const token = req.headers["x-api-key"]

    const decodedToken = jwt.verify(token, "uranium")
    console.log(decodedToken)

    if(decodedToken.authorId !== authorId) {
        return res.status(400).send("unauthorized access")
    }

    req.authorId = decodedToken.authorId
    console.log(req.authorId)
    next()
}

module.exports.aunthetication = aunthetication
module.exports.autherization = autherization
