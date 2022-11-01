import jwt from 'jsonwebtoken'

function createToken(userId) {
    const token = jwt.sign(
        {
            id: userId,
        },
        process.env.SECRET_KEY
    )
    return token
}

function validateToken(req,res,next) {
    const authToken = req.headers.authorization
    if (!authToken) {
        res.status(401).json({
            errorMsg: "No authToken found",
        })
        return
    }
    
    let userId

    jwt.verify(authToken,process.env.SECRET_KEY,(err,decoded)=>{
        if (err) {
          res.status(401).json({
            errorMsg: "Invalid authToken"
          })
          return  
        }

        userId = decoded.id
        req.body.userId = userId
        next()
    })
}


export { createToken,validateToken}
