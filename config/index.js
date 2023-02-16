if(process.env.NODE_ENV != 'production'){
    //it will read all the (k,v) pairs of .env file and insert them into process.env gloval object
    require('dotenv').config();
}


/**
 * Now DB_URL,secret,port are set into process.env
 */