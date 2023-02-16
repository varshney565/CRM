const { userStatus , userTypes} = require("../utils/contants");

module.exports = (mongoose)=>{
    const userSchema = new mongoose.Schema({
        name : {
            type : String,
            required : true
        },
        userId : {
            type : String,
            required : true,
            unique : true
        },
        email : {
            type : String,
            unique : true,
            minLength : 10,
            required : true,
            lowercase : true
        },
        password : {
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            immutable : true,
            default : ()=>{
                return Date.now();
            }
        },
        updatedAt : {
            type : Date,
            default : () => Date.now()
        },
        userType : {
            type : String,
            required : true,
            default : userTypes.customer,
            enum : [userTypes.customer,userTypes.engineer,userTypes.admin]
        },
        userStatus : {
            type : String,
            required : true,
            default : userStatus.approved,
            enum : [userStatus.pending,userStatus.approved,userStatus.rejected]
        },
        ticketsCreated : {
            type : [mongoose.SchemaTypes.ObjectId],
            ref : "Ticket"
        },
        ticketsAssigned : {
            type : [mongoose.SchemaTypes.ObjectId],
            ref : "Ticket"
        },
        openTickets : {
            type : Number,
            default : 0
        }
    });
    return mongoose.model('user',userSchema);
}