const {Subscription, Chapter, FeedToSubscriptionMapping} = require('../models');
const axios = require('axios');
const xml2js = require('xml2js');
const {MessageEmbed} = require('discord.js');

let client;

module.exports.init = (discordClient) => {
    client = discordClient;

    // TODO implement check scheduling
    doCheck();
}

const doCheck = async () => {
    const subscriptions = await Subscription.findAll({});

    for (let subscription of subscriptions) {
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
        }

        // TODO implement non-mangadex subscription handlers
    }
}