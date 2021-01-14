// --> Load modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, status, prefix} = require('./program/config/config.json');


// --> Load command files
const readyX = require('./program/events/ready.js');
const guildCreateX = require('./program/events/guildCreate.js');
const guildDeleteX = require('./program/events/guildRemove.js');
const messageX = require('./program/events/message.js');

// --> Listeners
client.on('ready', () => {
    readyX.execute(client, prefix, fs);
});
client.on('GuildCreate', guild => {
    guildCreateX.execute(fs, guild);
});
client.on('guildDelete', guild => {
    guildDeleteX.execute(fs, guild);
});
client.on('message', async message => {
    messageX.execute(message, prefix, Discord, fs, status, alert, client);
});

client.login(process.env.token)

const express = require('express');
const app = express();
const config = require('./web/web.json');

app.get("/dashboard", function(req, res) {
	res.sendFile(__dirname + "/web/dashboard.html");
});

app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/web/createuser.html");
	//res.redirect("/dashboard")
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/web/landing.html");
});

app.listen(config.port, function() {
	console.log(config.port);
});