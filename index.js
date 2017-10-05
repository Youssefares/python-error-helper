'use strict'
require('dotenv').load()

const InvalidInputError = require('./invalid_input_error')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const help = require('./python-error-help')


let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.post('/error-help', (req, res)=>{
  var error_message = req.body.error_message
  help(error_message).catch((reason)=>{
  	if(reason instanceof InvalidInputError){
  		res.status(404)
  		res.send(reason.message)
  	}
  }).then((response)=>{
  	res.status(200)
  	res.format({
		'application/json': ()=>{ res.send({response: response.message}) },
		'text/plain': ()=>{ res.send(JSON.stringify(response.message)) }
  	})
  })
})


http.createServer(app).listen(process.env.PORT)
