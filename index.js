// --> Load modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix, status_erpt, status_mo7, status_mo8, status_mo19, status_garage} = require('./config.json')

// --> Load command files
const readyX = require('./commands/events/ready.js');
const statusX = require('./commands/status.js');
const addX = require('./commands/add.js');
const setX = require('./commands/set.js');
const deleteX = require('./commands/delete.js');
const helpX = require('./commands/help.js');

// --> Listeners
client.on('ready', () => {
    // --> Log
    console.log('Cleaning up the garage...');
    // --> Fetch channel
    let channel = client.channels.cache.get(backend);
    // --> Status update
    setInterval(() => {
        channel.send(`${prefix}status`);
    }, 15000);
});
client.on('message', async (message) => {

    // --> Filter
    if(!message.content.startsWith(prefix)) return;
    const msg = message.content.toLowerCase();
    const args = message.content.slice(prefix.length).split(' '); 

    // --> Tempory Commands
    if(msg.startsWith(prefix+'setup')) {
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
    }
    if(msg.startsWith(prefix+'purge')) {
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
    }
    if(msg.startsWith(prefix+'terminate')) {
        process.exit();
    }
    if(msg.startsWith(prefix+'test')) {
        let array = [];
        for (const file of fs.readdirSync('./vehicles/').filter(file => !file.startsWith('status'))) {
            array.push(file);
        }
        message.channel.send(array.length+' divisions are present. \n\n'+array.join('\n'));
    }

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