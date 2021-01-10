const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix, status_erpt, status_mo7, status_mo8, status_mo19} = require('./config.json')

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

    // --> Tempory Commands
    if(msg.startsWith(prefix+'test')) {
        message.delete();
        embed = new Discord.MessageEmbed()
            .setDescription('edit this');
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
    }
    if(msg.startsWith(prefix+'add')) {
        // add new vehicle
    }
    if(msg.startsWith(prefix+'set')) {
        // set status (AV/GARAGE/UNAV)
    }
    if(msg.startsWith(prefix+'delete')) {
        // delete vehicle
    }
});

client.login(process.env.token)