// --> Load modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix} = require('./program/config/config.json')

// --> Load command files
const readyX = require('./program/events/ready.js');
const guildCreateX = require('./program/events/guildCreate.js');
const guildDeleteX = require('./program/events/guildRemove.js');
const tempX = require('./program/commands/temp.js');
const statusX = require('./program/commands/status.js');
const addX = require('./program/commands/add.js');
const setX = require('./program/commands/set.js');
const deleteX = require('./program/commands/delete.js');
const helpX = require('./program/commands/help.js');

// --> Listeners
client.on('ready', () => {
    readyX.execute(client, prefix, fs);
});
client.on('GuildCreate', guild => {
    guildCreateX.execute(fs, guild);
});
client.on('GuildRemove', guild => {
    guildRemoveX.execute(fs, guild);
});
client.on('message', async message => {

    // --> Auto commands
    try {
        if(X === `${prefix}status`) {
            statusX.execute(Discord, fs, status, client);
            return
        }
    } catch(err) {}; 

    // --> Filter
    if(!message.content.startsWith(prefix)) return;
    const msg = message.content.toLowerCase();

    // --> Tempory Commands
    tempX.execute(msg, prefix, message, fs, Discord);

    // --> Commands
    if(msg.startsWith(prefix+'add')) {
        addX.execute(Discord, client, message, fs, alert, prefix);
    }
    if(msg.startsWith(prefix+'set')) {
        setX.execute(fs, message, Discord, alert, client, prefix);
    }
    if(msg.startsWith(prefix+'delete')) {
        deleteX.execute();
    }
    if(msg.startsWith(prefix+'help')) {
        helpX.execute(Discord, prefix, status, message);
    }
});

client.login(process.env.token)