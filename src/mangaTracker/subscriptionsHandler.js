const {Subscription, Chapter, FeedToSubscriptionMapping} = require('./models');
const axios = require('axios');
const xml2js = require('xml2js');
const {MessageEmbed} = require('discord.js');
const {JSDOM} = require('jsdom');
const {CronJob} = require('cron');

let client;

module.exports.init = (discordClient) => {
    client = discordClient;

    new CronJob({
        cronTime: '*/30 * * * *', runOnInit: true, startNow: true, onTick: doCheck
    });
}

const doCheck = async () => {
    const subscriptions = await Subscription.findAll({});

    for (let subscription of subscriptions) {
        // Mangadex Subscriptions
        if (subscription.mangadex) {
            try {
                const {data: content} = await axios.get(subscription.url);


                const {rss} = await xml2js.parseStringPromise(content);
                const items = rss.channel[0].item;

                let newChapters = [];
                for (let item of items) {
                    const chapterNumber = item.title[0].match(/Chapter (\d+\.?\d*)/)[1];
                    const identifier = item.title[0].match(/^(.+) -/)[1];
                    const url = item.link[0];

                    const [chapter, created] = await Chapter.findOrCreate({
                        where: {
                            subscriptionId: subscription.id,
                            identifier,
                            chapter: chapterNumber
                        },
                        defaults: {
                            subscriptionId: subscription.id,
                            identifier,
                            chapter: chapterNumber,
                            url
                        }
                    });
                    if (created) {
                        chapter.mangaLink = item.mangaLink[0];
                        newChapters.push(chapter);
                    }
                }
                const grouped = newChapters.reverse().reduce((accumulator, current) => {
                    if (!accumulator[current.identifier]) {
                        accumulator[current.identifier] = [];
                    }
                    accumulator[current.identifier].push(current);
                    return accumulator;
                }, {});
                for (let groupedChapters of Object.values(grouped)) {
                    const embed = new MessageEmbed()
                        .setTitle(groupedChapters[0].identifier);
                    for (let extension of ['.jpg', '.jpeg', '.png']) {
                        try {
                            let imageUrl = `https://mangadex.org/images/manga/${groupedChapters[0].mangaLink.split('/').reverse()[0]}${extension}`;
                            await axios.get(imageUrl);
                            embed.setImage(imageUrl);
                            break;
                        } catch (err) {
                        }
                    }

                    if (groupedChapters.length > 1) {
                        embed.setURL(groupedChapters[0].url);
                        embed.addField(`Chapter`, groupedChapters[0].chapter, false);
                        embed.addField('New Chapters', groupedChapters.length, false);
                        embed.addField('Newest Chapter', groupedChapters[groupedChapters.length - 1].chapter, false);
                    } else {
                        embed.setURL(groupedChapters[0].url);
                        embed.addField(`Chapter`, groupedChapters[0].chapter, false);
                    }

                    const mappings = await FeedToSubscriptionMapping.scope('withFeed').findAll({
                        where: {
                            subscriptionId: subscription.id
                        },
                    });

                    for (let mapping of mappings) {
                        const channel = await client.channels.fetch(mapping.feed.channelId);
                        channel.send(embed);
                    }
                }
            } catch (err) {
                console.error(err);
            }
            continue;
        }
        try {
            // RSS Subscriptions
            if (subscription.rss) {
                const {data: content} = await axios.get(subscription.url);

                const {rss} = await xml2js.parseStringPromise(content);
                const items = rss.channel[0].item;

                const newChapters = [];
                for (let item of items) {
                    const chapterNumber = item.title[0].replace(/[^\d.]/g, ' ').split(/\s/g).filter(x => x !== '').reverse()[0];
                    const identifier = item.title[0];
                    const url = item.link[0];

                    const [chapter, created] = await Chapter.findOrCreate({
                        where: {
                            subscriptionId: subscription.id,
                            identifier,
                            chapter: chapterNumber
                        },
                        defaults: {
                            subscriptionId: subscription.id,
                            identifier,
                            chapter: chapterNumber,
                            url
                        }
                    });
                    if (created) {
                        rssValuesLoop:
                            for (let value of Object.values(item)) {
                                for (let inner of value) {
                                    if (inner.img) {
                                        chapter.image = inner.img[0]['$'].src;
                                        break rssValuesLoop;
                                    }
                                    if (/\.(jpg|jpeg|png)$/.test(inner)) {
                                        chapter.image = inner.substring(inner.indexOf('http'));
                                        break rssValuesLoop;
                                    }
                                }
                            }
                        newChapters.push(chapter);
                    }
                }

                for (let chapter of newChapters) {
                    const embed = new MessageEmbed()
                        .setTitle(chapter.identifier)
                        .setImage(chapter.image)
                        .setURL(chapter.url);

                    const mappings = await FeedToSubscriptionMapping.scope('withFeed').findAll({
                        where: {
                            subscriptionId: subscription.id
                        },
                    });
                    for (let mapping of mappings) {
                        const channel = await client.channels.fetch(mapping.feed.channelId);
                        channel.send(embed);
                    }
                }
            }

            // Other Subscriptions
            const {data: content} = await axios.get(subscription.url);
            const {window} = new JSDOM(content, {
                url: subscription.url
            });
            const chaptersDom = window.document.querySelectorAll(subscription.chapterList);
            const chapters = [...chaptersDom.values()].map(chapter => {
                const chapterData = {};
                try {
                    chapterData.chapter = chapter.querySelector(subscription.chapterNumber).innerHTML.replace(/[^\d.]/g, '');
                    chapterData.url = chapter.querySelector(subscription.chapterLink).href;
                } catch (err) {
                    return {};
                }
                return chapterData;
            }).filter(x => !!x && Object.keys(x).length);
            const image = window.document.querySelector(subscription.image);

            const newChapters = [];
            for (let scrapedChapter of chapters) {
                const [chapter, created] = await Chapter.findOrCreate({
                    where: {
                        subscriptionId: subscription.id,
                        identifier: subscription.name,
                        chapter: scrapedChapter.chapter,
                    },
                    defaults: {
                        subscriptionId: subscription.id,
                        identifier: subscription.name,
                        chapter: scrapedChapter.chapter,
                        url: scrapedChapter.url
                    }
                });
                if (created) {
                    newChapters.push(chapter);
                }
            }

            if (newChapters.length) {
                const embed = new MessageEmbed()
                    .setTitle(subscription.name);

                if (newChapters.length > 1) {
                    embed.setURL(newChapters[newChapters.length - 1].url);
                    embed.addField(`Chapter`, newChapters[newChapters.length - 1].chapter, false);
                    embed.addField('New Chapters', newChapters.length, false);
                    embed.addField('Newest Chapter', newChapters[0].chapter, false);
                } else {
                    embed.setURL(newChapters[newChapters.length - 1].url);
                    embed.addField(`Chapter`, newChapters[newChapters.length - 1].chapter, false);
                }

                if (image.tagName === 'A') {
                    const style = image.style;
                    let styleString;
                    if (style['background-image']) {
                        styleString = style['background-image'];
                    } else if (style['background']) {
                        styleString = style['background-image'];
                    }
                    let imageUrl = styleString.replace(/^url\("?/, '').replace(/"?\)$/, '');
                    if (imageUrl.startsWith('/')) {
                        imageUrl = `https://${window.location.host}${imageUrl}`;
                    }
                    embed.setImage(imageUrl);
                } else if (image.tagName === 'IMG') {
                    if (image.getAttribute('data-src')) {
                        embed.setImage(image.getAttribute('data-src'));
                    } else {
                        embed.setImage(image.src);
                    }
                }

                const mappings = await FeedToSubscriptionMapping.scope('withFeed').findAll({
                    where: {
                        subscriptionId: subscription.id
                    },
                });

                for (let mapping of mappings) {
                    const channel = await client.channels.fetch(mapping.feed.channelId);
                    channel.send(embed);
                }
            }
        } catch (err) {
            // Handle unexpected errors (such as cloudflare access denied) without crashing
            console.error(`Error while handling ${subscription.url}`);
        }
    }
}