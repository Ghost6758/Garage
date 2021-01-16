module.exports = {
    name: 'dev.js',
    execute(msg, prefix) {
        if(msg.startsWith(prefix+'dev terminate')) {
            process.exit();
        }
    }
}