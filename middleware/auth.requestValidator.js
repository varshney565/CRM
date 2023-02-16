/**
 * This file is for validating the signin and signup request body
 */

const { User } = require("../model");
const { userTypes ,userStatus} = require('../utils/contants');

exports.validateSignUpRequestBody = async (req,res,next) => {
    /**
     * a ) checking whether 
     *     name,
     *     userId,
     *     email,
     *     password,
     *     userType
     *     those fields are provided or not.
     * 
     * b)  checking userId and email is not present in the database (unique userId and email should be provided)
     * 
     * c)  checking email is in the valid format
     * 
     * d)  checking password is of minimum length 5 and it has one special character,
     *     one uppercase letter and one numberic number also.
     * 
     * e)  if userType is "ADMIN",prompt a msg that admin registration can only be done through backend.
     * 
     * f)  userType can only belong to ["CUSTOMER","ENGINEER"].
     * 
     * g)  userStatus should not be provided by api it should be done by backend only.
     * 
     */

    //a ) =======================================================================
    /**
     * checking userId is present
     * */
    if(!req.body.userId){
        console.log("userId is not provided by user.");
        res.status(400).send({
            message : "userId is not provided(Mandatory field)"
        });
        return;
    }

    /**
     * checking email is present
     * */
    if(!req.body.email){
        console.log("email is not provided by user.");
        res.status(400).send({
            message : "email is not provided(Mandatory field)"
        });
        return;
    }

    /**
     * checking name is present
     * */
    if(!req.body.name){
        console.log("name is not provided by user.");
        res.status(400).send({
            message : "name is not provided(Mandatory field)"
        });
        return;
    }

    /**
     * checking password is present
     * */
    if(!req.body.password){
        console.log("password is not provided by user.");
        res.status(400).send({
            message : "password is not provided(Mandatory field)"
        });
        return;
    }

    /**
     * checking userType is present
     * */
    if(!req.body.userType){
        console.log("userType is not provided by user.");
        res.status(400).send({
            message : "userType is not provided(Mandatory field)"
        });
        return;
    }

    //b ) =======================================================================
    /**
     * userId and Email
     * */
    try{
        /**
         * check that user with given userId does't exist.
         * */
        let user = await User.findOne({userId : req.body.userId});
        if(user){
            console.log("UserId already exists.");
            res.status(403).send({
                message : "UserId already exists."
            });
            return;
        }

        /**
         * 
         * check that user with given email does't exist
         * 
         */
        user = await User.findOne({email : req.body.email});
        if(user){
            console.log("email already exists.");
            res.status(403).send({
                message : "email already exists."
            });
            return;
        }
    }catch(err){
        console.log(err);
        console.log("Error while validating the req body for signup.")
        res.status(500).send({
            message : "Error while validating the req body for signup"
        })
        return;
    }

    //c ) =======================================================================
    /**
     * checking email is valid email.
     * */
    const isValidEmail = (email)=>{
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }

    /**
     * [^characters](.[^characters])* | "any text"
     * @
     * [A-Za-z0-9...](.[A-Za-z0-9...]{2,})+ or [number.number.number.number] 
     */
    
    if(!isValidEmail(req.body.email)){
        console.log("Invalid Email");
        return res.status(400).send({
            message : "Invalid Email"
        });
    }

    //d ) =======================================================================
    

    /**
     * checking password must have atleast 8 characters
     * */
    if(req.body.password.length < 8){
        console.log("password must have atleast 8 characters.");
        res.status(400).send({
            message : "password must have atleast 8 characters"
        });
        return;
    }   

    /**
     * checking password must have atleast one special character.
     * */
    const SpecialCharacter = (password) => {
        return String(password).match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
    };
    
    if(!SpecialCharacter(req.body.password)){
        console.log("Password must contain alleast one special character.");
        return res.status(400).send({
            message : "Password must have atleast one special character"
        });
    }

    /**
     * checking password must have atleast one numeric number.
     * */
    const NumericNumber = (password) => {
        return String(password).match(/\d/);
    }
    if(!NumericNumber(req.body.password)){
        console.log("Password must contain alleast one numeric number.");
        return res.status(400).send({
            message : "Password must have atleast one numeric number"
        });
    }

    /**
     * checking password must have atleast one Uppercase letter.
     * */
    const UppercaseChar = (password) => {
        return String(password).match(/[A-Z]/);
    }
    if(!UppercaseChar(req.body.password)){
        console.log("Password must contain alleast one upper-case character.");
        return res.status(400).send({
            message : "Password must have atleast one upper-case character"
        });
    }


    //e ) =======================================================================
    /**
     * make sure user don't have userType as ADMIN
     * */
    
    if(req.body.userType == userTypes.admin){
        console.log("ADMIN can't be added through APIs");
        res.status(400).send({
            message : "ADMIN can't be added through APIs"
        })
        return;
    }

    //f ) =======================================================================
    /**
     * userType can only belong to ["CUSTOMER","ENGINEER"]
     * */
    
    if(req.body.userType != userTypes.customer && req.body.userType != userTypes.engineer){
        console.log("No such userType !");
        return res.status(400).send({
            message : "No such userType !"
        });
    }

    

    //g ) =======================================================================
    /**
     * userStatus should not be provided by customer
     * */
    if(req.body.userStatus){
        console.log("UserStatus should not be provided by user.");
        return res.status(400).send({
            message : "UserStatus should not be provided,it will be provided by backend upon signup status."
        });
    }
    

    //everything is fine , pass the controller to next method.
    next();
};


/**
 * 
 * middleware for signin req body.
 * 
 * */

exports.validateSignInRequestBody = async (req,res,next)=>{
    /**
     * check that use has provided a userId
     * */
    if(!req.body.userId){
        console.log("UserId not provided !");
        res.status(400).send({
            message : "UserId not provided !"
        })
        return;
    }

    /**
     * check that user has provided password
     * */

    if(!req.body.password){
        console.log("password not Provided !");
        res.status(400).send({
            message : "password not provided"
        })
        return;
    }

    /**
     * 
     * find the user with that userId 
     * and check if user with given userId exists or not
     * 
     * */
    
    const user = await User.findOne({userId : req.body.userId});
    if(!user){
        console.log("No such user with this userId.");
        res.status(400).send({
            message : "Failed! No such user with this userId"
        })
        return;
    }

    /**
     * check if the userStatus is not PENDING is yes : he can't login.
     */
    if(user.userStatus == userStatus.pending){
        res.status(403).send({
            message : "Not have permisions, must be approved by ADMIN first."
        })
        return;
    }

    //pass the control,everything is ok
    next();
}