module.exports = {
    name: 'ready.js',
    execute (client, prefix, fs, backend) {
        
        // --> status
        client.user.setActivity(`the garage • ${prefix}help`, { type: 'WATCHING' })
        console.log('--> Bot initialised');

        // --> Fetch freq
        function frequency() {
            let file_ = fs.readFileSync(`./program/config/update_freq.json`);
            let file = JSON.parse(file_);
            return file.freq;
        }

        // --> Trigger update
        var myFunction = function() {
            client.channels.cache.get(backend).send(`${prefix}status all`);
            setTimeout(myFunction, frequency());
        }
        setTimeout(myFunction, frequency());
    }
}