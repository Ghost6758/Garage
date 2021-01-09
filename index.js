const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('file-system');
require('dotenv').config();
const { alert, backend, status, prefix} = require('./config.json')

client.on('ready', () => {
    console.log('Cleaning up the garage...');
});
client.on('message', (message) => {
    
    if(message.author.bot || !message.content.startsWith(prefix) || message.channel.dm) return;

    if(message.content.toLowerCase().startsWith(prefix+'status')) {

        // --> Clear the message OR if auto do nothing
        message.delete();

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
        client.channels.cache.get(status).send(erpt_e);
        client.channels.cache.get(status).send(mo7_e);
        client.channels.cache.get(status).send(mo8_e);
        client.channels.cache.get(status).send(mo19_e);
    }

});

client.login(process.env.token)