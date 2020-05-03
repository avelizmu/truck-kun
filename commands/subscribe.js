const {GuildSettings, Feed, Subscription, FeedToSubscriptionMapping} = require('../models');
const config = require('../config').discord;
const Joi = require('@hapi/joi');
const axios = require('axios');
const xml2js = require('xml2js');

module.exports = {
    name: 'subscribe',
    aliases: [
        's',
        'sub'
    ],
    shortDescription: 'Add a subscription to your feed.',
    description: 'Add a subscription to your feed.\n\n' +
        `► ${config.prefix} subscribe {url} - Create an RSS subscription to start listening to in your feed.` +
        `► ${config.prefix} subscribe {series_name} {subscription_details} - Create a non-rss subscription to start listening to in your ` +
        'feed. In order to get the {subscription_details} run the code found in https://pastebin.com/EjGR6M59 in your browser console while on the subscription\'s page',
    execute: async function (client, message, arguments) {
        if (arguments.length < 1) {
            return message.reply('Invalid arguments.');
        }

        const guildSettings = await GuildSettings.findOne({
            where: {
                guildId: message.guild.id
            }
        });
        if (!guildSettings) {
            return message.reply('This guild has not been initialized yet.');
        }

        const existingFeed = await Feed.findOne({
            where: {
                userId: message.author.id
            }
        });
        if (!existingFeed) {
            return message.reply('You have not created a feed yet.');
        }

        // subscribe {url}
        if (arguments.length === 1) {
            const existingSubscription = await Subscription.findOne({
                where: {
                    url: arguments[0]
                }
            });

            if (existingSubscription) {
                const existingMapping = await FeedToSubscriptionMapping.findOne({
                    where: {
                        subscriptionId: existingSubscription.id
                    }
                });
                if (existingMapping) {
                    return message.reply('You are already subscribed to this.');
                }

                await FeedToSubscriptionMapping.create({
                    subscriptionId: existingSubscription.id,
                    feedId: existingFeed.id
                });
                return message.reply('Added subscription.')
            }

            let result;
            try {
                result = (await axios.get(arguments[0])).data;
            } catch (err) {
                if (err.response) {
                    return message.reply(`An error occurred while subscribing. The provided url responded with a ${err.response.status} error`);
                }
                console.error(err);
                return message.reply('An error occurred while subscribing. Something happened while requesting the provided URL.');
            }
            let rssFeed;
            try {
                rssFeed = await xml2js.parseStringPromise(result);
                if (!rssFeed.rss || !rssFeed.rss.channel) {
                    return message.reply('Invalid RSS feed.');
                }
            } catch (err) {
                return message.reply('Invalid RSS feed.');
            }

            const subscription = await Subscription.create({
                mangadex: arguments[0].startsWith('https://mangadex.org/'),
                name: rssFeed.rss.channel[0].title[0],
                url: arguments[0]
            });
            await FeedToSubscriptionMapping.create({
                subscriptionId: subscription.id,
                feedId: existingFeed.id
            });

            return message.reply('Added subscription.');
        }

        // subscribe {series_name} {subscription_details}
        try {
            const schema = Joi.object({
                image: Joi.string()
                    .required(),
                chapterList: Joi.string()
                    .required(),
                chapterNumber: Joi.string()
                    .required(),
                chapterLink: Joi.string()
                    .required(),
                url: Joi.string()
                    .required()
            });
            const {value: subscriptionDetails} = await schema.validate(JSON.parse(arguments[arguments.length - 1]));

            const existingSubscription = await Subscription.findOne({
                where: {
                    url: subscriptionDetails.url
                }
            });
            if (existingSubscription) {
                const existingMapping = await FeedToSubscriptionMapping.findOne({
                    where: {
                        subscriptionId: existingSubscription.id
                    }
                });
                if (existingMapping) {
                    return message.reply('You are already subscribed to this.');
                }

                await FeedToSubscriptionMapping.create({
                    subscriptionId: existingSubscription.id,
                    feedId: existingFeed.id
                });
                return message.reply('Added subscription.')
            }

            const subscription = await Subscription.create({
                ...subscriptionDetails,
                name: arguments.splice(0, arguments.length - 1).join(' ')
            });
            await FeedToSubscriptionMapping.create({
                subscriptionId: subscription.id,
                feedId: existingFeed.id
            });

            await message.delete();

            return message.reply('Added subscription.');
        } catch (err) {
            if (err.isJoi) {
                return message.reply('Invalid subscription details.')
            }
            throw err;
        }
    }
}
