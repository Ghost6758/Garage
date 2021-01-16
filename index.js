// --> Load modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
const db = require('quick.db')
require('dotenv').config();
const { alert, status, prefix, backend } = require('./program/config/config.json');

// --> Load web
//require('./web/web.js');

// --> DB Configure
const statusMSG = new db.table('statusMSG'); 
const statusCHL = new db.table('statusCHL'); 
const alertCHL = new db.table('alertCHL'); 
console.log('--> DB Initialised')

// --> Load command files
const readyX = require('./program/events/ready.js');
const guildCreateX = require('./program/events/guildCreate.js');
const guildDeleteX = require('./program/events/guildRemove.js');
const messageX = require('./program/events/message.js');

// --> Listeners
client.on('ready', () => {
    readyX.execute(client, prefix, fs, backend);
});
client.on('guildCreate', guild => {
    guildCreateX.execute(fs, guild);
});
client.on('guildDelete', guild => {
    guildDeleteX.execute(fs, guild);
});
client.on('message', async message => {
    messageX.execute(message, prefix, Discord, fs, client, backend, status, alert, statusMSG, statusCHL, alertCHL);
});

client.login(process.env.token)