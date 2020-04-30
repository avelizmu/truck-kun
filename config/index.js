const env = process.env.NODE_ENV || 'development';

module.exports.sql = require('./sql.json')[env];
module.exports.discord = require('./discord.json')[env];