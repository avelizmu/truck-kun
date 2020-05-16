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
        if (!media) {
            return;
        }
        if (this.dispatcher) {
            this.queue.push(media);
            return `Adding ${media.url} to queue`;
        } else {
            const stream = ytdl(media.url, {filter: 'audioonly'});
            this.dispatcher = this.connection.play(stream, {
                seek: media.seek
            });
            this.currentlyPlaying = media;
            this.dispatcher.on('finish', () => {
                this.dispatcher = null;
                this.play(this.queue.shift());
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
        if (this.dispatcher) {
            this.queue.unshift({
                url: this.currentlyPlaying.url,
                seek: this.dispatcher.totalStreamTime / 1000 + parseFloat(this.currentlyPlaying.seek)
            });
            this.queue.unshift(media);
            this.dispatcher.end();
            this.dispatcher = null;
        } else {
            this.play(media);
        }
    }

    stop() {
        this.queue = [];
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
    }
}