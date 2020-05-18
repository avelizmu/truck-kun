const env = process.env.NODE_ENV || 'development';

module.exports.discord = require('./discord.json')[env];
module.exports.youtube = require('./youtube.json')[env];