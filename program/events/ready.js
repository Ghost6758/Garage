module.exports = {
    name: 'ready.js',
    execute (client, prefix, fs) {
        
        // --> status
        client.user.setActivity(`the garage • ${prefix}help`, { type: 'WATCHING' })
        console.log('Cleaning up the garage...');

        // --> Fetch freq
        function frequency() {
            let file_ = fs.readFileSync(`./program/config/update_freq.json`);
            let file = JSON.parse(file_);
            return file.freq;
        }

        // --> Trigger update
        setInterval(() => {
            try {
                message = `${prefix}status`
                client.emit('message', message);
            } catch(err) {}
        }, frequency());
    }
}