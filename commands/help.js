module.exports = {
    name: 'help.js',
    execute (Discord, prefix, status, message) {
        try {    
            embed = new Discord.MessageEmbed()
                .setTitle('Commands Summary')
                .setDescription('Vehicles are automatically sent for service every 30 days. If a vehicle is crashed within this time, the 30 days will reset.')
                .addField(`${prefix}status`, `Updates <#${status}> with any changes. It is automatic and runs every 15 seconds.`)
                .addField(`${prefix}add`, `Adds new vehicles into the system.`)
                .addField(`${prefix}set`, 'Allows you to manually set the status of vehicles to either `Available` or `Garage`.')
                .addField(`${prefix}delete`, `Remove vehicles from the system`)
                .addField(`${prefix}help`, `Brings up a summary of commands.`)
                .setFooter('Garage System')
                .setTimestamp()
                .setColor('#002492') 
            message.channel.send(embed);
        } catch(err) {};
    }
}