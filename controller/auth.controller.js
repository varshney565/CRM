/**
 * This file will contain the logic for the registration of the user and login of the user.
 * 
 */

/**
 * 
 * User : 
 * 
 *      Customer : 
 *          1. Registered and is approved by default.
 *          2. Should be able to login immediately.
 *      
 *      Engineer
 *          1. Should be able to registered.
 *          2. Initially he/she will be in pending state.
 *          3. Admin should be able to approve this.
 * 
 *      Admin : 
 *          1. Admin user should be only created from the backend.No API should be supported for this.
 * 
 */

const {User} = require('../model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userTypes ,userStatus} = require('../utils/contants');

/**
 * Logic for signup
 */

exports.signup = async (req,res)=>{
    /**
     * read the data from the req body.
     */

    const user = {
        userId : req.body.userId,
        name : req.body.name,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,8),
        userType : req.body.userType
    }

    if(user.userType == userTypes.engineer){
        user.userStatus = userStatus.pending
    }
    /**
     * insert the data in database and return the response
     */
    try{
        const userCreated = await User.create(user);
        console.log(`${userCreated.name} has been added in the database.`);
        /**
         * we should return the newly created user as the response but 
         * we should remove sensitive fields like
         *      - password
         *      - __V
         *      - _id
         * Now we need to create custom response and return
         */
        const response = {
            userId : userCreated.userId,
            name : userCreated.name,
            email : userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus,
            createdAt : userCreated.createdAt,
            updatedAt : userCreated.updatedAt
        }
        
        res.status(201).send({
            message : "Successfully added.",
            user : response
        })
    }catch(err){
        console.log("Some error while creating the user.");
        console.log(err);
        res.status(500).send({
            messgae : err.name || "Internal Error"
        })
    }
}


/**
 * Logic for signin
 */

exports.signin = async (req,res)=>{
    /**
     * I will be provided the userId and password.
     */
    const userData = {
        userId : req.body.userId,
        password : req.body.password
    };

    try{
        /**
         * find the user
         */
        const user = await User.findOne({userId : userData.userId});
        /**
         * Whether password is correct or not.
         */
        const result = bcrypt.compareSync(userData.password,user.password);
        if(!result){
            console.log("Wrong Password Provided.");
            res.status(401).send({
                message : "Wrong Password Provided."
            })
            return;
        }

        /**
         * Generate a Token.
         */
        const token = jwt.sign({id : user.userId,},process.env.secret,{
            expiresIn : 3000
        });
        /**
         * Return the response.
         */
        const response = {
            name  : user.name,
            email : user.email,
            userId : user.userId,
            token : token,
            userType : user.userType,
            userStatus : user.userStatus,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt
        }
        res.status(200).send({
            message : "Successfully Logged In",
            userDetails : response
        })
    }catch(err){
        console.log("some error while logging in");
        console.log(err);
        res.status(500).send({
            message : err.name || "Internal Erorr"
        });
    }
}