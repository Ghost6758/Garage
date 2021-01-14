module.exports = {
    name: 'temp.js',
    execute(msg, prefix, message, fs) {
        if(msg.startsWith(prefix+'setup')) {
            message.channel.send('Standby...').then(m => { m.edit(m.id) });
            message.channel.send('Standby...').then(m => { m.edit(m.id) });
            message.channel.send('Standby...').then(m => { m.edit(m.id) });
            message.channel.send('Standby...').then(m => { m.edit(m.id) });
        }
        if(msg.startsWith(prefix+'purge')) {
            message.channel.bulkDelete(99);
            message.channel.bulkDelete(99);
            message.channel.bulkDelete(99);
            message.channel.bulkDelete(99);
            message.channel.bulkDelete(99);
        }
        if(msg.startsWith(prefix+'terminate')) {
            process.exit();
        }
        if(msg.startsWith(prefix+'test')) {
            let array = [];
            for (const file of fs.readdirSync(`./vehicles/${message.guilds.id}/`).filter(file => !file.startsWith('status'))) {
                array.push(file);
            }
            message.channel.send(array.length+' divisions are present. \n\n'+array.join('\n'));
        }
    }
}