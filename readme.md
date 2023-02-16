# CRM(Customer Relationship Management) Service API

---

- This main feature of the CRM application is to resolve the user complaints(issue raised by the user through the ticket creation).

### Features

---

- User SignUp(Registration) and SignIn Functionality
- Admin registration will be from the backend directly.(For testing purpose, doing it, from the veryFirst time server started) Though, the ADMIN user creation request are taken and send it with response as BAD REQUEST status.
- Engineer registration will be supported through API, but it needs to be approved by the ADMIN to signIn successfully into the system.
- Customer registration will be supported through API with no approval needed from the ADMIN.
- API to support the ADMIN/CUSTOMER/ENGINEER signIn. SignIn will be successfull in case of users with APPROVED userStatus . Successfull SignIn API call should return the access token, which will be used by the concerned user to make all the other calls on the protected endpoints.
- On ticket creation by the user, an engineer (with approved status) will be auto assigned the ticket who has minimum number of tickets assigned to him. In case,by any chance , no approved engineer is available during ticket creation,the message will be displayed that "No enginner available ,all engineers are on strike, kindly check after some time !".And we are sending the mail notification, to the admin also for every ticket creation, so immediately admin can have a look and assing an engineer by approving a engineer.
- On ticket creation and updation, a email will be send automatically to all the concerned users of those tickets .This has been done with the help of another notificationService API, which has been integrated with this CRM.
- Tickets and users can be queried based on various optional query Parameters.Only the concerned user will get the results of those that they are authorised for.
- ADMIN has all the rights.
- Customer has the rights related to ticket created by own.
- Engineer has the rights with the tickets created or tickets assigned.
- On sucessfull updation of ticketStatus, repsective engineeraffected property will also be updated internally.
- Only the ADMIN can change the assignee of the ticket.
- There is one restriction on the ADMIN too, admin can't change the  assingee and ticketStatus at same time, as it may result inconsitency over the data.

### Code organisation in the repository-

---

The whole code base is arranged in multiple directories and files.
Project follows Models, Controllers, Routes (MCR Architecture Pattern), to arrange the code.

1. Models directory contain files dealing with the defining the database Schemas.
2. Controllers directory contain files dealing with handling the core business logic.
3. Routes directory contain the files managing with the routes.
4. Middlewares directory to define all middlewares(generally related for validating incoming requests).
5. Utils directory contains the files that have reusable code(functions).
6. Configs directory for all configs file to configure all the configurations realted to server,database and authentication.
7. The main startup file is "index.js".

### Tech

---

CRM Service API, uses a number of open source projects (all are npm packages) to work properly:

- [Express](https://www.npmjs.com/package/express)- Express is a web framework for node. Using it to create a server and managing dofferent routes.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - For hashing the secret credentials of the user and verifying them.
- [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv to load environment variables from a .env file into process.env
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) -For creating access token and verifying them.
- [mongoose](https://www.npmjs.com/package/mongoose) - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
- [node-rest-client](https://www.npmjs.com/package/node-rest-client) - Allows connecting to any API REST and get results as js Object. In our case, using it to connect to notificationService API.
- this app requires Node.js(Runtime Environment) v16+ and mongodb v5+(Database, for persistance of data) to run.

#### Install the dependencies and devDependencies by following instructions.

```sh
cd CRM
npm install
```

##### Before running the app locally, ensure to put all the configurable properties in .env file(following seperation of concern design principle).

##### IMPORTANT NOTE-This App integrated with a notification service app, to send email notification asynchronously to the concerned members of the ticket on ticket creation and updation. So before running this app,ensure to configure and run the [notification service API](https://github.com/varshney565/NotificationService)

### Installation

---

- To make CRM is up and running in your machine, follow the below steps after all configuration and related dependecies installation done.

```sh
cd CRM
npm run serve
```

Express application,CRM API will up and running on configured port.

### Different REST endpoints available ---

---

### 1.SignUp Request

---

```sh
POST /crm/api/v1/auth/signup

Sample request body :
{
    "userId" : "shivam565",
    "name" : "shivamvarshney",
    "email" : "shivamvarshney566@gmail.com",
    "userType" : "CUSTOMER",
    "password" : "Customer12345@"
}
Sample response body :
{
    "message": "Successfully added.",
    "user": {
        "userId": "shivam565",
        "name": "shivamvarshney",
        "email": "shivamvarshney566@gmail.com",
        "userType": "CUSTOMER",
        "userStatus": "APPROVED",
        "createdAt": "2023-02-16T08:38:16.230Z",
        "updatedAt": "2023-02-16T08:38:16.230Z"
    }
}
```

Details about the JSON structure (Request Body)

- name : Mandatory
- userId : Manadatory and Unique
- email : Manadatory and Unique
- passworod : Mandatory and must have minimum 8 characters, having at least 1 uppercase alphabet, 1 digit and 1 special character.
- userType : Mandatory
  Allowed values : ADMIN | ENGINEER | CUSTOMER
- userStatus : It reperesents the status of the registered user. Customer are by default approved.Engineers need approval from Admin.If any User status updated to ADMIN,then userStatus for that user will become PENDING irrespective of its previous userstatus, So Only Authorised ADMIN(With approved Status) can approve status of any newADMIN or Engineer, so to allow the user into the system.
  Allowed values : APPROVED | PENDING | REJECTED

#### 2. SignIn request

---

```sh
POST /crm/api/v1/auth/signin

Sample request body :
{
    "userId" : "shivam565",
    "password" : "Customer12345@"
}
Sample response body : 
{
    "message": "Successfully Logged In",
    "userDetails": {
        "name": "shivamvarshney",
        "email": "shivamvarshney566@gmail.com",
        "userId": "shivam565",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNoaXZhbTU2NSIsImlhdCI6MTY3NjUzNjczNiwiZXhwIjoxNjc2NTM5NzM2fQ.OhBohTjqavCpdm3Q3OgyXCydC99xBCpztOVdSDF170o",
        "userType": "CUSTOMER",
        "userStatus": "APPROVED",
        "createdAt": "2023-02-16T08:38:16.230Z",
        "updatedAt": "2023-02-16T08:38:16.230Z"
    }
}
```

##### NOTE-

- Every User will get the accessToken after successfull signIn ,so to allow user to pass that token as x-access-token in headers along with request, instead of sending user credentials (like userId and password) to authenticate and authorized the user request on protected endpoints.If token verfied , then only user allowed to access the restricted resource data.

#### 3. Get all Users details, Request (Only ADMIN WITH Approved Status ALLOWED,TO get all the users details)

---

```sh
GET /crm/api/v1/users
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFkbWluMDAxIiwiaWF0IjoxNjc2NTM2OTE4LCJleHAiOjE2NzY1Mzk5MTh9.CyWu8CNa-cuLa2hiRR9cXR1FiJDct77XZZRw4T0Kp3g

Sample request body : <EMPTY>
Sample response body : 
{
    [
        {
            "name": "Shivam Varshney",
            "email": "shivamvarshney565@gmail.com",
            "userId": "Admin001",
            "userType": "ADMIN",
            "userStatus": "APPROVED",
            "createdAt": "2023-02-16T08:32:16.424Z",
            "updatedAt": "2023-02-16T08:32:16.425Z"
        },
        {
            "name": "shivamvarshney -03",
            "email": "uietcse1923shivamvarshney@kuk.ac.in",
            "userId": "shivam56",
            "userType": "ENGINEER",
            "userStatus": "PENDING",
            "createdAt": "2023-02-16T08:33:29.038Z",
            "updatedAt": "2023-02-16T08:33:29.038Z"
        },
        {
            "name": "shivamvarshney",
            "email": "shivamvarshney566@gmail.com",
            "userId": "shivam565",
            "userType": "CUSTOMER",
            "userStatus": "APPROVED",
            "createdAt": "2023-02-16T08:38:16.230Z",
            "updatedAt": "2023-02-16T08:38:16.230Z"
        }
    ]
}

```

##### NOTE-

- ADMIN User may pass optional queryParameter, while sending the GET all users request, to filter the response.QueryParameter taken into account are -userStatus amd userType.

#### 4. Get all Users details BASED on Optional QueryParameter, Request (Only ADMIN WITH Approved Status ALLOWED,TO get all the users details)

---

```sh
GET /crm/api/v1/users?userType=<value>&userStatus=<value>

GET /crm/api/v1/users?userType=ENGINEER  (EXAMPLE)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjU5NzAyOTQ3LCJleHAiOjE2NTk3MDY1NDd9.Bo_55aJrEGg7vLUr1pCJg4Iu2ZTMHEWLsYUo0J86KTc

Sample request body : <EMPTY>
Sample response body : 
{
    [
        {
            "name": "shivamvarshney -03",
            "email": "uietcse1923shivamvarshney@kuk.ac.in",
            "userId": "shivam56",
            "userType": "ENGINEER",
            "userStatus": "PENDING",
            "createdAt": "2023-02-16T08:33:29.038Z",
            "updatedAt": "2023-02-16T08:33:29.038Z"
        }
    ]
}
```

#### 5. Get specific user based on userId, Request (Only ADMIN and the Concerend User(with approved Status), allowed to get specific user details)

---

```sh
GET /crm/api/v1/users/:userId

GET /crm/api/v1/users/shivam56 (Example)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjU5NzAyOTQ3LCJleHAiOjE2NTk3MDY1NDd9.Bo_55aJrEGg7vLUr1pCJg4Iu2ZTMHEWLsYUo0J86KTc

Sample request body : <EMPTY>
Sample response body : 
{
    [
        {
            "name": "shivamvarshney -03",
            "email": "uietcse1923shivamvarshney@kuk.ac.in",
            "userId": "shivam56",
            "userType": "ENGINEER",
            "userStatus": "PENDING",
            "createdAt": "2023-02-16T08:33:29.038Z",
            "updatedAt": "2023-02-16T08:33:29.038Z"
        }
    ]
}
```

#### 6. Update specific user based on userId(passed as a request params), Request (Only ADMIN and the Concerend User(with approved Status), allowed to update user details)

---

```sh
PUT /crm/api/v1/users/:userId

PUT /crm/api/v1/users/shivam56 (EXAMPLE)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjU5NzAyOTQ3LCJleHAiOjE2NTk3MDY1NDd9.Bo_55aJrEGg7vLUr1pCJg4Iu2ZTMHEWLsYUo0J86KTc

Sample request body :
{
    "userStatus":"APPROVED"
}
Sample response body : 
{
    "message": "successfully updated.",
    "user": [
        {
            "name": "shivamvarshney -03",
            "email": "uietcse1923shivamvarshney@kuk.ac.in",
            "userId": "shivam56",
            "userType": "ENGINEER",
            "userStatus": "APPROVED",
            "createdAt": "2023-02-16T08:33:29.038Z",
            "updatedAt": "2023-02-16T08:33:29.038Z"
        }
    ]
}
```

#### 7. User can raise a issue , by Creating A Ticket

---

```sh
POST /crmservice/api/v1/tickets
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1c3RvbWVyMSIsImlhdCI6MTY1OTcwNDA3OCwiZXhwIjoxNjU5NzA3Njc4fQ.atlYh08btee-HN91sE9zkGPsnZx33nCWYk-8A0B_ZNM

Sample request body :
{
    "title":"Problem in printer",
    "description":"Printer is not working, showing error 254 while printing and stopped."  
}
Sample response body :
{
    "success": true,
    "message": "Ticket successfully created."
}

```

Details about the JSON structure (Request Body)

- title : Mandatory
- description : Manadatory
- ticketPriority : should not be provided while creating the ticket admin will decide the Priority of ticket.
  Allowed values and their denotion priority : 4 -low | 3-medium | 2-high | 1-extreme

##### NOTE-

- Ticket reporter value(useId) will be taken from the user details who requested the ticketCreation request.
- Ticket will be auto assigned to an approved engineer having least number of ticketsWorkingOnCount.
- Ticket Status ,will be auto assigned  status as "OPEN" on ticket Creation.
  (Other allowed values of ticket Status are - BLOCKED | CLOSED).
- As , the notifcationService is integrated with the CRM, so sending the mail(auto-mail) to all concerened Users, request will be also taken care by the notificationService after successfull ticketCreation.

#### 8. Get all the tickets

---

```sh
GET /crm/api/v1/tickets
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjU5NzA0MTk2LCJleHAiOjE2NTk3MDc3OTZ9.2R0nRRNAqEP9oZj0hiMnKkZXRTB69AQ7ONcJfNHTxKc

Sample request body : <EMPTY>
Sample response body : 
{
    "success": true,
    "documentResultsCount": 3,
    "data": [
        {
            "_id": "62ed134ee134ad67c6c61e68",
            "title": "Problem in printer",
            "ticketPriority": 4,
            "description": "Printer is not working, showing error 254 while printing and stopped.",
            "status": "OPEN",
            "reporter": "customer1",
            "assignee": "engineer1",
            "createdAt": "2022-08-05T12:55:42.348Z",
            "updatedAt": "2022-08-05T12:55:42.348Z"
        },
        {
            "_id": "62ed13d3e134ad67c6c61e75",
            "title": "Problem in mobile phone",
            "ticketPriority": 4,
            "description": "Mobile phone is not working, restarting automatically after 5 minute of usage.",
            "status": "OPEN",
            "reporter": "customer1",
            "assignee": "engineer2",
            "createdAt": "2022-08-05T12:57:55.314Z",
            "updatedAt": "2022-08-05T12:57:55.314Z"
        },
        {
            "_id": "62ed140be134ad67c6c61e80",
            "title": "Problem in mobile phone",
            "ticketPriority": 4,
            "description": "Mobile phone is not working, restarting automatically after 10 minute of usage.",
            "status": "OPEN",
            "reporter": "customer2",
            "assignee": "engineer3",
            "createdAt": "2022-08-05T12:58:51.352Z",
            "updatedAt": "2022-08-05T12:58:51.352Z"
        }
    ]
}
```

##### NOTE-

- User with Admin userType (with approved status) can get all the tickets details.
- User with Engineer userType, can get only those tickets details  that are either assigned to or created by the concerned user.
- Through this, an engineer can easily fetch all those tickets assigned to him/her and by passing optional queryParams ,can get quickly the data based on the given query.
- User with Customer userType , can get only those tickets details that are created by the concerned  user.


#### 9. Update specific ticket based on ticketId(passed as a request params), Request (Only ADMIN and the Concerend User(with approved Status), allowed to update ticket details)

---

```sh
PUT /crm/api/v1/tickets/:ticketId

PUT /crm/api/v1/tickets/62ed134ee134ad67c6c61e68 (EXAMPLE)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVuZ2luZWVyMSIsImlhdCI6MTY1OTcwNTU3NiwiZXhwIjoxNjU5NzA5MTc2fQ.nbGk5DssjZTkoUlo6wBcDlJbpLSAnLhND2lj4ODrwcU

Sample request body :
{
    "status":"CLOSED"   
}
Sample response body :
{
    "success": true,
    "message": "Ticket successfully updated."
}
```

##### NOTE-

- Based on update request , there are several behind the actions (usually updation on the concerned document) taken.
- For updation of ticket status from OPEN TO CLOSED/BLOCKED , the concerned ticket has been updated and also assigned engineer - ticketsWorkingCount decremented by 1.
- In case of ticket assigneee changed from one engineer to another engineer , ticketAssigned property value affected for both concerned engineers(concerned ticket pop out from previous assigned engineer ticketsAssigned details and push to another engineer ticketsAssigned details).
- Also in case of changing assignee for a ticket with Open status, ticketsWorkingCount from previousAssignedEngineer decremented by 1 and incremented by 1 for the newAsssigned Engineer.
- In case, tickets status is CLOSED or BLOCKED, then ticketsWorkingCount doesnt affect for both engineers.

#### 10. Get specific ticket details based on ticketId, Request (Only ADMIN and the Concerend User(with approved Status), allowed to get specific ticket details)

---

```sh
GET /crm/api/v1/tickets/:ticketId

GET /crm/api/v1/tickets/62ed134ee134ad67c6c61e68 (Example)
Headers :
 Content-Type:application/json
 x-access-token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwiaWF0IjoxNjU5NzAyOTQ3LCJleHAiOjE2NTk3MDY1NDd9.Bo_55aJrEGg7vLUr1pCJg4Iu2ZTMHEWLsYUo0J86KTc

Sample request body : <EMPTY>
Sample response body : 
{
    "success": true,
    "data": {
        "_id": "62ed134ee134ad67c6c61e68",
        "title": "Problem in printer",
        "ticketPriority": 4,
        "description": "Printer is not working, showing error 254 while printing and stopped.",
        "status": "CLOSED",
        "reporter": "customer1",
        "assignee": "engineer1",
        "createdAt": "2022-08-05T12:55:42.348Z",
        "updatedAt": "2022-08-05T13:20:40.752Z"
    }
}
```