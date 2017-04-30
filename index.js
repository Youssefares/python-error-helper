'use strict'

//Libraries
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const help = require('./python-error-help');



let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.post('/error-help', function(req, res){
  var error_message = req.body.error_message
  var helpObj = help(error_message)

  if(helpObj){
    res.send(JSON.stringify(helpObj))
  }
  else res.send('')

})


http.createServer(app).listen(8000)


// request.post({
//   url:     'http://localhost:8000/error-help',
//   form:    { error_message: "shit"}
// }, function(error, response, body){
//   console.log(body);
// });
