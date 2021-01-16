module.exports = {
    name: 'stats.js',
    execute (fs, message, Discord, client) {
    
        // --> Arrays
        const division_each = []; // string per guild
        const division_list = [];  // divisons
        const vehicle_total = []; // total no of vehicles
        const garage_total = [];
        const available_total = [];

        // --> Fetch data
        for (const file of fs.readdirSync(`./vehicles/${message.guild.id}/`).filter(file => !file.startsWith('xyz_status') && !file.startsWith('xyz_setup'))) {

            division_list.push(file);
            division_x = []; //vehicles per division 
                
            for (const file1 of fs.readdirSync(`./vehicles/${message.guild.id}/${file}/`).filter(file => file.endsWith('.json'))) {
                division_x.push(file1+', ');
                vehicle_total.push(file1);
            }

            division_each.push(`\n**${file}:**  ${division_x.length} Vehicles`);
        };
        for (const file2 of fs.readdirSync(`./vehicles/${message.guild.id}/xyz_status/`).filter(file => file.endsWith('.json'))) {
            
            let rawdata = fs.readFileSync(`./vehicles/${message.guild.id}/xyz_status/${file2}`);
            let userData = JSON.parse(rawdata);
            for(let i in userData) {
                
                let status = userData[i].status;
                if(status == 'Garage') {
                    garage_total.push(status);
                } else {
                    available_total.push(status);
                }
            }
        };

        embed = new Discord.MessageEmbed()
            .setTitle('Garage Statistics')
            .setDescription(`__**Divisions**__ \n\n${division_list.length} Divisions (${division_list.join('/')}) \n\n__**Vehicles per devision**__ \n\n${division_each}, \n\n__**Overall**__\n\n**Total vehicles:**  ${vehicle_total.length} \n**Total available:**  ${available_total.length} \n**Total in garage:**  ${garage_total.length}`)
            .setFooter('Garage System')
            .setTimestamp()
            .setColor('#002492') 
        message.channel.send(embed);       
    }
}