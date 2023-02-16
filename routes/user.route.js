/**
 * This file will route the incoming request to the corroponding user.controller method.
 */

const { findAll, findByUserId, update } = require("../controller");
const { isAdmin, verifyToken, isOwnerOrAdmin, isValidUserIdInPathparam, isAdminUpdate } = require("../middleware");

module.exports = (app)=>{
    /**
     * GET    "/crm/api/v1/users?userType='CUSTOMER'&userStatus='ACCEPTED'"
     * GET    "/crm/api/v1/users"
     */
    app.get("/crm/api/v1/users",[verifyToken ,isAdmin],findAll);
    /**
     * GET    "/crm/api/v1/users/:id"
     */
    app.get("/crm/api/v1/users/:id",[verifyToken,isValidUserIdInPathparam,isOwnerOrAdmin],findByUserId);
    /**
     * PUT    "/crm/api/v1/users/:id"
     */
    app.put("/crm/api/v1/users/:id",[verifyToken,isValidUserIdInPathparam,isAdminUpdate,isOwnerOrAdmin],update);
}