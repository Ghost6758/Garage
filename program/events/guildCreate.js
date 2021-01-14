module.exports = {
    name: 'guildCreate.js',
    execute (fs, guild) {

        // --> Directory
        let dir = `./vehicles/${guild.id}`;

        // --> Sort folders
        if(fs.existsSync(dir)) {
            fs.rmdirSync(dir, { recursive: true });
            fs.mkdirSync(dir);
            fs.mkdirSync(`${dir}/status/`);
        } else {
            fs.mkdirSync(dir);
            fs.mkdirSync(`${dir}/status/`);
        }
    }
}