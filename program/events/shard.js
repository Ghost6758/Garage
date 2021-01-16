// --> Load modules
const { ShardingManager } = require('discord.js');
require('dotenv').config();
const manager = new ShardingManager('./../../index.js', { token: process.env.token });

// --> Create shard
manager.on('shardCreate', shard => {
    console.log(`--> Sharding Initialised (${shard.id})`);
});
manager.spawn();