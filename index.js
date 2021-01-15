// --> Load modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
const mongoose = require('mongoose');
require('dotenv').config();
const { alert, status, prefix, backend} = require('./program/config/config.json');

// --> Load web
require('./web/web.js');

// --> DB Connect
mongoose.connect(process.env.ipDB, { useUnifiedTopology: true, useNewUrlParser: true }).then( t => {
    console.log('--> DB Initialised');
});

// --> Load command files
const readyX = require('./program/events/ready.js');
const guildCreateX = require('./program/events/guildCreate.js');
const guildDeleteX = require('./program/events/guildRemove.js');
const messageX = require('./program/events/message.js');

// --> Listeners
client.on('ready', () => {
    readyX.execute(client, prefix, fs);
});
client.on('guildCreate', guild => {
    guildCreateX.execute(fs, guild);
});
client.on('guildDelete', guild => {
    guildDeleteX.execute(fs, guild);
});
client.on('message', async message => {
    messageX.execute(message, prefix, Discord, fs, status, alert, client, backend);
});

client.login(process.env.token)