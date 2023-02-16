/**
 * This file is responsible for routing the incoming request to the corrosponding controller method.
 * 
 * This file has the routes for signup and signin
 */

const { signup, signin } = require("../controller");
const { signupValidator, signinValidator } = require("../middleware");

module.exports = (app)=>{
    /**
     * sign up : 
     * 
     * POST   /crm/api/v1/auth/signup
     */
    app.post("/crm/api/v1/auth/signup",[signupValidator],signup);
    /**
     * sign in : 
     * 
     * POST /crm/api/v1/auth/signin
     */
    app.post("/crm/api/v1/auth/signin",[signinValidator],signin);
}