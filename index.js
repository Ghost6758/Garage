const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix} = require('./config.json')

client.on('ready', () => {
    console.log('Cleaning up the garage...');
});
client.on('message', (message) => {
    
    if(message.author.bot || !message.content.startsWith(prefix) || message.channel.dm) return;

    client.channels.cache.get(alert).send('Alert');
    client.channels.cache.get(status).send('status');

});

client.login(process.env.token)