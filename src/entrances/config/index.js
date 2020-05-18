const env = process.env.NODE_ENV || 'development';

module.exports.discord = require('./discord.json')[env];
module.exports.sql = require('./sql.json')[env];