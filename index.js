/**
 * This is the starting point of the application.
 */

const express = require("express");
const app = express();
const bcrypt = require('bcrypt');

/**
 * 
 * if NODE_ENV is not production.
 * setting the congiguration data in process.env ; 
 * 
 */

require('./config');

/**
 * body-parser
 */
const bp = require('body-parser');
app.use(bp.json());
app.use(bp.text());
app.use(bp.urlencoded({extended : true}));
/**
 * getting all the collections present in database.
 * 
 */
const {User} = require('./model');






/**
 * 
 * making a connection to DB.
 * 
 * 
 * it is more reliable (bettwe way) of connecting to MongoDB.
 */
const mongoose = require('mongoose');
mongoose.connect(process.env.DBURL);
const database = mongoose.connection;
database.on("error",()=>{
    console.log("Error while connecting to MongoDB.");
});
database.once("open",()=>{
    console.log("app is connected to the database.");
    init();
});

// /**
//  * create the admin user at the boot time.
//  */
async function init(){
    /**
     * check if the admin user is already present or not
     */
    const user = await User.findOne({userType : "ADMIN"});
    if(user){
        console.log("ADMIN user is already present.");
        return;
    }
    User.create({
        name : "Shivam Varshney",
        userId : "Admin001",
        email : "shivamvarshney565@gmail.com",
        password : bcrypt.hashSync("shivam12345",8),
        userType : "ADMIN"
    });
    console.log("ADMIN user has been successfully created.");
}



/**
 * routes for auth.
 * 
 */
require('./routes/auth.routes')(app);
/**
 * route for users.
 */
require('./routes/user.route')(app);
/**
 * route for tickets.
 */
require('./routes/ticket.routes')(app);



/**
 * Running the application
 */
app.listen(process.env.PORT,()=>{
    console.log("server started running on port number : ",process.env.PORT);
})