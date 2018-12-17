const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('MasterQuote.db');
const crypto = require('crypto');
const moment = require('moment');

/**
 * This function is called at application startup.  
 * You must create the PRODUCTS, CUSTOMERS, and ORDERS tables here.
 * Be sure to use the necessary SQL commands such that if the tables
 * already exist, the statements do not cause any errors, or any
 * data to be lost.
 * 
 * 
 * 10 Points
 */


 exports.build = function() {
    console.log("--- Initializing database");
    db.run("CREATE TABLE IF NOT EXISTS customers \
        (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, street TEXT, city TEXT, state TEXT, zip INT)");  
    db.run("CREATE TABLE IF NOT EXISTS products \
        (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL)");  
    db.run("CREATE TABLE IF NOT EXISTS orders \
        (id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INT, productId INT, date TEXT)");
    // db.run("CREATE TABLE IF NOT EXISTS UserAccount \
    //     (id INTEGER PRIMARY KEY AUTOINCREMENT, Username INT, productId INT, date TEXT)");
}

/**
 * This function retrieves orders and constructs an array 
 * of objects with additional details about the order's
 * customer and product.  You'll need to use JOIN to 
 * bring in all the necessary data.
 * 
 * The options object MAY include an "id" property.  If it does, 
 * this function should only return one order (of matching id). 
 * If the "id" property in "options" is not defined, return all orders.
 * 
 * Required return value:
 * An array of objects with the following structure:
 * 
 *   id (order ID)
 *   date (order Date)
 *   customer {
 *      id (customer ID)
 *      firstName (customer's first name)
 *      lastName (customer's last name)
 *   }
 *   product {
 *     id (product ID)
 *     name (product name)
 *     price (product price)
 *   }
 * 
 *  You are permitted to include additional data in the customer/product sub-objects
 *  as you wish.
 * 
 * 10 Points
 */

/**
 * This function retrieves customers and returns them as an array. 
 * 
 * The options object MAY include an "id" property.  If it does, 
 * this function should only return (an array of) one customer (of matching id). 
 * If the "id" property in "options" is not defined, return all orders.
 * 
 * Required return value: array of customer objects (with all customer data)
 * 
 * 5 Points
 */
 exports.getCustomers = function(QuoteReq, CustomerID, ProjectID, Address, callback) {
   
   var execute_sql_code="";

    if(QuoteReq !== "" && CustomerID !== "" && ProjectID !== ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE QuoteReq = " + QuoteReq + " AND CustomerID = " + CustomerID + " AND ProjectID = " + ProjectID;
        console.log('QuoteReq: '+ QuoteReq + ", CustomerID: " + CustomerID + ", ProjectID: " + ProjectID);
    }else if (QuoteReq !== "" && CustomerID !== ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE QuoteReq = " + QuoteReq + " AND CustomerID = " + CustomerID ;
        console.log('QuoteReq: '+ QuoteReq + ", CustomerID: " + CustomerID);
    }else if (QuoteReq !== "" && ProjectID !== ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE QuoteReq = " + QuoteReq + " AND ProjectID = " + ProjectID ;
        console.log('QuoteReq: '+ QuoteReq + ", ProjectID: " + ProjectID);
    }else if (ProjectID !== "" && CustomerID !== ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE ProjectID = " + ProjectID + " AND CustomerID = " + CustomerID ;
        console.log('ProjectID: '+ ProjectID + ", CustomerID: " + CustomerID);
    }else if (QuoteReq !== ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE QuoteReq = " + QuoteReq;
        console.log('QuoteReq: '+ QuoteReq);
    }else if(CustomerID !== ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE CustomerID = " + CustomerID;
        console.log('CustomerID: '+ CustomerID);
    }else if (ProjectID !== ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE ProjectID = " + ProjectID;
        console.log('ProjectID: '+ ProjectID);
    }else if(Address !=+ ""){
        execute_sql_code="SELECT * FROM QuoteDetails WHERE ALocation = " + Address;// + " OR ZLocation = " + Address;
        console.log("Address: "+ Address)
    }
    else{
        execute_sql_code="SELECT * FROM QuoteDetails order by QuoteReq";
    }  
  
    db.all(execute_sql_code,function(err,rows){
        if(err){
            callback(null, err);
        }else{
            callback(null, rows);;
        }
    });
    
}

/**
 * This function retrieves products and returns them as an array. 
 * 
 * The options object MAY include an "id" property.  If it does, 
 * this function should only return (an array of) one product (of matching id). 
 * If the "id" property in "options" is not defined, return all orders.
 * 
 * Required return value: array of product objects (with all product data)
 * 
 * 5 Points
 */


/**
 * This function accepts an order object an inserts it into the ORDERS table.
 * 
 * 5 Points
 */


/**
 * This function accepts a customer object an inserts or updates it into the CUSTOMERS table.
 * 
 * If customer.id is defined, the customer object represents an existing customer, and you 
 * must issue an update command.  Otherwise, insert.
 * 
 * 5 Points
 */
 exports.upsertCustomer = function(customer, callback) {
/*
    var sql = 'SELECT * FROM QuoteDetails WHERE CustomerID =' + customer.CustomerID;
    db.run(sql, function(err, results) {
        if (err){
            throw err;
        }else{
            console.log('Query result: ' + results);
        }
    });
*/
    
    //console.log(moment.tz.guess())
    //currentDate = datetime.toISOString().slice(0,4) + datetime.toISOString().slice(5,7) + datetime.toISOString().slice(8,10) + count.toString();
    //count++;
    var datetime = new Date();
    console.log(datetime)
    var contract = Array.prototype.join.call(customer.ContractLength, ",");
    
    for(i=0; i<customer.ContractLength.length; i++){
        var datetime = new Date();
        currentDate = datetime.toISOString().slice(0,4) + datetime.toISOString().slice(5,7) + datetime.toISOString().slice(8,10) + "." +datetime.toISOString().slice(11,25) ;
        var alocation = customer.AStreet +', ' +customer.AFloor +', ' +customer.ACity +', ' +customer.AState +'-'+ customer.AZipCode +', ' + customer.ACountry;
        var zlocation = customer.ZStreet +', ' +customer.ZFloor +', ' +customer.ZCity +', ' +customer.ZState +'-'+ customer.ZZipCode +', ' + customer.ZCountry;
        db.run("INSERT INTO QuoteDetails(CustomerID, ProjectID, QuoteReq,Client,ALocation,AStreet,AFloor,ACity,AState,AZipCode,ACountry,Latency, ZLocation,ZStreet,ZFloor,ZCity,ZState,ZZipCode,ZCountry, Product, Bandwidth, ContractLength)\
            VALUES(?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)", customer.CustomerID, customer.ProjectID, currentDate, customer.Client,alocation,customer.AStreet,customer.AFloor,customer.ACity,customer.AState,customer.AZipCode,customer.ACountry, customer.Latency, zlocation,customer.ZStreet,customer.ZFloor,customer.ZCity,customer.ZState,customer.ZZipCode,customer.ZCountry, customer.Product, customer.Bandwidth, customer.ContractLength[i]);    
    
    }
    
    
    callback(null, null);
}


exports.updateCustomer = function(customer, callback){
    console.log(customer); 
    var contract = Array.prototype.join.call(customer.ContractLength, ",");

    //console.log(typeof(customer.ContractLength));
    var alocation = customer.AStreet +', ' +customer.AFloor +', ' +customer.ACity +', ' +customer.AState +'-'+ customer.AZipCode +', ' + customer.ACountry;
    var zlocation = customer.ZStreet +', ' +customer.ZFloor +', ' +customer.ZCity +', ' +customer.ZState +'-'+ customer.ZZipCode +', ' + customer.ZCountry;
    
    db.run("UPDATE QuoteDetails SET QuoteReq = ?, Client = ?, ALocation = ?, AStreet = ?, AFloor = ?, ACity = ?, AState= ?, AZipCode=?, ACountry=?, Latency= ?, ZLocation=?, ZStreet=?, ZFloor=?, ZCity=?, ZState=?, ZZipCode=?, ZCountry=?, Product=?, Classification=?, Bandwidth=?, ContractLength=? WHERE QuoteReq = ?", 
        //[{QuoteReq: customer.QuoteReq}, {Client: customer.Client}, {ALocation: alocation}, {AStreet: customer.AStreet}, {AFloor: customer.AFloor},{ACity: customer.ACity}, {AState: customer.AState}, {AZipCode: customer.AZipCode}, {ACountry: customer.ACountry}, {ZLocation: zlocation}, {ZStreet: customer.ZStreet}, {ZFloor: customer.ZFloor}, {ZCity: customer.ZCity}, {ZState: customer.ZState}, {ZZipCode: customer.ZZipCode}, {ZCountry: customer.ZCountry}, {Product: customer.Product}, {Classification: customer.Classification}, {Bandwidth: customer.Bandwidth}, {ContractLength: contract}, customer.QuoteReq]);
        [customer.QuoteReq, customer.Client, alocation, customer.AStreet, customer.AFloor, customer.ACity, customer.AState, customer.AZipCode, customer.ACountry, customer.Latency, zlocation, customer.ZStreet, customer.ZFloor, customer.ZCity, customer.ZState, customer.ZZipCode, customer.ZCountry, customer.Product, customer.Classification, customer.Bandwidth, contract, customer.QuoteReq]);
    callback(null, null);
}

exports.deleteCustomer = function(customer, callback){
    console.log(customer);  
    db.run("DELETE FROM QuoteDetails WHERE QuoteReq = ?", [customer.QuoteReq]);
    callback(null, null);

}

exports.upsertUserName = function(customer, callback) {
    saltAndHash(customer.pass, function(hash){
        customer.pass = hash;
        // append date stamp when record was created //
        customer.date = moment().format('MMMM Do YYYY, h:mm:ss a');
        // accounts.insert(newData, {safe: true}, callback);

        //console.log(typeof(customer.ContractLength));
        db.run("INSERT INTO UserAccount(Username, Password, Name, Email, Date)\
        VALUES(?, ?, ?, ?, ?)", customer.user, customer.pass, customer.name, customer.email, customer.date);


        callback(null, null);
    });
    
}

exports.manualLogin = function(user, pass, callback)
{
    var execute_sql_code = "SELECT * FROM UserAccount WHERE Username=\"" + user+ "\"" ;
    console.log(user);

    db.all(execute_sql_code,function(err,rows){
            if (err || rows.length <= 0){
                callback('user-not-found');
            }	else{
                validatePassword(pass, rows[0].Password, function(err, res) {
                    if (res){
                        callback(null, rows[0]);
                    }	else{
                        callback('invalid-password');
                    }
                });
            }
        });
}

exports.validateResetLink = function(email, passHash, callback)
{

    db.run(("SELECT * FROM UserAccount WHERE email=\"" + email + "\""), function (e, o){
        callback (o ? 'ok' : null);
    });

}

exports.getAccountByEmail = function(email, passHash, callback)
{
    db.run("SELECT * FROM UserAccount WHERE email=\"" + email + "\"");

}



/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

var isEmpty = function(object){
    if (object == null){
        return true;
    }
    else{
        return false;
    }
}