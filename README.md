# truck-kun

Discord bot made with node.js to manage a server as well as track and notify of new manga updates

# Install Instructions

* `git clone https://github.com/aveliz1999/truck-kun`
* `cd truck-kun`
* `npm install`
* Rename or copy all the `.json.example` files on `config/` to just `.json`
* Change the config file values to match your running environment

# Usage

To start the server just run `npm start`. 
To set the environment to production, you can start it with `NODE_ENV=production npm start`.

# Commands
Administration commands can only be used by users whose highest role is higher than the bot's highest role.

## Manga Feed Commands

### Initialize
    {bot_prefix} initialize {feed_category}
Initialize a Discord guild to start handling manga subscriptions.
The {feed_category} is the ID of the discord channel category where the feed channels will be created.

### Create Feed
    {bot_prefix} createFeed
Create the user's personal feed to start receiving updates. Can only be used once per user in each Discord guild.

### Subscribe
    {bot_prefix} subscribe {url}
    {bot_prefix} subscribe {series_name} {subscription_details}
Once the guild has been initialized and you have a feed ready, you can add subscriptions to it.

The first command which takes in {url} will work with either a MangaDex follows RSS feed url, or a normal RSS feed url.

The second command is used for individual series, useful when a series is not on MangaDex and has no RSS feed.
The {series_name} is the name of the series you are subscribing to.
The {subscription_details} can be acquired by pasting the code found on https://pastebin.com/0cikTuVS
in the console of the series' web site. Follow the instructions that pop up on the screen after you paste the code and
press enter.

## Other Commands

### Help
    {bot_prefix} help
    {bot_prefix} help {command}
The in-chat help command.

The first command will send a list of all the bot commands in the channel where it was called, along with their short
descriptions.

The second command will send the detailed description of a specific command.

### Purge
    {bot_prefix} purge {id}
    {bot_prefix} purge {url}
Management command to delete large amounts of messages at once. It takes either a message ID or a message link, of a
message in the same channel as the command is sent. It will then delete every message up to (and including) the target
message.

### Set Entrance
    {bot_prefix} setEntrance {youtube_url} {start_time} {duration_time}
Sets your voice channel entrance. When entering the voice channel specified in the discord config file, if you have an
entrance set, the bot will join the voice channel with you and play your entrance.

### Set Activity
    {bot_prefix} setActivity {activity_type} {status}
Set the bot's activity/presence. The activity_type must be one of playing, watching, streaming, or listening.