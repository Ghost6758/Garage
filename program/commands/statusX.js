module.exports = {
    name: 'status.js',
    description: 'Specific guild',
    async execute(Discord, fs, status, alert, client, guild) {
        
        // --> Arrays
        const array = [];

        // --> Declare embeds
        let global_e = new Discord.MessageEmbed()
            .setFooter('Garage Overview')
            .setTimestamp()
            .setColor('#9FA2B2')  
        
        // --> Fetch data
        for (const file of fs.readdirSync(`./vehicles/${guild}/`).filter(file => !file.startsWith('xyz_status') && !file.startsWith('xyz_setup'))) {

            array.push(`\n\n__**${file}**__`);
                
            for (const file1 of fs.readdirSync(`./vehicles/${guild}/${file}/`).filter(file => file.endsWith('.json'))) {
                    
                let veh_ = fs.readFileSync(`./vehicles/${guild}/${file}/${file1}`);
                let veh = JSON.parse(veh_);
                for(let i in veh) {
                    let type = veh[i].type;
                    let make = veh[i].make;
                    let model = veh[i].model;
                    
                    let rawdata = fs.readFileSync(`./vehicles/${guild}/xyz_status/${file1}`);
                    let userData = JSON.parse(rawdata);
                    for(let i in userData) {
        
                        let plate = userData[i].plate;
                        let status = userData[i].status;

                        if(status == 'Garage') {
                            
                            let division = file;

                            if(userData[i].timeAV < Date.now()) {

                                // --> Vehicle is now ready
                                let data3 = {};
                                data3 [Date.now()] = {
                                    status: "Available",
                                    plate: plate,
                                    division: division,
                                    timeAV: "NA",
                                };
                                fs.writeFile(`./vehicles/${guild}/xyz_status/${plate}.json`, JSON.stringify(data3, null, 4), err => {
                                    if (err) throw err;
                                });

                                embed = new Discord.MessageEmbed()
                                    .setTitle('Vehicle Repaired')
                                    .setDescription(`**${division} (${type})** \n${plate} - ${make} ${model} - Available`)
                                    .setColor("#3C7A89")
                                    .setFooter('Garage Alert')
                                    .setTimestamp()
                                client.channels.cache.get(alert).send(embed);

                                string = `\n${type} - ${plate} - ${make} ${model} - ${status}`
                                array.push(string);
                                return

                            } else {
                                // --> Vehicle still in the garage
                                time = (userData[i].timeAV - Date.now()) / 8.64e+7
                                string = `\n${type} - ${plate} - ${make} ${model} - ${status} (${time.toFixed(1)} days)`
                                array.push(string);
                            }
                        } else {
                            // --> Vehicle available
                            string = `\n${type} - ${plate} - ${make} ${model} - ${status}`
                            array.push(string);
                        };
                    };
                };
            };
        };
        

        // --> Set description
        global_e.setDescription(array.join(' '));

        // --> Fetch messages & edit with updated values
        let channel1 = client.channels.cache.get(status);
        await channel1.messages.fetch({around: '804887103254954024', limit: 1})
        .then(messages => {
            messages.first().edit(global_e);
        });
    }
}