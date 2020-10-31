const express = require("express");
const fs = require("fs");
const hbs = require("hbs");
const bodyParser = require('body-parser')
const keys = require('./config/keys')

const app = express()
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');// module for parsing cookies
const flash = require('connect-flash');

const ConnectBase = require("./users").ConnectBase;
const Uri = require("./users").Uri


const function_1 = require("./Task_1")
const function_2 = require("./Task_2")
const function_3 = require("./Task_3")

const title = "Web Program"
const port_ = 3000
const passport = require('./config/passportJS').passport
require("passport-local")

ConnectBase(Uri);

app.set("view engine", "hbs");
hbs.registerPartials("./views/partials/")
app.use(express.static("public"));

app.use(flash());           //управление сообщения на flash
                            // эти сообщения сохраняются в сессии,нужно для ошибок в регистраци и логине
                            //Сессия - промежуток времени, в теч которого пользователь находится на сайте
app.use(cookieSession({
    name: "session",        //по умолчанию
    keys: [keys.session.cookieKey],    //Список ключей, используемых для подписи и проверки значений файлов cookie
    maxAge: 900000,
    secure: false,//логическое значение, указывающее, должен ли cookie пересылаться только по HTTPS
    signed: true//логическое значение, указывающее, должен ли быть подписан файл cookie
}));
app.use(cookieParser());

app.use(bodyParser.json())  //для обработки post запросов
                            // извлекает всю часть тела вход потока запросов
app.use(bodyParser.urlencoded({extended: true}))

app.use(passport.initialize()); //аутентификация для nodejs
app.use(passport.session());    //If your application uses persistent login sessions,
                                // passport.session() middleware must also be used.

app.use(LoggingToConsole);      // middleware Logging Request


app.get('/registration',function (req,res){
    res.render('registration.hbs',{
        path: "/registration",
        errorMessage: req.flash('error')
    })
    //console.log(req.flash());
})

app.get('/signIn',function(req,res){
        res.render('signIn.hbs',{
            path: '/signIn',
            errorMessage: req.flash('error')
        })
})

app.post('/signIn', passport.authenticate('authentication',{
    successRedirect: '/',
    failureRedirect: '/signIn',
    failureFlash: true
}))


app.post('/registration',passport.authenticate('registration',{
    successRedirect:'/signIn',
    failureRedirect: '/registration',
    failureFlash: true
}))

app.get('/',function(request,response){
    response.render("home.hbs", {
        title: title,
        information: "There are three functions:",
        lab1: "◄ Sort string characters",
        lab2: "◄ Camel register",
        lab3: "◄ Definition Day Off"
    })
})

app.get('/api/LukinaValeria/lab1/1_Input',function (request,response){
    response.render('camelRegister.hbs',{
        title: title,
        path: "/api/LukinaValeria/lab1/1_Result"
    })
})

app.get("/api/LukinaValeria/lab1/1_Result",passport.authenticate('cookie-session',{
    failureRedirect: '/signIn',
    failureFlash: true
}), function (req,res){
    let answer = function_1.CamelRegister(req.query.String);
    res.render('camelRegisterResult.hbs',{
        title: title,
        yourQuery: req.query.String,
        answer: answer
    })
})

app.get('/api/LukinaValeria/lab1/2_Input', function (request,response) {
    response.render('sortFunction.hbs', {
        title: title,
        path: "/api/LukinaValeria/lab1/2_Result"
    })
})

//app.get("/api/LukinaValeria/lab1/2_Result", AuthUser,function(request,response){
app.get("/api/LukinaValeria/lab1/2_Result", passport.authenticate('cookie-session',{
    failureRedirect: '/signIn',
    failureFlash: true
}), function(request,response){
    let answer = function_2.SortString(request.query.StringForSort)
    response.render('sortFunctionResult.hbs', {
        title: title,
        yourQuery: request.query.StringForSort,
        answer: answer,
    })
})

app.get('/api/LukinaValeria/lab1/3_Input',function (request,response){
    response.render('dayOff.hbs',{
        title: title,
        path: "/api/LukinaValeria/lab1/3_Result"
    })
})

//app.get('/api/LukinaValeria/lab1/3_Result', AuthUser, function(request,response,next) {
app.get('/api/LukinaValeria/lab1/3_Result',passport.authenticate('cookie-session',{
    failureRedirect: '/signIn',
    failureFlash: true
}),function(request,response,next) {
    if (Number(request.query.month_)> 12  ||
        Number(request.query.month_) < 0 ||
        Number(request.query.date_) < 1 ||
        Number(request.query.date_) > 31 ||
        Number(request.query.year_) == null ||
        Number(request.query.month_) == null ||
        Number(request.query.date_) == null)
    {
        next(new Error('403_WrongValue'))
        return
    }
    let answer = function_3.DayOff(request.query.year_,request.query.month_-1,request.query.date_)

    response.render("dayOffResult.hbs",{
        title: title,
        yourYear: request.query.year_ ,
        yourMonth: request.query.month_ ,
        yourDate: request.query.date_,
        answer: answer
    })
})

//дополнительный обработчик ошибок для 404
app.use((req, res, next) => {
    next(new Error('404'))
})

app.use(LogError);
let ser = app.listen(port_,()=>{
    console.log("Server started at", port_)
});

//ser.close()

///////////////// - middleware - /////////////////

function AuthUser(req,res,next) {
    let login = req.query.login
    if (login === "admin") {
        next();
    }
    else {
        next(new Error('403_Access'))
    }
}

function LoggingToConsole(req,res,next) {
    let CurrentDate = new Date();
    let FormattedDate =
        CurrentDate.getFullYear() +
        "-" +
        CurrentDate.getMonth() +
        "-" +
        CurrentDate.getDate() +
        " " +
        CurrentDate.getHours() +
        ":" +
        CurrentDate.getMinutes() +
        ":" +
        CurrentDate.getSeconds();
    let Method = req.method
    let Url = req.url
    let Log = `[${FormattedDate}] ${Method} ${Url} `; //` - brace
    console.log(Log);
    next();
}

///////////////// - errors - /////////////////

function LogError(err,req,res,next) {
    switch (err.message){
        case '403_WrongValue':
            res.render("errors.hbs", {
                title: title,
                tit: "ERROR:",
                errorStatus: 403,
                errorMessage: "Incorrect data entered!"
            });
            break;
        case '403_Access':
            res.render("errors.hbs", {
                title:title,
                tit: "ERROR:",
                errorStatus: 403,
                errorMessage: "You don't have access"
            });
            break;
        case '404':
            res.render("errors.hbs", {
                title: title,
                tit: "ERROR:",
                errorStatus: 404,
                errorMessage: "This page does not exist"
            });
            break;
        default:
            res.render("errors.hbs", {
                title: title,
                tit: "ERROR:",
                errorStatus: 500,
                errorMessage: "Internal Server Error"
            });
    }

    let CurrentDate = new Date();
    let Url = req.url
    let Log = `Error: ${err.message} -- ${CurrentDate} ${Url} `;

    fs.appendFile("LogErrors.txt",Log + '\n',function(err){
        if (err) throw err;
        console.log("File recording is complete.")
    })
}
