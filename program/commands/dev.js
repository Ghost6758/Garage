const message = require("../events/message");

module.exports = {
    name: 'dev.js',
    async execute(message, msg, prefix, fs, Discord) {

        if(message.author.id != '701147458406842379') return;

        if(msg.startsWith(prefix+'dev terminate')) {
            process.exit();
        }
        if(msg.startsWith(prefix+'dev refresh')) {
            
            // --> Fetch freq
            function frequency() {
                let file_ = fs.readFileSync(`./program/config/update_freq.json`);
                let file = JSON.parse(file_);
                return file.freq;
            }

            // --> Edit freq
            function set(time) {
                let data = {};
                data = {
                    freq: time
                };
                fs.writeFile(`./program/config/update_freq.json`, JSON.stringify(data, null, 4), err => {
                    if (err) throw err;
                });
                message.channel.send(frequency());
            }

            // --> Embed
            embed = new Discord.MessageEmbed()
                .setDescription('Refresh time is set at:  '+(frequency())+' \n\n What would you like this to be changed too? (ms)')
                .setColor('#3C7A89')
            pending = await message.channel.send(embed);

            const filter1 = m => m.author.id == message.author.id;
            const collector1 = message.channel.createMessageCollector(filter1, { max: 1, time: 99999999 });
            collector1.on('collect', async m => {
                embed1 = new Discord.MessageEmbed()
                    .setDescription('Updated...')
                    .setColor('#3C7A89')
                if(m <= 5000) {
                    set(5000);
                    console.log('1');
                    pending.edit(embed1);
                } else if(m >= 600000) {
                    set(600000);
                    console.log('2');
                    pending.edit(embed1);
                } else if(5001 < m < 599999){
                    set(m);
                    console.log('3');
                    pending.edit(embed1);
                } else {
                    message.channel.send('```\n\nERROR: INPUT```');
                }
            });

        }
    }
}