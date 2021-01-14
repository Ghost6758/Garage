module.exports = {
    name: 'status1.js',
    async execute(Discord, fs, status, client) {
        
        // --> Arrays
        const array = [];
        const guild = [];

        // --> Fill guild array
        client.guilds.cache.forEach(x => { 
            guild.push(x.id);
        });

        // --> Declare embeds
        let global_e = new Discord.MessageEmbed()
            .setTitle('Garage Overview')
            .setFooter('Garage Overview')
            .setTimestamp()
            .setColor('#002492')  
        
        // --> Fetch data
        for (b = 0; b < guild.length; b++) {
            for (const file of fs.readdirSync(`./vehicles/${guild[b]}/`).filter(file => !file.startsWith('status'))) {

                array.push(`\n\n__**${file}**__`);
                
                for (const file1 of fs.readdirSync(`./vehicles/${guild[b]}/${file}/`).filter(file => file.endsWith('.json'))) {
                    
                    let veh_ = fs.readFileSync(`./vehicles/${guild[b]}/${file}/${file1}`);
                    let veh = JSON.parse(veh_);
                    for(let i in veh) {
                        let type = veh[i].type;
                        let make = veh[i].make;
                        let model = veh[i].model;
                        
                        let rawdata = fs.readFileSync(`./vehicles/${guild[b]}/status/${file1}`);
                        let userData = JSON.parse(rawdata);
                        for(let i in userData) {
            
                            let plate = userData[i].plate;
                            let status = userData[i].status;
    
                            if(status == 'Garage') {
                                // --> Vehicle is in the garage
                                time = (userData[i].timeAV - Date.now()) / 8.64e+7
                                string = `\n${type} - ${plate} - ${make} ${model} - ${status} (${time.toFixed(2)} days)`
                                array.push(string);
                            } else {
                                // --> Vehicle available
                                string = `\n${type} - ${plate} - ${make} ${model} - ${status}`
                                array.push(string);
                            };
                        };
                    };
                };
            };
        }; 
        

        // --> Set description
        global_e.setDescription(array.join(' '));

        // --> Fetch messages & edit with updated values
        let channel1 = client.channels.cache.get(status);
        await channel1.messages.fetch({around: '799269960693317722', limit: 1})
        .then(messages => {
            messages.first().edit(global_e);
        });
    }
}