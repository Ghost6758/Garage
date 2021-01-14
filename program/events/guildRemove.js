module.exports = {
    name: 'guildRemove.js',
    execute (fs, guild) {
        
        // --> Directory
        let dir = `./vehicles/${guild.id}`;

        // --> Delete folder
        if(fs.existsSync(dir)) {
            fs.rmdirSync(dir, { recursive: true });
        } else {
            return
        }
    }
}