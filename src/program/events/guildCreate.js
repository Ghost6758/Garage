module.exports = {
    name: 'guildCreate.js',
    execute (fs, guild) {
        fs.mkdir(`./vehicles/${guild.id}/status/`, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
}