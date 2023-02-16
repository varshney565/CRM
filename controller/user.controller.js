/**
 * This file will have the logic to fetch users based on (filter) userType,userStatus,... or fetch all the users.
 * 
 */

const { User } = require("../model");
const objectConvertor = require('../utils/objectConverter');

/**
 * Fething all the users.
 */
exports.findAll = async (req,res) => {
    /**
     * checking if anything has been provided in query-params or not.
     */
    const queryObj = {};
    const userType = req.query.userType;
    const userStatus = req.query.userStatus;
    const name = req.query.name;
    if(userStatus){
        queryObj.userStatus = userStatus;
    }
    if(userType){
        queryObj.userType = userType;
    }
    if(name){
        queryObj.name = name;
    }
    /**
     * finding the users.
     */
    try{
        const users = await User.find(queryObj);
        console.log(users);
        const Response = objectConvertor(users);
        res.status(200).send(Response);
    }catch(err){
        console.log("some internal error while fetching the users");
        res.status(500).send({
            message : err.name || "Internal Error"
        });
    }
}

/**
 * Fetching a User based on userId
 */

exports.findByUserId = async (req,res)=>{
    /**
     * get the userId from the path param.
     */
    const id = req.params.id;
    /**
     * find the user based on userId.
     */
    try{
        const user = await User.find({userId : id});
        res.status(200).send(objectConvertor(user));
    }catch(err){
        console.log(err);
        res.status(500).send({
            message : err.name || "Some Internal Error"
        })
    }
}

/**
 * Updating a User based on userId
 */

exports.update = async (req,res)=>{
    const user = await User.findOne({userId : req.params.id});
    user.name = req.body.name ? req.body.name : user.name;
    user.userStatus = req.body.userStatus ? req.body.userStatus : user.userStatus;
    user.userType = req.body.userType ? req.body.userType : user.userType;
    await user.save();
    console.log(`${user.userId} has been updated.`);
    res.status(200).send({
        message : "successfully updated.",
        user : objectConvertor([user])
    });
}