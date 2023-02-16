/**
 * this file will validate the req body of ticket.
 */

const { User, Ticket } = require("../model");
const { userTypes, userStatus } = require("../utils/contants");

/**
 * validating the request body for create method.
 */

exports.validateReqBodyForCreatingTicket = async (req,res,next)=>{
    /**
     * Madatory fields -
     * 
     * title,
     * description,
     * 
     */
    if(!req.body.title){
        console.log("No title of the ticket provided !");
        return res.status(400).send({
            message : "No title of the ticket provided !"
        })
    }
    if(!req.body.description){
        console.log("No description of the ticket provided !");
        return res.status(400).send({
            message : "No description of the ticket provided !"
        })
    }


    /**
     * 
     * ticketPriority can be decided by the fact how urgent the ticket issue is or depending on the type of user.
     *      --- Gold User will get priority 1.
     *      --- Premium User will get priority 2.
     *      --- Normal User will get priority 3.
     *          (depending on the subscription they choose)
     * 
     * 
     * deciding type of user(Gold,Premium,Free) can only be decided by the admin user.
     *   
     * only admin can change the type of user(while updating).
     */

    /**
     * ticketPriority should be strictly not allowed to pass in the request body.
     */
    if(req.body.ticketPriority){
        console.log("not allowed to pass the ticketPriority in request body !");
        return res.status(400).send({
            message : "not allowed to pass the ticketPriority in request body !"
        })
    }

    /**
     * check is there any Engineer available or not
     */
    try{
        const engineer = await User.findOne({
            userType : userTypes.engineer,
            userStatus : userStatus.approved
        });
        if(!engineer){
            console.log("No enginner available ,all engineers are on strike !!!");
            return res.status(403).send({
                message : "No enginner available ,all engineers are on strike, kindly check after some time !"
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({
            message : err.name || "Internal Error !"
        })
    }

    /**
     * everything is ok,pass the control to next method
     */
    next();
}


/**
 * middleware for checking whether the caller who is tring to update the ticket is either
 * 
 * admin
 * owner
 * assignee
 */

exports.isValidTicketUpadteAccess = async (req,res,next)=>{
    /**
     * we will get userId after validating the ticket.
     */
    try{
        const user = await User.findOne({userId : req.userId});
        /**
         * ticketId will be provided in the path param.
         */
        const ticket = await Ticket.findOne({_id : req.params.id});
        /**
         * check if the user is wither [ admin or customer or engineer ].
         */
        if(user.userType == userTypes.admin){
            /**
             * ADMIN
             * 
             * admin has the access to update the ticket.
             */
            return next();
        }else if(user.userType == userTypes.engineer){
            /**
             * ENGINEER
             * 
             * we will pass the control to next middleware or method if one of the two conditions satisfied
             * 
             * a ) if the engineer is the assignee.
             * b ) if the engineer is the reporter or the owner of the ticket.
             */
            if(engineer.userId == ticket.assignee || ticket.reporter == engineer.userId){
                return next();
            }
        }else if(user.userType == userTypes.customer){
            /**
             * CUSTOMER
             * 
             * we will pass the control to next middleware if
             *           --- the user is the owner of the ticket.
             */
            if(user.userId == ticket.reporter){
                return next();
            }
        }

        /**
         * you don't have the access to update the ticket.
         */
        console.log("Not have permissions to update the ticket");
        res.status(403).send({
            message : "Not have permissions to update the ticket !! ,only ADMIN | OWNER | Assigned ENGINEER is allowed to update the ticker."
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({
            message : err.name || "Internal Error !"
        })
    }
}

/**
 * 
 * validating the ticket_id
 * 
 */

exports.isValidTicketId = async (req,res,next)=>{
    /**
     * find the ticket provided in the req.params
     */
    try{
        if(!require('mongoose').Types.ObjectId.isValid(req.params.id)){
            console.log("Not a valid id !");
            return res.status(400).send({
                message : "invalid id !"
            })
        }
        /**
         * check if the ticket is valid or not.
         */
        const ticket = await Ticket.findOne({_id : req.params.id});
        
        if(!ticket){
            console.log("No ticket with this ticket_id !!");
            return res.status(400).send({
                message : "No ticket with this ticket_id !!"
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({
            message : err.name || "Internal Error !"
        })
    }
    /**
     * everything is ok.
     */
    next();
}

/**
 * 
 * there are some field that can only be changed by ADMIN user.
 *      --- ticketPriority(changing the priority of the ticket).
 *      --- assignee(reassigning an engineer to a ticket).
 */

exports.isAdminUpdateForPrivateFields = async (req,res,next)=>{
    try{
        /**
         * finding the user
         */
        const user = await User.findOne({userId : req.userId});
        /**
         * changing the assignee of the ticket.
         */
        const ticket = await Ticket.findOne({_id : req.params.id});
        if(req.body.assignee && req.body.assignee != ticket.assignee){
            if(user.userType != userTypes.admin){
                console.log("Only admin can reassign a ticket to another engineer");
                return res.status(403).send({
                    message : "Only admin can reassign a ticket to another engineer"
                });
            }
            /**
             * admin access is there , now check whether engineer wth that userId exists or not.
             */
            const eng = await User.findOne({userId : req.body.assignee});
            if(!eng){
                console.log("No such eng exists with that Id !!");
                return res.status(400).send({
                    message : "No such eng exists with that Id !!"
                })
            }
            /**
             * eng exists now check if he is a verified engineer.
             */
            if(eng.userStatus != userStatus.approved){
                console.log(`ENGINEER is in ${eng.userStatus} state,so can't assign tickets to him !`);
                return res.status(400).send({
                    message : `ENGINEER is in ${eng.userStatus} state,so can't assign tickets to him !`
                })
            }
        }

        /**
         * changing the ticketPriority
         */
        if(req.body.ticketPriority && req.body.ticketPriority != ticket.ticketPriority){
            if(user.userType != userTypes.admin){
                console.log("Only admin can change the ticket-priority.");
                return res.status(403).send({
                    message : "Only admin can change the ticket-priority."
                });
            }
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({
            message : err.name || "Internal Error !"
        })
    }
    /**
     * everything is ok.
     */
    next();
}