const http = require('http');
const express = require('express');
const app = express();
const busboy = require('express-busboy');
const port = process.env.PORT || 9000;

var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');

var nodemailer = require('nodemailer');
// bootstrap the database schema
require("./database").build();

var SessionStore = require('express-mysql-session')(session)

var sessionStore = new SessionStore(/*options*/);
app.use(session({
    key: 'hello_world',
    secret: 'thisisasecretkey',
    Store: sessionStore,
    resave: true,
    saveUninitialized: true
}))

app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

busboy.extend(app,{});

const root = require("./routes/index");
const orders = require("./routes/orders");
const customers = require("./routes/customers");
const products = require("./routes/products");
const reports = require("./routes/reports");
app.use(function(req, res, next){
    res.locals.moment = require("moment");
    next();
})
app.use("/", root);
app.use("/order", orders);
app.use("/customer", customers);
app.use("/product", products);
app.use("/reports", reports);
app.use("/public", express.static(__dirname + "/public"))


http.createServer(app).listen(port);
console.log("Web application running @ http://localhost:" + port);
