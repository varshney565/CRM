const { ticketStatus } = require("../utils/contants")

module.exports = (mongoose)=>{
    const ticketSchema = new mongoose.Schema({
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        ticketPriority : {
            type : Number,
            required : true,
            default : 3
        },
        status : {
            type : String,
            default : ticketStatus.open,
            enum : [ticketStatus.open,ticketStatus.closed,ticketStatus.blocked]
        },
        reporter : {
            type : String,
            required : true
        },
        assignee : {
            type : String
        },
        createdAt : {
            type : Date,
            immutable : true,
            default : ()=>Date.now()
        },
        updatedAt : {
            type : Date,
            default : ()=>Date.now()
        }
    },{versionKey : false }); //it will ensure that __v is not created by mongoose.
    return mongoose.model('Ticket',ticketSchema);
}