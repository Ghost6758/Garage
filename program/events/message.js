// --> Load command files...
const devX = require('../commands/dev.js');
const setupX = require('../commands/setup.js');
const statusX = require('../commands/statusX.js');
const statusA = require('../commands/statusA.js');
const addX = require('../commands/add.js');
const setX = require('../commands/set.js');
const deleteX = require('../commands/delete.js');
const statsX = require('../commands/stats.js');
const helpX = require('../commands/help.js');

// --> Call commands...
module.exports = {
    name: 'message.js',
    async execute(message, prefix, Discord, fs, client, backend, status, alert, statusMSG, statusCHL, alertCHL) {
        
        // --> Auto commands
        if(message.content.startsWith(prefix+'status')) {

            if(message.author.id != client.user.id) return;
        
            if(message.content.includes('all')) {
                statusA.execute(Discord, fs, status, alert, client);
                return
            } else {
                guild1 = message.content.split(' ');
                guild = guild1[1];
                statusX.execute(Discord, fs, status, alert, client, guild);
            }
        } 

        // --> Filter
        if(!message.content.startsWith(prefix) || message.author.bot) return;
        const msg = message.content.toLowerCase();

        // --> Dev Commands
        if(msg.startsWith(prefix+'dev')) {
            devX.execute(message, msg, prefix, fs, Discord);
        }

        // --> Commands
        if(msg.startsWith(prefix+'add')) { 
            addX.execute(Discord, client, message, fs, alert, prefix, backend);
        }
        if(msg.startsWith(prefix+'setup')) {
            setupX.execute(message, Discord, client, prefix);
            return
        }
        if(msg.startsWith(prefix+'set')) {      
            setX.execute(fs, message, Discord, alert, client, prefix, backend);
        }
        if(msg.startsWith(prefix+'delete')) {
            deleteX.execute(fs, message, Discord, alert, client, prefix, backend);
        }
        if(msg.startsWith(prefix+'stats')) {
            statsX.execute(fs, message, Discord, client);
        }
        if(msg.startsWith(prefix+'help')) {
            helpX.execute(fs, Discord, prefix, status, message);
        }
    }
}