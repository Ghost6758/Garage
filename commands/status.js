module.exports = {
    name: 'status.js',
    async execute (Discord, fs, alert, status, client, status_erpt, status_mo7, status_mo8, status_mo19, status_garage, message) {
        
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
        for (const file of fs.readdirSync(`./vehicles/${message.guild.id}/status/`).filter(file => file.endsWith('.json'))) {
            let rawdata = fs.readFileSync(`./vehicles/${message.guild.id}/status/${file}`);
            let userData = JSON.parse(rawdata);
            for(let i in userData) {
  
                let division = userData[i].division;
                let plate = userData[i].plate;
                
                if(userData[i].status == 'Available') {
                    let veh_ = fs.readFileSync(`./vehicles/${message.guild.id}/${division}/${plate}.json`);
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
                        fs.writeFile(`./vehicles/${message.guild.id}/status/${plate}.json`, JSON.stringify(data1, null, 4), err => {
                            if (err) throw err;
                        });
        
                        let veh_ = fs.readFileSync(`./vehicles/${message.guild.id}/${division}/${plate}.json`);
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
                        };
    
                    } else {
                        // --> This vehicle is still being repaired.
                        let veh_ = fs.readFileSync(`./vehicles/${message.guild.id}/${division}/${plate}.json`);
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
}