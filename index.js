// --> Load modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix, status_erpt, status_mo7, status_mo8, status_mo19, status_garage} = require('./config.json')

// --> Load command files
const readyX = require('./commands/events/ready.js');
const tempX = require('./commands/temp.js');
const statusX = require('./commands/status.js');
const addX = require('./commands/add.js');
const setX = require('./commands/set.js');
const deleteX = require('./commands/delete.js');
const helpX = require('./commands/help.js');

// --> Listeners
client.on('ready', () => {
    readyX.execute(client, backend, prefix);
});
client.on('message', async (message) => {

    // --> Filter
    if(!message.content.startsWith(prefix)) return;
    const msg = message.content.toLowerCase();

    // --> Tempory Commands
    tempX.execute(msg, prefix, message, fs, Discord);

    // --> Commands
    if(msg.startsWith(prefix+'status')) {
        statusX.execute (Discord, fs, alert, status, client, status_erpt, status_mo7, status_mo8, status_mo19, status_garage, message);
    }
    if(msg.startsWith(prefix+'add')) {
        addX.execute(Discord, client, message, fs, alert);
    }
    if(msg.startsWith(prefix+'set')) {
        setX.execute(fs, message, Discord, alert, client, prefix);
    }
    if(msg.startsWith(prefix+'delete')) {
        // delete vehicle
    }
    if(msg.startsWith(prefix+'help')) {
        helpX.execute(Discord, prefix, status, message);
    }
});

client.login(process.env.token)