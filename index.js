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
    if(msg.startsWith(prefix+'setup')) {
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
        message.channel.send('Standby...').then(m => { m.edit(m.id) });
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
    if(msg.startsWith(prefix+'test')) {
        let array = [];
        for (const file of fs.readdirSync('./vehicles/').filter(file => !file.startsWith('status'))) {
            array.push(file);
        }
        message.channel.send(array.length+' divisions are present. \n\n'+array.join('\n'));
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
        for (const file of fs.readdirSync('./vehicles/status/').filter(file => file.endsWith('.json'))) {
            let rawdata = fs.readFileSync('./vehicles/status/'+file);
            let userData = JSON.parse(rawdata);
            for(let i in userData) {
  
                let division = userData[i].division;
                let plate = userData[i].plate;
                
                if(userData[i].status == 'Available') {
                    let veh_ = fs.readFileSync(`./vehicles/${division}/${plate}.json`);
                    let veh = JSON.parse(veh_);
                    for(let i in veh) {
                   
                        let type = veh[i].type;
                        let make = veh[i].make;
                        let model = veh[i].model;

                        if(division == 'ERPT') {
                            erpt_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                        } else if(division == 'MO7') {
                            mo7_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                        } else if(division == 'MO8') {
                            mo8_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                        } else if(division == 'MO19') {
                            mo19_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                        };
                        
                    }
                } else if(userData[i].status == 'Garage') {  
                    let time = userData[i].timeAV;      
                    if(time < Date.now()) {
                        // --> This vehicle is now back in service.
                        let data1 = {};
                        data1 [Date.now()] = {
                            status: "Available",
                            plate: plate,
                            division: division,
                            timeAV: "NA"
                        };
                        fs.writeFile(`./vehicles/status/${plate}.json`, JSON.stringify(data1, null, 4), err => {
                            if (err) throw err;
                        });
        
                        let veh_ = fs.readFileSync(`./vehicles/${division}/${plate}.json`);
                        let veh = JSON.parse(veh_);
                        for(let i in veh) {
        
                            let type = veh[i].type;
                            let make = veh[i].make;
                            let model = veh[i].model;
        
                            embed = new Discord.MessageEmbed()
                                .setTitle('Vehicle Repaired')
                                .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model} - Available`)
                                .setColor("#00A9CE")
                                .setFooter('Garage Alert')
                                .setTimestamp()
                            client.channels.cache.get(alert).send(embed);

                            if(division == 'ERPT') {
                                erpt_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                            } else if(division == 'MO7') {
                                mo7_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                            } else if(division == 'MO8') {
                                mo8_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                            } else if(division == 'MO19') {
                                mo19_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Available`);
                            };

                            console.log('alert sent...');   
                        };
    
                    } else {
                        // --> This vehicle is still being repaired.
                        let veh_ = fs.readFileSync(`./vehicles/${division}/${plate}.json`);
                        let veh = JSON.parse(veh_);
                        for(let i in veh) {
        
                            let type = veh[i].type;
                            let make = veh[i].make;
                            let model = veh[i].model;
                            let left = Math.round(((time - Date.now()) / 8.64e+7));
        
                            garage_e.addField(`${division} (${type})`, `${plate} - ${make} ${model} - Unavailable (${left} days)`);
                        };
                    }
                } else {
                    console.log('Invalid status header...');
                    return;
                }
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
                            };
                            fs.writeFile(`./vehicles/${division}/${plate}.json`, JSON.stringify(data2, null, 4), err => {
                                if (err) throw err;
                            });

                            let data3 = {};
                            data3 [Date.now()] = {
                                status: "Available",
                                plate: plate,
                                division: division,
                                timeAV: "NA",
                            };
                            fs.writeFile(`./vehicles/status/${plate}.json`, JSON.stringify(data3, null, 4), err => {
                                if (err) throw err;
                            });

                            embed5 = new Discord.MessageEmbed()
                                .setTitle('New Vehicle')
                                .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model} - Available`)
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

        // Intro Message
        c = message.channel;
        embed1 = new Discord.MessageEmbed()
            .setFooter('Vehicle Management System')
            .setColor("#005EB8")
        embed2 = new Discord.MessageEmbed()
            .setTitle('Vehicle status')
            .setDescription('Which is the vehicle reg? (AA123AAA)')
            .setColor("#00A9CE")
            .setTimestamp()
        c.send(embed1);
        pending = await message.channel.send(embed2);

        const filter1 = m => m.author.id == message.author.id;
        const collector1 = c.createMessageCollector(filter1, { max: 1, time: 99999999 });
        collector1.on('collect', async m => {
            m.delete();
            t = m.content.toUpperCase();
            if(!fs.existsSync(`./vehicles/status/${t}.json`)) {
                embedX = new Discord.MessageEmbed()
                    .setDescription('Could not find any vehicle with the reg of '+t+'. Please restart the process by entering `'+prefix+'add`')
                    .setColor("#00A9CE")
                    .setTimestamp()
                pending.edit(embedX);
                return
            } else {

                let rawdata = fs.readFileSync('./vehicles/status/'+t+'.json');
                let userData = JSON.parse(rawdata);
                for(let i in userData) {

                    let division = userData[i].division;
                    let plate = userData[i].plate;
                    let status = userData[i].status;

                    let veh_ = fs.readFileSync(`./vehicles/${division}/${plate}.json`);
                    let veh = JSON.parse(veh_);
                    for(let i in veh) {

                        let type = veh[i].type;
                        let make = veh[i].make;
                        let model = veh[i].model;

                        embed = new Discord.MessageEmbed()
                            .setTitle('Vehicle Status')
                            .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model} - ${status} \n\nPlease reply with the updated status. (Available/Garage)`)
                            .setColor("#00A9CE")
                            .setTimestamp()
                        pending.edit(embed);

                        const filter1 = m => m.author.id == message.author.id;
                        const collector1 = c.createMessageCollector(filter1, { max: 1, time: 99999999 });
                        collector1.on('collect', async n => {
                            n.delete();
                            t = n.content.toLowerCase();
                            if(t == 'available') {
                                if(status == 'Available') {
                                    embedX = new Discord.MessageEmbed()
                                        .setDescription(plate+' is already available!')
                                        .setColor("#00A9CE")
                                        .setTimestamp()
                                    pending.edit(embedX);
                                    return
                                } else {
                                    // --> vehicle is now available.
                                    let data3 = {};
                                    data3 [Date.now()] = {
                                        status: "Available",
                                        plate: plate,
                                        division: division,
                                        timeAV: "NA",
                                    };
                                    fs.writeFile(`./vehicles/status/${plate}.json`, JSON.stringify(data3, null, 4), err => {
                                        if (err) throw err;
                                    });

                                    embed1 = new Discord.MessageEmbed()
                                        .setFooter('Vehicle has repaired.')
                                        .setColor("#005EB8")
                                    pending.edit(embed1);

                                    embed5 = new Discord.MessageEmbed()
                                        .setTitle('Vehicle Repaired')
                                        .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model} - Available`)
                                        .setColor("#00A9CE")
                                        .setFooter('Garage Alert')
                                        .setTimestamp()
                                    client.channels.cache.get(alert).send(embed5);
                                }
                            } else if(t == 'garage') {
                                embed2 = new Discord.MessageEmbed()
                                    .setTitle('Vehicle status')
                                    .setDescription('For how many days do you want '+plate+' to be out of service?')
                                    .setColor("#00A9CE")
                                    .setTimestamp()
                                pending.edit(embed2);
                                // get time
                                const filter1 = m => m.author.id == message.author.id;
                                const collector1 = c.createMessageCollector(filter1, { max: 1, time: 99999999 });
                                collector1.on('collect', async o => {
                                    o.delete();
                                    if(isNaN(o.content)) {
                                        embedX = new Discord.MessageEmbed()
                                            .setDescription(o.content+' is not a number! Please restart the process by entering `'+prefix+'add`')
                                            .setColor("#00A9CE")
                                            .setTimestamp()
                                        pending.edit(embedX);
                                        return
                                    } else {
                                        // write to status file
                                        let data1 = {};
                                        data1 [Date.now()] = {
                                            status: "Garage",
                                            plate: plate,
                                            division: division,
                                            timeAV: (o.content * 8.64e+7) + Date.now()
                                        };
                                        fs.writeFile(`./vehicles/status/${plate}.json`, JSON.stringify(data1, null, 4), err => {
                                            if (err) throw err;
                                        });
                                        embedX = new Discord.MessageEmbed()
                                            .setDescription('I have sent '+plate+' to the garage.')
                                            .setColor("#00A9CE")
                                            .setTimestamp()
                                        pending.edit(embedX);
                                        // alert
                                        embed5 = new Discord.MessageEmbed()
                                            .setTitle('Vehicle out of service')
                                            .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model} - Garage (${o.content} days)`)
                                            .setColor("#00A9CE")
                                            .setFooter('Garage Alert')
                                            .setTimestamp()
                                        client.channels.cache.get(alert).send(embed5);
                                    }
                                });
                            } else {
                                embedX = new Discord.MessageEmbed()
                                    .setDescription(n.content+' is not a valid status. Please restart the process by entering `'+prefix+'add`')
                                    .setColor("#00A9CE")
                                    .setTimestamp()
                                pending.edit(embedX);
                                return
                            }
                        });
                    }
                };
            }
        });
    }
    if(msg.startsWith(prefix+'delete')) {
        // delete vehicle
    }
    if(msg.startsWith(prefix+'help')) {
    }
});

client.login(process.env.token)