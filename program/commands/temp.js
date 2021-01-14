module.exports = {
    name: 'temp.js',
    execute(msg, prefix, message, fs, Discord) {
        if(msg.startsWith(prefix+'setup')) {
            message.delete();
            embed1 = new Discord.MessageEmbed()
                .setDescription('Standby..')
            message.channel.send(embed1).then(m => { 
                embed = new Discord.MessageEmbed()
                    .setDescription(m.id);
                m.edit(embed); 
            });
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
        if(msg.startsWith(prefix+'x')) {
            let global_e = new Discord.MessageEmbed()
                .setTitle('Garage overview')
                .addField('\u200B', '**DIVISION 1**')
                .addField('PURSUIT', 'BX27ABC - KSS I3 - Available')
                .addField('PURSUIT', 'BX27ABC - KSS I3 - Available')
                .addField('PURSUIT', 'BX27ABC - KSS I3 - Available')
                .addField('\u200B', '**DIVISION 2**')
                .addField('IRV', 'BX13KAA - BMW X5 - Available')
                .addField('IRV', 'BX13KAA - BMW X5 - Available')
                .addField('IRV', 'BX13KAA - BMW X5 - Available')
                .addField('IRV', 'BX13KAA - BMW X5 - Available')
                .setFooter('Garage Overview')
                .setTimestamp()
                .setColor('#002492')
            message.channel.send(global_e)
        }
        if(msg.startsWith(prefix+'test')) {
            let array = [];
            for (const file of fs.readdirSync(`./vehicles/${message.guilds.id}/`).filter(file => !file.startsWith('status'))) {
                array.push(file);
            }
            message.channel.send(array.length+' divisions are present. \n\n'+array.join('\n'));
        }
    }
}