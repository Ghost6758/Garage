module.exports = {
    name: 'delete.js',
    async execute(fs, message, Discord, alert, client, prefix, backend) {
        
        // Intro Message
        c = message.channel;
        embed1 = new Discord.MessageEmbed()
            .setFooter('Vehicle Management System')
            .setColor("#005EB8")
        embed2 = new Discord.MessageEmbed()
            .setTitle('Remove vehicle')
            .setDescription('Which is the vehicle reg? (AA20AAA)')
            .setColor("#00A9CE")
            .setTimestamp()
        c.send(embed1);
        pending = await message.channel.send(embed2);

        const filter1 = m => m.author.id == message.author.id;
        const collector1 = c.createMessageCollector(filter1, { max: 1, time: 99999999 });
        collector1.on('collect', async m => {
            m.delete();
            t = m.content.toUpperCase();
            if(!fs.existsSync(`./vehicles/${message.guild.id}/xyz_status/${t}.json`)) {
                embedX = new Discord.MessageEmbed()
                    .setDescription('Could not find any vehicle with the reg of '+t+'. Please restart the process by entering `'+prefix+'delete`')
                    .setColor("#00A9CE")
                    .setTimestamp()
                pending.edit(embedX);
                return
            } else {
                let rawdata = fs.readFileSync(`./vehicles/${message.guild.id}/xyz_status/${t}.json`);
                let userData = JSON.parse(rawdata);
                for(let i in userData) {

                    let division = userData[i].division;
                    let plate = userData[i].plate;

                    let veh_ = fs.readFileSync(`./vehicles/${message.guild.id}/${division}/${plate}.json`);
                    let veh = JSON.parse(veh_);
                    for(let i in veh) {

                        let type = veh[i].type;
                        let make = veh[i].make;
                        let model = veh[i].model;

                        fs.unlink(`./vehicles/${message.guild.id}/xyz_status/${t}.json`, (err) => {
                            if(err) {message.channel.send(err)};
                            message.channel.send('deleted1');
                        });
                        fs.unlink(`./vehicles/${message.guild.id}/${division}/${plate}.json`, (err) => {
                            if(err) {message.channel.send(err)};
                            message.channel.send('deleted2');
                        }); 
                        

                        embed4 = new Discord.MessageEmbed()
                            .setDescription(`${plate} has been deleted.`)
                            .setColor("#16262E")
                            .setTimestamp()
                        pending.edit(embed4);
                        embed5 = new Discord.MessageEmbed()
                            .setTitle('Vehicle Removed')
                            .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model}`)
                            .setColor("#16262E")
                            .setFooter('Garage Alert')
                            .setTimestamp()
                        client.channels.cache.get(alert).send(embed5);
                        // trigger update
                        client.channels.cache.get(backend).send(`${prefix}status ${message.guild.id}`);
                    };
                };
            };
        });
    }
}