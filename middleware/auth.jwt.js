/**
 *
 * this file is used to validate that the token provided is valid or not.
 * 
 */

const jwt = require('jsonwebtoken');


/**
 * validate the token.
 */

exports.verifyToken = async (req,res,next)=>{
    /**
     * checking if token is provided or not.
     */
    let token = req.headers['x-access-token'];
    if(!token){
        console.log("No token Provided !");
        res.status(400).send({
            message : "No token provided"
        })
        return;
    }
    /**
     * verifying the token
     */
    try{
        const result = await jwt.verify(token,process.env.secret);
        req.userId = result.id;
    }catch(err){
        console.log("Not a valid token !!");
        res.status(401).send({
            message : "Not a valid token !!"
        })
        return;
    }

    //everything is ok
    next();
}

