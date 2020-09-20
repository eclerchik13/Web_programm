const express = require("express");
const port_ = 3000
const app = express()

app.get('/',function(request,response){
    response.send( '<h1>Start tasks</h1>')
})

app.get('/api/LukinaValeria/lab1/1',function (request,response){
    let NewArr = (request.query.String).split(" ");
    let NewString = "";
    for (let i = 0; i < NewArr.length ; i++ )
    {
        NewString = NewString + ((NewArr[i])[0].toUpperCase()) + NewArr[i].slice(1,NewArr[i].length + 1);
    }

    response.send('<h3>Result</h3><p>Your string with camel register: '+ NewString + '</p>' );
})

app.get('/api/LukinaValeria/lab1/2',function (request,response){
    response.send('<h3>Result</h3><p>Your string after sort: ' + request.query.StringForSort.split('').sort().join('') +'</p>')
})

app.get('/api/LukinaValeria/lab1/3',function(request,response){
    let result_ = "No"
    let day = new Date(request.query.year_,request.query.month_,request.query.date_)
    let number_ = day.getDay()
    if  (number_== 0 || number_ == 6)
    {
        result_ = "Yes"
    }
    response.send('<h3>Result</h3><p>Is your day is day off? - ' + result_ + '</p>')
})

app.listen(port_);