module.exports = {
    name: 'ready.js',
    execute (client, backend, prefix) {
        // --> status
        client.user.setActivity(`the garage • ${prefix}help`, { type: 'WATCHING' })
        // --> Log
        console.log('Cleaning up the garage...');
        // --> Fetch channel
        let channel = client.channels.cache.get(backend);
        // --> Status update
        setInterval(() => {
            channel.send(`${prefix}status`);
        }, 15000);
    }
}