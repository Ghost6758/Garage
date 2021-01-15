module.exports = {
    name: 'ready.js',
    execute (client, prefix, fs) {
        
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
        try {
            setInterval(() => {
                client.channels.cache.get('797578271361204266').send(`${prefix}status all`);
            }, frequency());
        } catch(err) {}
    }
}