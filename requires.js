const Discord           = require("discord.js")
const {Intents}         = require("discord.js")
let IF = Intents.FLAGS
client    = new Discord.Client({
    intents: [IF.GUILDS, IF.GUILD_MESSAGES, IF.GUILD_MEMBERS, IF.GUILD_BANS, IF.GUILD_EMOJIS_AND_STICKERS, IF.GUILD_INTEGRATIONS, IF.GUILD_WEBHOOKS, IF.GUILD_INVITES, IF.GUILD_VOICE_STATES, IF.GUILD_PRESENCES, IF.GUILD_MESSAGE_REACTIONS, IF.GUILD_MESSAGE_TYPING, ],
    partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "User"]
})

fs                  = require("fs")
mainconfig          = require("./config/main.json")
readline            = require("readline")
MessageAttachment   = { XXXXXXXXXXXXXXXX, MessageAttachment } = require('discord.js')
mysql               = require("mysql")
fetch               = require("node-fetch")
Hashids             = require("hashids/cjs")
hashids             = new Hashids("", 6)

MessageActionRow    = Discord.MessageActionRow;
MessageButton       = Discord.MessageButton;
MessageEmbed        = Discord.MessageEmbed;
MessageSelectMenu   = Discord.MessageSelectMenu;
MessageAttachment   = Discord.MessageAttachment;
Modal               = Discord.Modal
TextInputComponent  = Discord.TextInputComponent

builder = require("@discordjs/builders")
SlashCommandBuilder = builder.SlashCommandBuilder


sharedVars = {}