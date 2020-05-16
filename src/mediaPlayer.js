const ytdl = require('ytdl-core');

module.exports = class MediaPlayer {
    connection;
    dispatcher;
    queue = [];
    currentlyPlaying;

    constructor(connection) {
        this.connection = connection;
    }

    play(media) {
        if (this.dispatcher || this.queue.length) {
            this.queue.push(media);
            return `Adding ${media.url} to queue`;
        } else {
            const stream = ytdl(media.url, {filter: 'audioonly'});
            this.dispatcher = this.connection.play(stream, {
                seek: media.seek
            });
            this.currentlyPlaying = media.url;
            this.dispatcher.on('finish', (reason) => {
                this.skip();
            });
            this.dispatcher.on('error', err => {
                console.error(err);
                this.play(this.queue.shift());
            });
            if (media.endTime) {
                this.dispatcher.on('start', () => {
                    setTimeout(async () => {
                        this.skip()
                    }, media.endTime)
                })
            }

            return `Playing ${media.url}`;
        }
    }

    playImmediate = (media) => {
        let streamTime = 0;
        if (this.dispatcher) {
            streamTime = this.dispatcher.totalStreamTime / 1000;
            this.dispatcher.end();
            this.dispatcher = null;
        }
        this.queue.unshift({
            url: this.currentlyPlaying,
            seek: streamTime
        });
        this.play(media);
    }

    stop() {
        if (this.dispatcher) {
            this.dispatcher.end();
            this.dispatcher = null;
        }
    }

    skip() {
        if (this.dispatcher) {
            this.dispatcher.end();
            this.dispatcher = null;
        }
        this.play(this.queue.shift());
    }
}