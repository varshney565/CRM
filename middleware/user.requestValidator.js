/**
 * this file is used to validate req body of user related activities.
 * 
 * this file will validate some user activities like : 
 *
 * checks whether user is admin or not.
 * checks whether userId is valid that got provided in path param.
 * check if the caller is the owner or the admin.
 * checks only admin is allowed to update userStatus and userType.
 */



const { User } = require('../model');
const { userTypes } = require('../utils/contants');


/**
 * checks whether userId is valid that got provided in path param.
 */

exports.isValidUserIdInPathparam = async (req,res,next)=>{
    /**
     * getting the id from path param
     */
    const id = req.params.id;
    /**
     * check whether user with that useId exists or not
     */
    try{
        const user = await User.findOne({userId : id});
        if(!user){
            console.log("No such user with this userId !!");
            res.status(400).send({
                message : "No such user with this userId found !!"
            })
            return;
        }
    }catch(err){
        console.log("some error while fetching the user (validating the userId in path-param) !");
        res.status(500).send({
            message : err.name || "Internal error"
        });
        return;
    }

    //pass the control to next call
    next();
}

/**
 * checks whether user is admin or not.
 * 
 */

exports.isAdmin = async (req,res,next)=>{
    /**
     * I will have the userId already in the req body that i have got from verifySignup method.
     */

    /**
     * find the user whose userId is req.userId
     */

    const user = await User.findOne({userId : req.userId});
    if(user.userType != userTypes.admin){
        console.log("You don't have permission,only ADMIN has the provision.");
        res.status(403).send({
            message : "You don't have permission,only ADMIN has the provision"
        });
        return;
    }
    /**
     * everything is ok , pass the control to next middleware.
     */

    next();
}



/**
 * 
 * check if the caller is the owner or the admin.
 */

exports.isOwnerOrAdmin = async (req,res,next)=>{
    /**
     * take the userId from the req
     * which we have got after validating the token
     */
    const Id = req.userId;
    /**
     * find the user
     */
    try{
        const user = await User.findOne({userId : Id});
        /**
         * check if the user id admin or not
         */
        if(user.userType == userTypes.admin){
            /**
             * pass the control to next call,
             * because admin has the access to fetch any record.
             * */
            next();
            return;
        }
        /**
         * take the userId from path param
         */
        const user_id = req.params.id;
        /**
         * if user_id that we have got from path param is same as the Id that we got after validating the token
         * are same means, it is owner.
         */
        if(user_id == Id){
            /**
             * owner is the Caller
             * pass the control to next call.
             */
            next();
            return;
        }
    }catch(err){
        console.log("some error while fetching the user !!");
        res.status(200).send({
            message : err.name || "Internal Error"
        });
        return;
    }
    console.log("You don't have the permissions,only owner or admin is allowed to make this call");
    res.status(403).send({
        message : "You don't have the permissions,only owner or admin is allowed to make this call"
    });
}

/**
 * checks only admin is allowed to update userStatus and userType.
 */

exports.isAdminUpdate = async (req,res,next) => {
    /**
     * check if userStatus and UserType is provided in request body or  not
     */
    const obj = {};
    if(req.body.userType){
        obj.userType = req.body.userType;
    }
    if(req.body.userStatus){
        obj.userStatus = req.body.userStatus;
    }

    if(Object.keys(obj).length > 0){
        //now check if admin access is there or not, if not caller can't make this call.
        try{
            const user = await User.findOne({userId : req.userId});
            if(user.userType != userTypes.admin){
                console.log("You don't have permission to make this call , only admin user can make this call(update)!!");
                res.status(403).send({
                    message : "You don't have permission to make this call , only admin user can make this call!!"
                })
                return;
            }
        }catch(err){
            console.log("some internal error while fetching the user !");
            res.status(500).send({
                message : err.name || "Internal Error"
            });
            return;
        }
    }else{
        if(!req.body.name){
            console.log("No request body providerd !");
            res.status(400).send({
                message : "No request body provided !!"
            });
            return;
        }
    }
    
    next();
}