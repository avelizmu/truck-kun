const {Guild, Feed, Subscription} = require('../models');
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
        'feed. In order to get the {subscription_details} run the code found in https://pastebin.com/udgaJrmC in your browser console while on the subscription\'s page',
    execute: async function (client, message, arguments) {
        if (arguments.length < 2) {
            return message.reply('Invalid arguments.');
        }

        const guild = await Guild.findOne({
            where: {
                guild_id: message.guild.id
            }
        });
        if (!guild) {
            return message.reply('This guild has not been initialized yet.');
        }

        const existingFeed = await Feed.findOne({
            where: {
                user_id: message.author.id
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
                // TODO Once the subscription to feed mapping table is created, add a mapping and inform the user
                return message.reply('Subscription already exists.');
            }


            let result;
            try {
                result = (await axios.get(arguments[arguments.length])).data;
            } catch (err) {
                if (err.response) {
                    return message.reply(`An error occurred while subscribing. The provided url responded with a ${err.response.status} error`);
                }
                return message.reply('An error occurred while subscribing. Something happened while requesting the provided URL.');
            }
            let feed;
            try {
                feed = await xml2js.parseStringPromise(result);
                if (!feed.rss || !feed.rss.channel) {
                    return message.reply('Invalid RSS feed.');
                }
            } catch (err) {
                return message.reply('Invalid RSS feed.');
            }

            await Subscription.create({
                mangadex: arguments[0].startsWith('https://mangadex.org/'),
                name: feed.rss.channel[0].title[0],
                url: arguments[0]
            });

            // TODO Map subscription to feed when mapping table is created

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
                // TODO Once the subscription to feed mapping table is created, add a mapping and inform the user
                return message.reply('Subscription already exists.');
            }

            await Subscription.create({
                ...subscriptionDetails,
                name: arguments.splice(0, arguments.length - 1).join(' ')
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