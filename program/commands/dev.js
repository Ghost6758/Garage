const message = require("../events/message");

module.exports = {
    name: 'dev.js',
    async execute(message, msg, prefix, fs, Discord) {

        if(message.author.id != '701147458406842379') return;

        if(msg.startsWith(prefix+'dev restart')) {
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
            }

            // --> Message
            function send(time) {
                embed1 = new Discord.MessageEmbed()
                    .setDescription('Updated:  '+time)
                    .setColor('#3C7A89')
                message.channel.send(embed1)
            }

            // --> Embed
            embed = new Discord.MessageEmbed()
                .setDescription('Refresh time is set at:  '+(frequency())+' \n\n What would you like this to be changed too? (ms)')
                .setColor('#3C7A89')
            message.channel.send(embed);

            const filter1 = m => m.author.id == message.author.id;
            const collector1 = message.channel.createMessageCollector(filter1, { max: 1, time: 99999999 });
            collector1.on('collect', async m => {

                try {
                    if(parseInt(m.content) <= 5000) {
                        set(5000);
                        send(5000)
                    } else if(parseInt(m.content) >= 600000) {
                        set(600000);
                        send(600000);
                    } else if(5001 < parseInt(m.content) < 599999){
                        set(m.content);
                        send(m.content);
                    } else {
                        message.channel.send('```\n\nERROR: INPUT```');
                    }
                } catch(err) {message.channel.send('```\n\nERROR1: INPUT```')};
            });

        }
    }
}