const express = require('express');
const app = express();
const config = require('./web.json');

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/landing.html");
});

app.listen(config.port, function() {
	console.log('--> Web Initialised ('+config.port+')');
});