// --> Load command files...
const devX = require('./../commands/dev.js');
const setupX = require('./../commands/setup.js');
const statusX = require('../commands/statusX.js');
const statusA = require('./../commands/statusA.js');
const addX = require('./../commands/add.js');
const setX = require('./../commands/set.js');
const deleteX = require('./../commands/delete.js');
const helpX = require('./../commands/help.js');

// --> Call commands...
module.exports = {
    name: 'message.js',
    async execute(message, prefix, Discord, fs, status, alert, client, backend) {
        
        // --> Auto commands
        if(message.content.startsWith(prefix+'status')) {
            if(message.content.slice(1) === 'all') {
                statusA.execute(Discord, fs, status, client);
            } else {
                guild = message.content.slice(1);
                statusX.execute(Discord, fs, status, client, guild);
            }
        } 

        // --> Filter
        if(!message.content.startsWith(prefix) || message.author.bot) return;
        const msg = message.content.toLowerCase();

        // --> Dev Commands
        if(msg.startsWith(prefix+'dev')) {
            devX.execute(msg, prefix, Discord);
        }

        // --> Commands
        if(msg.startsWith(prefix+'add')) {
            addX.execute(Discord, client, message, fs, alert, prefix);
        }
        if(msg.startsWith(prefix+'set')) {
            if(msg.startsWith(prefix+'setup')) {
                setupX.execute(message, Discord, client, prefix);
            } else {
                setX.execute(fs, message, Discord, alert, client, prefix);
            }
        }
        if(msg.startsWith(prefix+'delete')) {
            deleteX.execute();
        }
        if(msg.startsWith(prefix+'help')) {
            helpX.execute(Discord, prefix, status, message);
        }
    }
}