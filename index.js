const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix, status_erpt, status_mo7, status_mo8, status_mo19, status_garage} = require('./config.json')

client.on('ready', () => {
    // --> Log
    console.log('Cleaning up the garage...');
    
    // --> Start the status update
    var CronJob = require('cron').CronJob;
    var job = new CronJob('1 * * * * *', function() {
        client.channels.cache.get(backend).send(`${prefix}status`);
    }, null, true, 'America/Los_Angeles');
    job.start();
});
client.on('message', async (message) => {

    // --> Filter
    if(!message.content.startsWith(prefix)) return;
    const msg = message.content.toLowerCase();
    const args = message.content.slice(prefix.length).split(' '); 

    // --> Tempory Commands
    if(msg.startsWith(prefix+'test')) {
        message.delete();
        embed = new Discord.MessageEmbed()
            .setDescription('edit this');
        message.channel.send(embed);
        message.channel.send(embed);
        message.channel.send(embed);
        message.channel.send(embed);
        message.channel.send(embed);
    }
    if(msg.startsWith(prefix+'purge')) {
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
        message.channel.bulkDelete(99);
    }

    // --> Commands
    if(msg.startsWith(prefix+'status')) {

        // --> Declare embeds
        let erpt_e = new Discord.MessageEmbed()
            .setTitle('Emergency Response & Patrol Team')
            .setFooter('Garage Overview')
            .setTimestamp()
            .setColor('#002492') 
        let mo7_e = new Discord.MessageEmbed()
            .setTitle('Met Operations 7: Taskforce')
            .setFooter('Garage Overview')
            .setTimestamp()
            .setColor('#002492') 
        let mo8_e = new Discord.MessageEmbed()
            .setTitle('Met Operations 8: RTPC')
            .setFooter('Garage Overview')
            .setTimestamp()
            .setColor('#002492') 
        let mo19_e = new Discord.MessageEmbed()
            .setTitle('Met Operations 19: SFC')
            .setFooter('Garage Overview')
            .setTimestamp()
            .setColor('#002492') 
        let garage_e = new Discord.MessageEmbed()
            .setTitle('Garage')
            .setFooter('Garage Overview')
            .setTimestamp()
            .setColor('#002492') 
        
        // --> Fetch data
        const erpt = fs.readdirSync('./vehicles/erpt/').filter(file => file.endsWith('.json'));
        for (const file of erpt) {
            const userData = require(`./vehicles/erpt/${file}`);
            for(let i in userData) {
                let type = userData[i].x;
                if(type == 'entry') {
                    let plate = userData[i].plate;
                    let division = userData[i].division;
                    let type = userData[i].type;
                    let make = userData[i].make;
                    let model = userData[i].model;
                    let  status = userData[i].status;

                    let string1 = `${division} (${type})`
                    let string2 = `${plate} - ${make} ${model} - ${status}`
                    erpt_e.addField(string1, string2);
                };
            };
        };
        const mo7 = fs.readdirSync('./vehicles/mo7/').filter(file => file.endsWith('.json'));
        for (const file of mo7) {
            const userData = require(`./vehicles/mo7/${file}`);
            for(let i in userData) {
                let type = userData[i].x;
                if(type == 'entry') {
                    let plate = userData[i].plate;
                    let division = userData[i].division;
                    let type = userData[i].type;
                    let make = userData[i].make;
                    let model = userData[i].model;
                    let  status = userData[i].status;

                    let string1 = `${division} (${type})`
                    let string2 = `${plate} - ${make} ${model} - ${status}`
                    mo7_e.addField(string1, string2);
                };
            };
        };
        const mo8 = fs.readdirSync('./vehicles/mo8/').filter(file => file.endsWith('.json'));
        for (const file of mo8) {
            const userData = require(`./vehicles/mo8/${file}`);
            for(let i in userData) {
                let type = userData[i].x;
                if(type == 'entry') {
                    let plate = userData[i].plate;
                    let division = userData[i].division;
                    let type = userData[i].type;
                    let make = userData[i].make;
                    let model = userData[i].model;
                    let  status = userData[i].status;

                    let string1 = `${division} (${type})`
                    let string2 = `${plate} - ${make} ${model} - ${status}`
                    mo8_e.addField(string1, string2);
                };
            };
        };
        const mo19 = fs.readdirSync('./vehicles/mo19/').filter(file => file.endsWith('.json'));
        for (const file of mo19) {
            const userData = require(`./vehicles/mo19/${file}`);
            for(let i in userData) {
                let type = userData[i].x;
                if(type == 'entry') {
                    let plate = userData[i].plate;
                    let division = userData[i].division;
                    let type = userData[i].type;
                    let make = userData[i].make;
                    let model = userData[i].model;
                    let  status = userData[i].status;

                    let string1 = `${division} (${type})`
                    let string2 = `${plate} - ${make} ${model} - ${status}`
                    mo19_e.addField(string1, string2);
                };
            };
        };
        const garage = fs.readdirSync('./vehicles/garage/').filter(file => file.endsWith('.json'));
        for (const file of garage) {
            const userData = require(`./vehicles/garage/${file}`);
            for(let i in userData) {
                let type = userData[i].x;
                if(type == 'entry') {
                    let plate = userData[i].plate;
                    let division = userData[i].division;
                    let type = userData[i].type;
                    let make = userData[i].make;
                    let model = userData[i].model;
                    let  status = userData[i].status;

                    let string1 = `${division} (${type})`
                    let string2 = `${plate} - ${make} ${model} - ${status}`
                    garage_e.addField(string1, string2);
                };
            };
        };

        // --> Fetch messages & edit with updated values
        let channel1 = client.channels.cache.get(status);
        await channel1.messages.fetch({around: status_erpt, limit: 1})
        .then(messages => {
          messages.first().edit(erpt_e);
        });
        await channel1.messages.fetch({around: status_mo7, limit: 1})
        .then(messages => {
          messages.first().edit(mo7_e);
        });
        await channel1.messages.fetch({around: status_mo8, limit: 1})
        .then(messages => {
          messages.first().edit(mo8_e);
        });
        await channel1.messages.fetch({around: status_mo19, limit: 1})
        .then(messages => {
          messages.first().edit(mo19_e);
        });
        await channel1.messages.fetch({around: status_garage, limit: 1})
        .then(messages => {
          messages.first().edit(garage_e);
        });
    }
    if(msg.startsWith(prefix+'add')) {

        message.delete();

        // Intro Message
        c = message.channel;
        embed1 = new Discord.MessageEmbed()
            .setFooter('Vehicle Management System')
            .setColor("#005EB8")
        embed2 = new Discord.MessageEmbed()
            .setTitle('Vehicle details')
            .setDescription('Which division is recieving the vehicle? (ERPT/MO7/MO8/MO19)')
            .setColor("#00A9CE")
            .setTimestamp()
        c.send(embed1);
        pending = await message.channel.send(embed2);

        const filter1 = m => m.author.id == message.author.id;
        const collector1 = c.createMessageCollector(filter1, { max: 1, time: 99999999 });
        collector1.on('collect', async m => {
            m.delete();
            t = m.content.toUpperCase().slice().split(' ');

            if(t[0] == 'ERPT' || t[0] == 'MO7' || t[0] == 'MO8' || t[0] == 'MO19') {
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
                                status: 'Available'
                            };
                            fs.writeFile(`./vehicles/${division}/${plate}.json`, JSON.stringify(data2, null, 4), err => {
                                if (err) throw err;
                            });

                            let data3 = {};
                            data3 [Date.now()] = {
                                status: "Available",
                                timeAV: "NA",
                            };
                            fs.writeFile(`./vehicles/status/${plate}.json`, JSON.stringify(data3, null, 4), err => {
                                if (err) throw err;
                            });

                            embed5 = new Discord.MessageEmbed()
                                .setTitle('New Vehicle')
                                .addFields(
                                    { name: 'Division', value: division, inline: true },
                                    { name: 'Plate', value: plate, inline: true },
                                    { name: 'Type', value: type, inline: true },
                                    { name: 'Make', value: make, inline: true },
                                    { name: 'Model', value: model, inline: true },
                                )
                                .setColor("#00A9CE")
                                .setFooter('Garage Alert')
                                .setTimestamp()
                            client.channels.cache.get(alert).send(embed5);
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
    if(msg.startsWith(prefix+'set')) {
        // set status (AV/GARAGE/UNAV)
    }
    if(msg.startsWith(prefix+'delete')) {
        // delete vehicle
    }
    if(msg.startsWith(prefix+'help')) {
        // command summary
    }
});

client.login(process.env.token)