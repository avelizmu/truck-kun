const ytdl = require('ytdl-core');

module.exports = class MediaPlayer {
    connection;
    dispatcher;
    queue = [];
    currentlyPlaying;
    timeoutHandle;
    lastFinished;

    constructor(connection) {
        this.connection = connection;
    }

    play(media) {
        if (!media) {
            return;
        }
        if (this.currentlyPlaying || Date.now() - this.lastFinished < 200) {
            this.queue.push(media);
            console.log(`Adding to queue ${JSON.stringify(media, null, 2)}`)
            return `Adding ${media.url} to queue.`;
        } else {
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
                this.timeoutHandle = null;
            }
            console.log(JSON.stringify(media, null, 2));
            const stream = ytdl(media.url, {filter: 'audioonly'});
            if (!stream) {
                console.log(`COULD NOT GET STREAM FOR ${media.url}`);
                return;
            }
            this.dispatcher = this.connection.play(stream, {
                seek: media.seek
            });
            this.currentlyPlaying = media;
            this.dispatcher.on('finish', () => {
                this.lastFinished = Date.now();
                this.dispatcher.destroy();
                this.dispatcher = null;
                this.currentlyPlaying = null;
                setTimeout(() => {
                    this.play(this.queue.shift());
                }, 200)
            });
            this.dispatcher.on('error', err => {
                console.log('This is an error');
                console.error(err);
                this.lastFinished = Date.now();
                this.dispatcher.destroy();
                this.dispatcher = null;
                this.currentlyPlaying = null;
                setTimeout(() => {
                    this.play(this.queue.shift());
                }, 200)
            });
            if (media.endTime) {
                this.dispatcher.on('start', () => {
                    this.timeoutHandle = setTimeout(async () => {
                        if (this.currentlyPlaying.url === media.url) {
                            this.skip()
                        }
                    }, media.endTime)
                })
            }

            return `Playing ${media.url}`;
        }
    }

    playImmediate = (media) => {
        if (this.dispatcher) {
            if (this.currentlyPlaying) {
                this.queue.unshift({
                    url: this.currentlyPlaying.url,
                    seek: this.dispatcher.totalStreamTime / 1000 + this.currentlyPlaying.seek,
                    endTime: this.currentlyPlaying.endTime ? this.currentlyPlaying.endTime - this.dispatcher.totalStreamTime : 0
                });
            }
            this.queue.unshift(media);
            this.dispatcher.end();
        } else {
            this.play(media);
        }
    }

    stop() {
        this.queue = [];
        if (this.dispatcher) {
            this.dispatcher.end();
        }
    }

    skip() {
        if (this.dispatcher) {
            this.dispatcher.end();
        }
    }
}