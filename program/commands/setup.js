module.exports = {
    name: 'setup.js',
    async execute (message, Discord, client, prefix) {
        
        // --> Delete
        message.delete();

        // --> Message
        embed1 = new Discord.MessageEmbed()
            .setDescription('Standby..')
        message.channel.send(embed1).then(m => { 
            embed = new Discord.MessageEmbed()
                .setDescription(m.id);
            m.edit(embed); 
        });

        //client.emit('message', `${prefix}status1 ${message.guild.id}`);
    }
}