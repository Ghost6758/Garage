module.exports = {
    name: 'ready.js',
    execute (client, prefix, fs, backend) {
        
        // --> status
        client.user.setActivity(`the garage • ${prefix}help`, { type: 'WATCHING' })
        console.log('--> Bot Initialised');

        // --> Fetch freq
        function frequency() {
            let file_ = fs.readFileSync(`./program/config/update_freq.json`);
            let file = JSON.parse(file_);
            return file.freq;
        }

        // --> Trigger update
        var myFunction = function() {
            try {
                client.channels.cache.get(backend).send(`${prefix}status all`);
            } catch(err) {};
            setTimeout(myFunction, frequency());
        }
        setTimeout(myFunction, frequency());

        // --> Initial update
        client.channels.cache.get(backend).send(`${prefix}status all`)
    }
}