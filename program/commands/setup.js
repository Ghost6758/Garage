module.exports = {
    name: 'setup.js',
    async execute (message, Discord) {
        
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
    }
}