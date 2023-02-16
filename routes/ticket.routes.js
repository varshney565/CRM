const { createTicket, searchTicket, updateTicket } = require('../controller');
const { verifyToken, validateReqBodyForCreatingTicket , isValidTicketUpadteAccess,isValidTicketId ,isAdminUpdateForPrivateFields} = require('../middleware');

module.exports = (app)=>{
    /**
     * route for creating a ticket
     * 
     * 
     * PUT    https://localhost:/8080/crm/api/v1/tickets
     */
    app.post("/crm/api/v1/tickets", [ verifyToken,validateReqBodyForCreatingTicket ] ,createTicket);
    /**
     * route for searching a ticket.
     * 
     * 
     * GET    https://localhost:/8080/crm/api/v1/tickets
     */
    app.get("/crm/api/v1/tickets", [verifyToken] , searchTicket);
    /**
     * route for updating a ticket.
     * 
     * 
     * PUT    https://localhost://8080/crm/api/v1/tickets/:id
     */
    app.put("/crm/api/v1/tickets/:id",[verifyToken, isValidTicketId,isValidTicketUpadteAccess, isAdminUpdateForPrivateFields] , updateTicket);

}