// --> Load modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix, status_erpt, status_mo7, status_mo8, status_mo19, status_garage} = require('./config.json')

// --> Load command files
const readyX = require('./commands/events/ready.js');
const statusX = require('./commands/status.js');
const addX = require('./commands/add.js');
const setX = require('./commands/set.js');
const deleteX = require('./commands/delete.js');
const helpX = require('./commands/help.js');

// --> Listeners
client.on('ready', () => {
    // --> Log
    console.log('Cleaning up the garage...');
    // --> Fetch channel
    let channel = client.channels.cache.get(backend);
    // --> Status update
    setInterval(() => {
        channel.send(`${prefix}status`);
    }, 15000);
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
        statusX.execute (Discord, fs, alert, status, client, status_erpt, status_mo7, status_mo8, status_mo19, status_garage, message);
    }
    if(msg.startsWith(prefix+'add')) {
        addX.execute(Discord, client, message, fs, alert);
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
        helpX.execute(Discord, prefix, status, message);
    }
});

client.login(process.env.token)