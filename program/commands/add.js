module.exports = {
    name: 'add.js',
    async execute (Discord, client, message, fs, alert, prefix, backend) {

        // --> Arrays
        const division_array = [];

        // --> Fill division array
        for (const file of fs.readdirSync(`./vehicles/${message.guild.id}/`).filter(file => !file.startsWith('status'))) {
            division_array.push(file);
        }

        // Intro Message
        c = message.channel;
        embed1 = new Discord.MessageEmbed()
            .setFooter('Vehicle Management System')
            .setColor("#005EB8")
        embed2 = new Discord.MessageEmbed()
            .setTitle('Vehicle details')
            .setDescription(`Which division is recieving the vehicle? (${division_array.join('/')})`)
            .setColor("#00A9CE")
            .setTimestamp()
        c.send(embed1);
        pending = await message.channel.send(embed2);

        const filter1 = m => m.author.id == message.author.id;
        const collector1 = c.createMessageCollector(filter1, { max: 1, time: 99999999 });
        collector1.on('collect', async m => {
            m.delete();
            t = m.content.toUpperCase().slice().split(' ');

            if(division_array.includes(t[0])) {
                const division = t[0];
                embed3 = new Discord.MessageEmbed()
                    .setTitle('Vehicle details')
                    .setDescription('What is the Reg plate? (Eg. BX20ABC)')
                    .addFields(
                        { name: 'Division', value: division, inline:true },
                        
                    )
                    .setColor("#00A9CE")
                    .setTimestamp()
                pending.edit(embed3);

                
                const filter2 = m => m.author.id == message.author.id;
                const collector2 = c.createMessageCollector(filter2, { max: 1, time: 99999999 });
                collector2.on('collect', async s => {
                    s.delete();

                    const plate = s.content.toUpperCase();
                    embed3 = new Discord.MessageEmbed()
                        .setTitle('Vehicle details')
                        .setDescription('What is the vehicle type? (Eg. ARV/IRV/AC/PURSUIT)')
                        .addFields(
                            { name: 'Division', value: division, inline: true },
                            { name: 'Plate', value: plate, inline: true },
                        )
                        .setColor("#00A9CE")
                        .setTimestamp()
                    pending.edit(embed3);
                    
                    const filter2 = m => m.author.id == message.author.id;
                    const collector2 = c.createMessageCollector(filter2, { max: 1, time: 99999999 });
                    collector2.on('collect', async s => {
                        s.delete();

                        const type = s.content.toUpperCase();
                        embed3 = new Discord.MessageEmbed()
                            .setTitle('Vehicle details')
                            .setDescription('What is the make and model? (Eg. BMW X5)')
                            .addFields(
                                { name: 'Division', value: division, inline: true },
                                { name: 'Plate', value: plate, inline: true },
                                { name: 'Type', value: type, inline: true },

                            )
                            .setColor("#00A9CE")
                            .setTimestamp()
                        pending.edit(embed3);
                                    
                        const filter2 = m => m.author.id == message.author.id;
                        const collector2 = c.createMessageCollector(filter2, { max: 1, time: 99999999 });
                        collector2.on('collect', async x => {
                            x.delete();
                            z = x.content.toUpperCase().slice().split(' ');
                            if(!z[1]) {
                                embedX1 = new Discord.MessageEmbed()
                                    .setDescription('Missing data. Please restart the process by entering `'+prefix+'add`')
                                    .setColor("#00A9CE")
                                    .setTimestamp()
                                pending.edit(embedX1);
                                return
                            }
                            const make = z[0];
                            const model = z[1];
                            embed3 = new Discord.MessageEmbed()
                                .setTitle('Vehicle details')
                                .addFields(
                                    { name: 'Division', value: division, inline: true },
                                    { name: 'Plate', value: plate, inline: true },
                                    { name: 'Type', value: type, inline: true },
                                    { name: 'Make', value: make, inline: true },
                                    { name: 'Model', value: model, inline: true },
                                )
                                .setColor("#00A9CE")
                                .setTimestamp()
                            pending.edit(embed3);

                            embed1 = new Discord.MessageEmbed()
                                .setFooter('Vehicle has been entered.')
                                .setColor("#005EB8")
                            message.channel.send(embed1);

                            let data2 = {};
                            data2 [Date.now()] = {
                                x: "entry",
                                plate: plate,
                                division: division,
                                type: type,
                                make: make,
                                model: model,
                            };
                            fs.writeFile(`./vehicles/${message.guild.id}/${division}/${plate}.json`, JSON.stringify(data2, null, 4), err => {
                                if (err) throw err;
                            });

                            let data3 = {};
                            data3 [Date.now()] = {
                                status: "Available",
                                plate: plate,
                                division: division,
                                timeAV: "NA",
                            };
                            fs.writeFile(`./vehicles/${message.guild.id}/status/${plate}.json`, JSON.stringify(data3, null, 4), err => {
                                if (err) throw err;
                            });

                            embed5 = new Discord.MessageEmbed()
                                .setTitle('New Vehicle')
                                .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model} - Available`)
                                .setColor("#9FA2B2")
                                .setFooter('Garage Alert')
                                .setTimestamp()
                            client.channels.cache.get(alert).send(embed5);

                            client.channels.cache.get(backend).send(`${prefix}status ${message.guild.id}`);
                        });
                    });
                    
                });
            } else {
                embedX = new Discord.MessageEmbed()
                    .setDescription('Unrecognised division. Please restart the process by entering `'+prefix+'add`')
                    .setColor("#00A9CE")
                    .setTimestamp()
                pending.edit(embedX);
                return
            }
        });
    }
}