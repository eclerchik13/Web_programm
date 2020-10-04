const express = require("express");
const fs = require("fs");
const hbs = require("hbs")

const function_1 = require("./Task_1")
const function_2 = require("./Task_2")
const function_3 = require("./Task_3")

const title = "Web Program"
const port_ = 3000
const app = express()

app.set("view engine", "hbs");
hbs.registerPartials("./views/partials/")

app.use(express.static("public"));

app.use(LoggingToConsole); // middleware Logging Request

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

app.get("/api/LukinaValeria/lab1/1_Result",function (req,res){
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

app.get("/api/LukinaValeria/lab1/2_Result", AuthUser,function(request,response){
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

app.get('/api/LukinaValeria/lab1/3_Result', AuthUser, function(request,response,next) {
    if (Number(request.query.month_)> 12  ||
        Number(request.query.month_) < 0 ||
        Number(request.query.date_) < 1 ||
        Number(request.query.date_) > 31 ||
        Number(request.query.year_) == null ||
        Number(request.query.month_) == null ||
        Number(request.query.date_) == null)
    {
        //throw new Error('403_WrongValue')
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
app.listen(port_);

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
                //res.status(403).send("<h1>Error: 403 </h1> Incorrect data entered! ");
            res.render("errors.hbs", {
                title: title,
                tit: "ERROR:",
                errorStatus: 403,
                errorMessage: "Incorrect data entered!"
            });
            break;
        case '403_Access':
                //res.status(403).send("<h1>Error: 403 </h1> You don't have acces");
            res.render("errors.hbs", {
                title:title,
                tit: "ERROR:",
                errorStatus: 403,
                errorMessage: "You don't have access"
            });
            break;
        case '404':
                //res.status(404).send("<h1>Error: 404 </h1> This page does not exist");
            res.render("errors.hbs", {
                title: title,
                tit: "ERROR:",
                errorStatus: 404,
                errorMessage: "This page does not exist"
            });
            break;
        default:
                //res.status(500).send("<h1>Error: 505 </h1> Internal Server Error")
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
