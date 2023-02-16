/**
 * this file will have the logic to connect to the notification service.
 */

const Client = require("node-rest-client").Client;
/**
 * client object which will be used for calling the REST APIs
 */
const client = new Client();

/**
 * exposing a method which takes request parameters for sending the notification request
 * to the notification service.
 */

module.exports = (subject,content,recepientEmails,requester)=>{
    /**
     * create the request body.
     */
    const reqBody = {
        subject : subject,
        content : content,
        recepientEmails : recepientEmails,
        requester : requester
    }
    /**
     * Prepare the headers
     */
    const reqHeader = {
        "Content-Type": "application/json"
    }

    /**
     * Combine headers and req body together
     */

    const args = {
        data: reqBody,
        headers: reqHeader
    }
    /**
     * Make a POST call and handle the response.
     */
    console.log(args);
    try{
        client.post(process.env.post_end_point, args , (data,res)=>{
            console.log("Request Sent");
            /**
             * data  : parsed res body.
             * res   : raw response.
             */
            console.log(data);
        })
    }catch(err){
        console.log(err.message);
    }
}