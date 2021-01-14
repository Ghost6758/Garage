// --> Load command files...
const devX = require('./../commands/dev.js');
const setupX = require('./../commands/setup.js');
const statusX = require('./../commands/status.js');
const addX = require('./../commands/add.js');
const setX = require('./../commands/set.js');
const deleteX = require('./../commands/delete.js');
const helpX = require('./../commands/help.js');

// --> Call commands...
module.exports = {
    name: 'message.js',
    async execute(message, prefix, Discord, fs, status, alert, client) {
        
        // --> Auto commands
        if(message === `${prefix}status`) {
            statusX.execute(Discord, fs, status, client);
            return
        } 

        // --> Filter
        if(!message.content.startsWith(prefix)) return;
        const msg = message.content.toLowerCase();

        // --> Dev Commands
        if(msg.startsWith(prefix+'dev')) {
            devX.execute(msg, prefix, Discord);
        }

        // --> Commands
        if(msg.startsWith(prefix+'setup')) {
            setupX.execute();
        }
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
    }
}