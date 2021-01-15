const express = require('express');
const app = express();
const { port } = require('./web.json');

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/landing.html");
});

app.listen(port, function() {
	console.log('--> Web Initialised ('+port+')');
});