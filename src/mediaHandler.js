const MediaPlayer = require('./mediaPlayer');

const players = {};

module.exports.play = (connection, media) => {
    if (!players[connection.channel.id]) {
        players[connection.channel.id] = new MediaPlayer(connection)
    }
    const player = players[connection.channel.id];
    return player.play(media);
}

module.exports.playImmediate = (connection, media) => {
    if (!players[connection.channel.id]) {
        players[connection.channel.id] = new MediaPlayer(connection)
    }
    const player = players[connection.channel.id];
    player.playImmediate(media);
}

module.exports.stop = (connection) => {
    if (players[connection.channel.id]) {
        players[connection.channel.id].stop()
    }
}

module.exports.skip = (connection) => {
    if (players[connection.channel.id]) {
        players[connection.channel.id].skip()
    }
}