const express = require("express");
const port_ = 3000
const app = express()

app.get('/',function(request,response){
    response.send( '<h1>Start tasks</h1>')
})

app.get('/api/LukinaValeria/lab1/')
app.listen(port_)