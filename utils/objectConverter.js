module.exports = (users)=>{
    const Response = [];
    users.forEach(user => {
        Response.push({
            name : user.name,
            email : user.email,
            userId : user.userId,
            userType : user.userType,
            userStatus : user.userStatus,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt
        });
    });
    return Response;
}