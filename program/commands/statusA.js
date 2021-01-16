module.exports = {
    name: 'statusA.js',
    description: 'all guilds',
    async execute(Discord, fs, status, alert, client) {
        
        // --> Arrays
        const array = [];
        const guild = [];

        // --> Fill guild array
        client.guilds.cache.forEach(x => { 
            guild.push(x.id);
        });
        
        // --> Fetch data
        for (b = 0; b < guild.length; b++) {

            // --> Declare embeds
            let global_e = new Discord.MessageEmbed()
                .setFooter('Garage Overview')
                .setTimestamp()
                .setColor('#9FA2B2')  

            for (const file of fs.readdirSync(`./vehicles/${guild[b]}/`).filter(file => !file.startsWith('xyz_status') && !file.startsWith('xyz_setup'))) {

                array.push(`\n\n__**${file}**__`);
                
                for (const file1 of fs.readdirSync(`./vehicles/${guild[b]}/${file}/`).filter(file => file.endsWith('.json'))) {
                    
                    let veh_ = fs.readFileSync(`./vehicles/${guild[b]}/${file}/${file1}`);
                    let veh = JSON.parse(veh_);
                    for(let i in veh) {
                        let type = veh[i].type;
                        let make = veh[i].make;
                        let model = veh[i].model;
                        
                        let rawdata = fs.readFileSync(`./vehicles/${guild[b]}/xyz_status/${file1}`);
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

                                    time = (userData[i].timeAV - Date.now())
                                    
                                    if(time <= 60000) {
                                        time1 = time / 1000;
                                        string = `\n${type} - ${plate} - ${make} ${model} - ${status} (${time1.toFixed(0)} seconds)`
                                        array.push(string);
                                    } else if(time <= (8.64e+7 / 24)) { // less than one hour
                                        time1 = time / (8.64e+7 / (24*60));
                                        string = `\n${type} - ${plate} - ${make} ${model} - ${status} (${time1.toFixed(0)} minutes)`
                                        array.push(string);
                                    } else if(time <= 8.64e+7) { // less than one day
                                        time1 = time / (8.64e+7 / 24);
                                        string = `\n${type} - ${plate} - ${make} ${model} - ${status} (${time1.toFixed(0)} hours)`
                                        array.push(string);
                                    } else {
                                        time1 = time / 8.64e+7;
                                        string = `\n${type} - ${plate} - ${make} ${model} - ${status} (${time1.toFixed(2)} days)`
                                        array.push(string);
                                    }
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
            await channel1.messages.fetch({around: '799714857788244008', limit: 1})
            .then(messages => {
                messages.first().edit(global_e);
            });
        }       
    }
}