const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');

client.on('ready', ready => {
    console.log('Cleaning up the garage...')
})
client.on('message', message => {
    console.log('Functional.')
});

client.login()