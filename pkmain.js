const request = require('request');
const Discord = require("discord.js");
const fs = require("fs");
const google = require("googleapis");
const youtube = google.youtube("v3"); //var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const bot = new Discord.Client();
const prefix = "$";
const botlogchannel = "406504806954565644";
const botmlogchannel = "409055298158985216";
const botbuglogchannel = "418642505509240836";
const boterrorchannel = "420955154695585792";
const botleavejoinchannel = "431829603741466634";
const botrejectionschannel = "432090416834412545";
const botowner = "264470521788366848";
const wfortunes = ["{user} keep you`r shoes out of door", "hey {user} show your swag", "be carefull {user} is here! -_-", "{user} make the party awesome", "Hi {user} Take guitar & enjoy party", "hehe {user} are slide hide your dishes", "let's go {user} for chicken dinner"];
const wimages = [`https://imgur.com/Z2fpFVi.png`, `https://imgur.com/G29egX4.png`, `https://imgur.com/LHdn5I8.png`, `https://imgur.com/GziAP26.png`, `https://imgur.com/GjI5Vpk.png`, `https://imgur.com/WqTnmM0.png`, `https://imgur.com/qknRCM7.png`];
const icwstaff = ["385099687465844736", "278587244443467777", "288961251973791744"];
const owmkey = process.env.KEY_WEATHER;
var cleverbot = require("better-cleverbot-io"),
cbot = new cleverbot("nN2b553iWXYX32ad", "Z8YpblfMsmKNmvZlr23QPjJeEd8cWBRv");
cbot.setNick("icw")
cbot.create().then(() => {
    //You just initialized the module :)
}).catch(err => {
//if anything weird happend, you will find it here.
});
var Heroku = require('heroku.node');
var hbot = new Heroku({ email: 'pardeepsingh1236512365@gmail.com', api_key: 'Process.env.H_APIKEY' });
const { inspect } = require("util");
const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const querystring = require('querystring');
const firebase = require("firebase");
const Jimp = require("jimp");

const ord = number => { let or; const num = number.toString(); if (num.endsWith("1")) { or = "st"; } else if (num.endsWith("2")) { or = "nd"; } else if (num.endsWith("3")) { or = "rd"; } else { or = "th"; } return or; };

firebase.initializeApp({
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DATABASE_URL,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID
});
firebase.auth().signInWithEmailAndPassword(process.env.FB_EMAIL, process.env.FB_PASSWORD);
const db = firebase.database();

bot.on("ready", function() {
    console.log("Main Bot ready");
    bot.channels.get(botlogchannel).send("Main bot ready");
});
bot.on("disconnect", function() {
    console.log("Main Bot disconnected");
    bot.channels.get(botlogchannel).send("Main bot disconnected");
    process.exit(1);
});

bot.login(process.env.BOTTOKEN).then(function() {
    console.log("Main Bot logged in");
    bot.channels.get(botlogchannel).send("Main bot logged in");
}).catch(console.log);

bot.on("message", async(message) => {
    if (!message.content.startsWith(prefix)) {
        return undefined;
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "eval") {
        if (message.author.id !== botowner) {
            message.reply('this command is only for bot owner!!!');
            return;
        }
        if (/bot.token/.exec(message.content.split(" ").slice(1).join(" "))) return message.channel.send("I think im not idiot");
        const code = args.join(" ");
        const token = bot.token.split("").join("[^]{0,2}");
        const rev = bot.token.split("").reverse().join("[^]{0,2}");
        const filter = new RegExp(`${token}|${rev}`, "g");
        try {
            let output = eval(code);
            if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, "[TOKEN]");
            output = clean(output);
            if (output.length < 1950) {
                message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
            } else {
                message.channel.send(`${output}`, { split: "\n", code: "js" });
            }
        } catch (error) {
            message.channel.send(`The following error occured \`\`\`js\n${error}\`\`\``);
        }
    }

    function clean(text) {
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    }
});

bot.on('message', async(message) => {
    if (message.author.bot) return undefined;
    if (message.channel.type == "dm" || message.channel.type == "group") return undefined;
    if (message.content.startsWith(`<@${bot.user.id}>`) || message.content.startsWith(`icw`) || message.content.startsWith(`Icw`) || message.content.startsWith(`ICW`)) {
        cbot.ask(message.content, function (err, response) {
        message.channel.send(response); // Will likely be: "Living in a lonely world"
     });
        return;
    }
});

bot.on("message", async(message) => {
    const sstatus = (await db.ref(`bot/`).child('sstatus').once('value')).val();
    bot.user.setPresence({ status: `streaming`, game: { name: `${sstatus}`, type: `STREAMING`, url: `https://www.twitch.tv/pardeepsingh12365` } });

    if (message.author.bot) return undefined;
    const randomcolor = '0x' + Math.floor(Math.random() * 16777215).toString(16);

    if (!message.channel.type == "dm" || !message.channel.type == "group") return undefined;
    if (message.guild) return undefined
    args = message.content.substring(prefix.length + 1).split();
    comarg = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = comarg.shift().toLowerCase();

    if (command === "setstream" || command === "ss") {
        let arg2 = args.join().substring(command.length)
        firebase.database().ref(`bot/`).update({
            sstatus: arg2
        }).catch(function(err) {
            message.channel.send(err + "\n\n\n");
        });
        message.channel.send(`Stream updated successfully ${arg2}`);
    }

    if (command === "ping") {
        let pingembed = new Discord.RichEmbed().setColor(randomcolor).addField("Pong! Websocket Latency:", `${bot.ping}`);
        message.channel.send({ embed: pingembed })
    }

    if (command === "restart") {
        if (message.author.id !== botowner) {
            message.reply('this command is only for bot owner!!!');
            return;
        }
        message.channel.send("bot restarting");
        process.exit()
    }

    if (command === "help") {
        let helpembed = new Discord.RichEmbed()
            .setColor(randomcolor)
            .setAuthor("Hi " + message.author.username.toString(), message.author.displayAvatarURL)
            .setDescription(`ICW help Section \nDefault Prefix = ${prefix} \nvolume command is for all users \nmore commands coming soon`)
            .addField("Custom Prefix", `setprefix - (for set the custom prefix for server) \nprefix - (for check the server prefix)`)
            .addField("Bot info commands", `ping - (bot ping) \ninvite - (bot invite link)\nbotinfo - (info about the bot)\`\`info , botstatus\`\` \nuptime - (uptime of the bot)\nservers - (bots servers)`)
            .addField("until commands", `cleverbot - (talk with bot with mention or icw \`\`example - icw hi\`\`) \`\`icw\`\` \ngoogle - (search anything) \`\`gsearch , g , \`\` \nweather - (check your city weather) \nsay - (bot saying your message) \ndiscrim - (found any discriminators) \nserverinfo - (info about server)`)
            .addField("Modration command", ` welcome - (welcoming the member) \n purge (delete multiple messages) \`\`delete\`\`, \`\`prune\`\` \n warn - (for warning a member) \n kick - (for kick a member) \n ban - (for ban a member)`)
            .addField("Music commands", `play - (for serach and add your song in thre queue) \`\`p\`\` \npause - (pause the player) \nresume - (resume the player) \nvolume - (set your player volume) \`\`sv , setvolume\`\` \nskip - (for next song) \`\`s , next\`\` \nprev - (for previos song) \nstop - (for stop the player) \nqueue - (for check playlist) \`\`q , playlist\`\` \nsong - (view current song) \`\`np , nowplaying\`\` \nrandom - (playing randomly)`)
            .setThumbnail("https://media.discordapp.net/attachments/406099961730564107/407455733689483265/Untitled6.png?width=300&height=300")
            .setFooter("Bot Developed by: PK#1650 ", "https://cdn.discordapp.com/attachments/399064303170224131/405585474988802058/videotogif_2018.01.24_10.14.40.gif")
            .addField("if you find any bug plz report it with command", `bugreport - (report for any bugs or problams) \`\`bug\`\``)
            .addField("support server", `[link](https://discord.gg/zFDvBay)`, inline = true)
            .addField("bot invite link", `[invite](https://discordapp.com/oauth2/authorize?client_id=376292306233458688&permissions=8&scope=bot)`, inline = true)
            .addField("please give upvote", `[vote and invite link](https://discordbots.org/bot/376292306233458688)`, inline = true)
            .addField("help with donate", `[patreon](https://www.patreon.com/icw)`, inline = true)
            .setTimestamp();
        message.author.send({ embed: helpembed });
    }

    if (command === "say") {
        message.delete().catch(err => bot.channels.get(botrejectionschannel).send(`${message.author.username} using say command in dm \n${err}`))
        message.channel.send(args.join("").substring(3));
    }

    if (command === "bugreport" || command === "bug") {
        let args2 = args.join("").substring(command.length);
        if (!args2) return message.channel.send(`***plz add a bug message after command***`);
        message.channel.send(`***Report sented succesfully thank you***`);
        bot.channels.get(botbuglogchannel).send(`report by: **${message.author.tag}** from: **${message.guild.name}** (${message.guild.id}) \nbug: ${args2}`);
    }

    if (command === "servers") {
        let guilds = bot.guilds.map((guild) => `**${guild.name}** members: ${guild.members.size} id: (${guild.id})`);
        message.channel.send(`I'm in the **${bot.guilds.size} guilds**:\n${guilds.join ('\n')}`, { split: "\n" })
    }

    if (command === "weather") {
        var cityname = args.join("").substring(7);
        var http = require('http');
        request({
            url: 'http://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&APPID=' + owmkey
        }, (error, response, body) => {
            if (error) return;
            var data = JSON.parse(body);
            if (data.cod == "404") {
                message.channel.send(data.message);
                return;
            }
            var weather_main = parseFloat(data.main.temp) - 273.15;
            var temp_max = parseFloat(data.main.temp_max) - 273.15;
            var temp_min = parseFloat(data.main.temp_min) - 273.15;
            const embed = new Discord.RichEmbed()
                .setTitle(data.name + ',' + data.sys.country)
                .setAuthor("ICW weather info", "https://cdn.discordapp.com/attachments/398789265900830760/405592021579989003/videotogif_2018.01.24_10.46.57.gif")
                .setColor(randomcolor)
                .setDescription(data.weather[0].description)
                .setThumbnail("http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
                .setURL("https://openweathermap.org/city/" + data.name)
                .addField("main", weather_main + " c", true)
                .addField("pressure", data.main.pressure + " Hpz", true)
                .addField("wind", data.wind.speed + " mph" + "/ Direction" + data.wind.deg, true)
                .addField("visibility", data.visibility, true)
                .setFooter("Requested by " + message.author.username.toString(), message.author.displayAvatarURL)
                .setTimestamp();
            message.channel.send({ embed });
        });
    }

    if (command == "gsearch" || command === "google" || command === "g") {
        let args3 = message.content.substring(command.length + prefix.length + 1);
        let searchMessage = await message.reply('Searching... Sec.');
        let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(args3)}`;
        return snekfetch.get(searchUrl).then((result) => {
            let $ = cheerio.load(result.text);
            let googleData = $('.r').first().find('a').first().attr('href');
            googleData = querystring.parse(googleData.replace('/url?', ''));
            searchMessage.edit(`Result found!\n${googleData.q}`);
        }).catch((err) => {
            bot.channels.get(botrejectionschannel).send(`${message.author.username} using google command in dm \n${err}`)
            searchMessage.edit('No results found!');
        });
    }

    if (command === "discrim") {
        const discrim = args.join("").substring(7);
        if (!discrim) return message.reply("oops! I could not find the discriminator that you had given.");
        if (typeof discrim !== 'integer')
            if (discrim.size < 4) return message.reply("Don't you know that discrims are 4 numbers? -.-");
        if (discrim.size > 4) return message.reply("Don't you know that discrims are 4 numbers? -.-");
        let members = bot.users.filter(c => c.discriminator === discrim).map(c => c.username).join(`\n`);
        if (!members) return message.reply("404 | No members have that discriminator!");
        message.channel.send(`\`\`\`ICW Discrim Finder\nI found these discriminators.\n\n${members}#${discrim}\`\`\``, { split: "\n" });
    }

    if (command === "invite") {
        message.channel.send("Invite URL: https://discordapp.com/oauth2/authorize?client_id=376292306233458688&permissions=8&scope=bot");
    }

    if (command === "botinfo" || command === "info" || command === "botstatus" || command === "status") {
        let TextChannels = bot.channels.filter(e => e.type !== 'voice').size;
        let VoiceChannels = bot.channels.filter(e => e.type === 'voice').size;
        var infoembed = new Discord.RichEmbed()
            .setAuthor("Hi " + message.author.username.toString(), message.author.displayAvatarURL)
            .setTitle("info")
            .setColor(randomcolor)
            .setDescription(`this bot for music with volume control and fun`)
            .addField("Devloped by", `PK#1650`, inline = true)
            .addField("Try with", `${prefix}help`, inline = true)
            .addField("CPU", `${process.cpuUsage().user/1024} MHz`, inline = true)
            .addField("Ram", `${process.memoryUsage().rss/1024} kb`, inline = true)
            .addField("Total Guilds", `${bot.guilds.size}`, inline = true)
            .addField("Total Channels", `${bot.channels.size}`, inline = true)
            .addField("Total Text Channels", `${TextChannels}`, inline = true)
            .addField("Total Voice Channels", `${VoiceChannels}`, inline = true)
            .addField("Total Users", `${bot.users.size}`)
            .addField("support server", `[link](https://discord.gg/zFDvBay)`, inline = true)
            .addField("bot invite link", `[invite](https://discordapp.com/oauth2/authorize?client_id=376292306233458688&permissions=8&scope=bot)`, inline = true)
            .setThumbnail("https://media.discordapp.net/attachments/406099961730564107/407455733689483265/Untitled6.png?width=300&height=300")
            .setFooter("Developed by: PK#1650 ", "https://cdn.discordapp.com/attachments/399064303170224131/405585474988802058/videotogif_2018.01.24_10.14.40.gif")
            .addField("please give me vote", `[vote and invite link](https://discordbots.org/bot/376292306233458688)`, inline = true)
            .addField("help with donate", `[patreon](https://www.patreon.com/icw)`, inline = true)
            .setTimestamp();
        message.channel.send({ embed: infoembed });
    }

    if (command === "uptime") {
        var days = Math.floor(bot.uptime / 86400000000000);
        var hours = Math.floor(bot.uptime / 3600000);
        var minutes = Math.floor((bot.uptime % 3600000) / 60000);
        var seconds = Math.floor(((bot.uptime % 360000) % 60000) / 1000);
        const uptimeembed = new Discord.RichEmbed()
            .setColor(randomcolor)
            .addField('Uptime', `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        message.channel.send({ embed: uptimeembed });
    }

})

bot.on("message", async(message) => {
    const sstatus = (await db.ref(`bot/`).child('sstatus').once('value')).val();
    bot.user.setPresence({ status: `streaming`, game: { name: `${sstatus}`, type: `STREAMING`, url: `https://www.twitch.tv/pardeepsingh12365` } });

    if (message.author.bot) return undefined;
    const randomcolor = '0x' + Math.floor(Math.random() * 16777215).toString(16);

    if (message.channel.type == "dm" || message.channel.type == "group") return undefined;

    const gprefix = (await db
        .ref(`servers/${message.guild.id}`)
        .child('guildprefix')
        .once('value')).val();

    if (!message.content.startsWith(gprefix) && !message.content.startsWith(prefix)) return undefined;
    if (message.content.startsWith(gprefix)) {
        args = message.content.substring(gprefix.length + 1).split();
        comarg = message.content.slice(gprefix.length).trim().split(/ +/g);
    } else {
        args = message.content.substring(prefix.length + 1).split();
        comarg = message.content.slice(prefix.length).trim().split(/ +/g);
    }
    const command = comarg.shift().toLowerCase();

    if (command === "setstream" || command === "ss") {
        let arg2 = args.join().substring(command.length)
        firebase.database().ref(`bot/`).update({
            sstatus: arg2
        }).catch(function(err) {
            message.channel.send(err + "\n\n\n");
        });
        message.channel.send(`Stream updated successfully ${arg2}`);
    }

    if (command === "ping") {
        let pingembed = new Discord.RichEmbed().setColor(randomcolor).addField("Pong! Websocket Latency:", `${bot.ping}`);
        message.channel.send({ embed: pingembed })
    }

    if (command === "restart") {
        if (message.author.id !== botowner) {
            message.reply('this command is only for bot owner!!!');
            return;
        }
        message.channel.send("bot restarting");
        process.exit()
    }

    if (command === "help") {
        let helpembed = new Discord.RichEmbed()
            .setColor(randomcolor)
            .setAuthor("Hi " + message.author.username.toString(), message.author.displayAvatarURL)
            .setDescription(`ICW help Section \nDefault Prefix = ${prefix} \nvolume command is for all users \nmore commands coming soon`)
            .addField("Custom Prefix", `setprefix - (for set the custom prefix for server) \nprefix - (for check the server prefix)`)
            .addField("Bot info commands", `ping - (bot ping) \ninvite - (bot invite link)\nbotinfo - (info about the bot)\`\`info , botstatus\`\` \nuptime - (uptime of the bot)\nservers - (bots servers)`)
            .addField("until commands", `cleverbot - (talk with bot with mention or icw \`\`example - icw hi\`\`) \`\`icw\`\` \ngoogle - (search anything) \`\`gsearch , g , \`\` \nweather - (check your city weather) \nsay - (bot saying your message) \ndiscrim - (found any discriminators) \nserverinfo - (info about server)`)
            .addField("Modration command", ` welcome - (welcoming the member) \n purge (delete multiple messages) \`\`delete\`\`, \`\`prune\`\` \n warn - (for warning a member) \n kick - (for kick a member) \n ban - (for ban a member)`)
            .addField("Music commands", `play - (for serach and add your song in thre queue) \`\`p\`\` \npause - (pause the player) \nresume - (resume the player) \nvolume - (set your player volume) \`\`sv , setvolume\`\` \nskip - (for next song) \`\`s , next\`\` \nprev - (for previos song) \nstop - (for stop the player) \nqueue - (for check playlist) \`\`q , playlist\`\` \nsong - (view current song) \`\`np , nowplaying\`\` \nrandom - (playing randomly)`)
            .setThumbnail("https://media.discordapp.net/attachments/406099961730564107/407455733689483265/Untitled6.png?width=300&height=300")
            .setFooter("Bot Developed by: PK#1650 ", "https://cdn.discordapp.com/attachments/399064303170224131/405585474988802058/videotogif_2018.01.24_10.14.40.gif")
            .addField("if you find any bug plz report it with command", `bugreport - (report for any bugs or problams) \`\`bug\`\``)
            .addField("support server", `[link](https://discord.gg/zFDvBay)`, inline = true)
            .addField("bot invite link", `[invite](https://discordapp.com/oauth2/authorize?client_id=376292306233458688&permissions=8&scope=bot)`, inline = true)
            .addField("please give upvote", `[vote and invite link](https://discordbots.org/bot/376292306233458688)`, inline = true)
            .addField("help with donate", `[patreon](https://www.patreon.com/icw)`, inline = true)
            .setTimestamp();
        message.author.send({ embed: helpembed });
        message.channel.send("check your dms", { replay: message });
    }

    if (command === "say") {
        let ch = message.mentions.channels.first()
        message.delete().catch(err => bot.channels.get(botrejectionschannel).send(`${message.author.username} from ${message.guild.name} using say command \n${err}`))
        if (!ch) {
            message.channel.send(args.join("").substring(3));
        } else {
            ch.send(args.join("").replace(ch, "").substring(3));
        }
    }

    if (command === "bugreport" || command === "bug") {
        let args2 = args.join("").substring(command.length);
        if (!args2) return message.channel.send(`***plz add a bug message after command***`);
        message.channel.send(`***Report sented succesfully thank you***`);
        bot.channels.get(botbuglogchannel).send(`report by: **${message.author.tag}** from: **${message.guild.name}** (${message.guild.id}) \nbug: ${args2}`);
    }

    if (command === "servers") {
        let guilds = bot.guilds.map((guild) => `**${guild.name}** members: ${guild.members.size} id: (${guild.id})`);
        message.channel.send(`I'm in the **${bot.guilds.size} guilds**:\n${guilds.join ('\n')}`, { split: "\n" })
    }

    if (command === "weather") {
        var cityname = args.join("").substring(7);
        var http = require('http');
        request({
            url: 'http://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&APPID=' + owmkey
        }, (error, response, body) => {
            if (error) return;
            var data = JSON.parse(body);
            if (data.cod == "404") {
                message.channel.send(data.message);
                return;
            }
            var weather_main = parseFloat(data.main.temp) - 273.15;
            var temp_max = parseFloat(data.main.temp_max) - 273.15;
            var temp_min = parseFloat(data.main.temp_min) - 273.15;
            const embed = new Discord.RichEmbed()
                .setTitle(data.name + ',' + data.sys.country)
                .setAuthor("ICW weather info", "https://cdn.discordapp.com/attachments/398789265900830760/405592021579989003/videotogif_2018.01.24_10.46.57.gif")
                .setColor(randomcolor)
                .setDescription(data.weather[0].description)
                .setThumbnail("http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
                .setURL("https://openweathermap.org/city/" + data.name)
                .addField("main", weather_main + " c", true)
                .addField("pressure", data.main.pressure + " Hpz", true)
                .addField("wind", data.wind.speed + " mph" + "/ Direction" + data.wind.deg, true)
                .addField("visibility", data.visibility, true)
                .setFooter("Requested by " + message.author.username.toString(), message.author.displayAvatarURL)
                .setTimestamp();
            message.channel.send({ embed });
        });
    }

    if (command == "gsearch" || command === "google" || command === "g") {
        let args3 = args.join("").substring(command.length);
        let searchMessage = await message.reply('Searching... Sec.');
        let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(args3)}`;
        return snekfetch.get(searchUrl).then((result) => {
            let $ = cheerio.load(result.text);
            let googleData = $('.r').first().find('a').first().attr('href');
            googleData = querystring.parse(googleData.replace('/url?', ''));
            searchMessage.edit(`Result found!\n${googleData.q}`);
        }).catch((err) => {
            bot.channels.get(botrejectionschannel).send(`${message.author.username} from ${message.guild.id} using google command \n${err}`)
            searchMessage.edit('No results found!');
        });
    }

    if (command === "discrim") {
        const discrim = args.join("").substring(7);
        if (!discrim) return message.reply("oops! I could not find the discriminator that you had given.");
        if (typeof discrim !== 'integer')
            if (discrim.size < 4) return message.reply("Don't you know that discrims are 4 numbers? -.-");
        if (discrim.size > 4) return message.reply("Don't you know that discrims are 4 numbers? -.-");
        let members = bot.users.filter(c => c.discriminator === discrim).map(c => c.username).join(`\n`);
        if (!members) return message.reply("404 | No members have that discriminator!");
        message.channel.send(`\`\`\`ICW Discrim Finder\nI found these discriminators.\n\n${members}#${discrim}\`\`\``, { split: "\n" });
    }

    if (command === "invite") {
        message.channel.send("Invite URL: https://discordapp.com/oauth2/authorize?client_id=376292306233458688&permissions=8&scope=bot");
    }

    if (command === "botinfo" || command === "info" || command === "botstatus" || command === "status") {
        let TextChannels = bot.channels.filter(e => e.type !== 'voice').size;
        let VoiceChannels = bot.channels.filter(e => e.type === 'voice').size;
        var infoembed = new Discord.RichEmbed()
            .setAuthor("Hi " + message.author.username.toString(), message.author.displayAvatarURL)
            .setTitle("info")
            .setColor(randomcolor)
            .setDescription(`this bot for music with volume control and fun`)
            .addField("Devloped by", `PK#1650`, inline = true)
            .addField("Try with", `${prefix}help`, inline = true)
            .addField("CPU", `${process.cpuUsage().user/1024} MHz`, inline = true)
            .addField("Ram", `${process.memoryUsage().rss/1024} kb`, inline = true)
            .addField("Total Guilds", `${bot.guilds.size}`, inline = true)
            .addField("Total Channels", `${bot.channels.size}`, inline = true)
            .addField("Total Text Channels", `${TextChannels}`, inline = true)
            .addField("Total Voice Channels", `${VoiceChannels}`, inline = true)
            .addField("Total Users", `${bot.users.size}`)
            .addField("support server", `[link](https://discord.gg/zFDvBay)`, inline = true)
            .addField("bot invite link", `[invite](https://discordapp.com/oauth2/authorize?client_id=376292306233458688&permissions=8&scope=bot)`, inline = true)
            .setThumbnail("https://media.discordapp.net/attachments/406099961730564107/407455733689483265/Untitled6.png?width=300&height=300")
            .setFooter("Developed by: PK#1650 ", "https://cdn.discordapp.com/attachments/399064303170224131/405585474988802058/videotogif_2018.01.24_10.14.40.gif")
            .addField("please give me vote", `[vote and invite link](https://discordbots.org/bot/376292306233458688)`, inline = true)
            .addField("help with donate", `[patreon](https://www.patreon.com/icw)`, inline = true)
            .setTimestamp();
        message.channel.send({ embed: infoembed });
    }

    if (command === "uptime") {
        var days = Math.floor(bot.uptime / 86400000000000);
        var hours = Math.floor(bot.uptime / 3600000);
        var minutes = Math.floor((bot.uptime % 3600000) / 60000);
        var seconds = Math.floor(((bot.uptime % 360000) % 60000) / 1000);
        const uptimeembed = new Discord.RichEmbed()
            .setColor(randomcolor)
            .addField('Uptime', `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        message.channel.send({ embed: uptimeembed });
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------

    if (command === "purge" || command === "prune" || command === "delete" || command === "clear") {
        let args2 = args.join("").substring(command.length);
        if (!message.guild.member(bot.user).hasPermission("MANAGE_MESSAGES")) return message.channel.send(`I don't have permission to do that give me manage message permission`);
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Incorrect permissions (You need the manage messages permissions to do this)");
        if (!args2 || args2 < 2 || args2 > 99 || isNaN(args2)) return message.reply(`Please provide a number after command between 2 and 99 for delete the messages like \`\`${prefix}purge 5\`\``);
        const fetched = await message.channel.fetchMessages({ limit: args2 + 1 });
        message.channel.bulkDelete(fetched).catch(function(error) { message.reply(`Couldn't delete messages because of: ${error}`); });
        message.channel.send(`***${args2} messages deleted successfully by ${message.author.tag} with purge command***`).then(msg => msg.delete(3000));;
    }

    if (command === "prefix") {
        if (gprefix === null) {
            return message.channel.send(`Any custom prefix not found for this server plz take a command \`\`${prefix}setprefix\`\` for set the server custom prefix`)
        } else {
            message.channel.send(`The current prefix is ${gprefix} of ${message.guild.name}`);
        }
    }

    if (command === "setprefix") {
        if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
        let arg = args.join("").substring(command.length)
        if (!arg) return message.channel.send(`Please add a prefix after command like \`\`${prefix}setprefix &\`\``);
        firebase.database().ref('servers/' + message.guild.id).update({
            guildname: message.guild.name,
            guildprefix: arg
        }).catch(function(err) {
            message.channel.send(err + "\n\n\n");
        });
        message.channel.send(`prefix updated ${arg} for ${message.guild.name}`);
    }

    const wchannelid = (await db.ref(`servers/${message.guild.id}`).child('wchannelid').once('value')).val();
    const wtextonoff = (await db.ref(`servers/${message.guild.id}`).child('wtextonoff').once('value')).val();
    const wleavetextonoff = (await db.ref(`servers/${message.guild.id}`).child('wleavetextonoff').once('value')).val();
    const wimageonoff = (await db.ref(`servers/${message.guild.id}`).child('wimageonoff').once('value')).val();
    const wuinfoonoff = (await db.ref(`servers/${message.guild.id}`).child('wuinfoonoff').once('value')).val();
    const welcomeMstatus = (await db.ref(`servers/${message.guild.id}`).child('welcomeMstatus').once('value')).val();
    const wm = (await db.ref(`servers/${message.guild.id}`).child('wmessage').once('value')).val();
    if (command === "welcome") {
        let arg = args.join().substring(command.length);
        let ar = arg.slice().trim().split(/ +/g);
        let c = ar.shift().toLowerCase();
        if (c === "on") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            firebase.database().ref('servers/' + message.guild.id).update({
                welcomeMstatus: "on",
                wimageonoff: "on",
                wtextonoff: "on",
                wuinfoonoff: "on"
            }).catch(function(err) {
                message.channel.send(err + "\n\n\n");
            });
            message.channel.send(`welcome message turned **on** for ${message.guild.name} server`)
        } else if (c === "off") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            firebase.database().ref('servers/' + message.guild.id).update({
                welcomeMstatus: "off"
            }).catch(function(err) {
                message.channel.send(err + "\n\n\n");
            });
            message.channel.send(`welcome message turned **off** for ${message.guild.name} server`)
        } else if (c === "use-jointext") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            if (wchannelid === null) return message.channel.send(`welcome channel not set please set the channel first with \`\`${prefix}welcome set-channel <#channel>\`\``)
            if (!wtextonoff) {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wtextonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome join text is now enabled");
            }
            if (wtextonoff === "on") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wtextonoff: "off"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome join text is now disabled");
            }
            if (wtextonoff === "off") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wtextonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome join text is now enabled");
            }
        } else if (c === "use-leavetext") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            if (wchannelid === null) return message.channel.send(`welcome channel not set please set the channel first with \`\`${prefix}welcome set-channel <#channel>\`\``)
            if (!wleavetextonoff) {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wleavetextonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("leave text is now enabled");
            }
            if (wleavetextonoff === "on") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wleavetextonoff: "off"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("leave text is now disabled");
            }
            if (wleavetextonoff === "off") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wleavetextonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("leave text is now enabled");
            }
        } else if (c === "use-image") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            if (wchannelid === null) return message.channel.send(`welcome channel not set please set the channel first with \`\`${prefix}welcome set-channel <#channel>\`\``);
            if (!wimageonoff) {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wimageonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome image is now enabled");
            }
            if (wimageonoff === "on") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wimageonoff: "off"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome image is now disabled");
            }
            if (wimageonoff === "off") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wimageonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome image is now enabled");
            }
        } else if (c === "use-userinfo") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            if (wchannelid === null) return message.channel.send(`welcome channel not set please set the channel first with \`\`${prefix}welcome set-channel <#channel>\`\``)
            if (!wuinfoonoff) {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wuinfoonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome userinfo is now enabled");
            }
            if (wuinfoonoff === "on") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wuinfoonoff: "off"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome userinfo is now disabled");
            }
            if (wuinfoonoff === "off") {
                firebase.database().ref('servers/' + message.guild.id).update({
                    wuinfoonoff: "on"
                }).catch(function(err) {
                    message.channel.send(err + "\n\n\n");
                });
                message.channel.send("welcome userinfo is now enabled");
            }
        } else if (c === "set-joinmessage") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            if (wchannelid === null) return message.channel.send(`welcome channel not set please set the channel first with \`\`${prefix}welcome set-channel <#channel>\`\``);
            let arg2 = arg.substring(c.length)
            if (!arg2) return message.channel.send(`please add a welcome message after command like \n\`\`{user} welcome to the ${message.guild.name} server now we have {members} members\`\` \n{user} is welcome member \n{members} is total members of server`)
            firebase.database().ref('servers/' + message.guild.id).update({
                wmessage: arg2
            }).catch(function(err) {
                message.channel.send(err + "\n\n\n");
            });
            message.channel.send(`welcome message set successfully \n${arg2}`)
        } else if (c === "set-leavemessage") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`);
            if (wchannelid === null) return message.channel.send(`welcome channel not set please set the channel first with \`\`${prefix}welcome set-channel <#channel>\`\``);
            let arg2 = arg.substring(c.length)
            if (!arg2) return message.channel.send(`please add a leave message after command like \n\`\`{user} user is left the server now we are {members} members\`\` \n{user} is welcome member \n{members} is total members of server`)
            firebase.database().ref('servers/' + message.guild.id).update({
                lmessage: arg2
            }).catch(function(err) {
                message.channel.send(err + "\n\n\n");
            });
            message.channel.send(`leave message set successfully \n${arg2}`)
        } else if (c === "set-channel") {
            if (message.author.id !== botowner && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`U don't have permission to do that`)
            let wc = message.mentions.channels.first()
            if (!wc) return message.channel.send(`please mention a channel after command like \`\`${prefix}setwelcomechannel #general\`\``)
            firebase.database().ref('servers/' + message.guild.id).update({
                wchannelid: wc.id
            }).catch(function(err) {
                message.channel.send(err + "\n\n\n");
            });
            message.channel.send(`welcome channel set succesfully ${wc.name} for ${message.guild.name} server`)
        } else if (c === "jointest") {
            let member = message.mentions.members.first()
            if (!member) return message.channel.send(`Please mentions someone like \`\`${prefix}welcome jointest <@${message.author.tag}>\`\``);
            const fn = Math.floor(Math.random() * wfortunes.length);
            const fact = `${wfortunes[fn]}`;
            const fact2 = `${fact.replace('{user}', member.user.username)}`
            const rn = Math.floor(Math.random() * wimages.length);
            const images = `${wimages[rn]}`;
            let u = `you are the ${member.guild.memberCount}${ord(member.guild.memberCount)} user`;
            let s = member.guild.name;
            let img = member.user.displayAvatarURL;
            if (wm === null) {
                message.channel.send(`${member} welcome to ${member.guild.name} you are the ${member.guild.memberCount}${ord(member.guild.memberCount)} user`);
            } else {
                message.channel.send(wm.replace('{user}', member.toString()).replace('{members}', member.guild.memberCount));
            }
            Jimp.read(`https://cloud.githubusercontent.com/assets/414918/11165709/051d10b0-8b0f-11e5-864a-20ef0bada8d6.png`).then(function(mask) {
                Jimp.read(img).then(function(image) {
                    Jimp.read(images).then(function(image2) {
                        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(function(font) {
                            image2.print(font, 121, 57, s);
                            image2.print(font, 103, 79, u);
                            image2.print(font, 103, 57, "to");
                            image2.print(font, 11, 101, fact2)
                            image2.print(font, 103, 4, "Welcome");
                            Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function(font) {
                                image2.print(font, 120, 56, s);
                                image2.print(font, 102, 56, "to")
                                image2.print(font, 10, 100, fact2)
                                image2.print(font, 102, 78, u);
                                image2.print(font, 102, 3, "Welcome");
                                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function(font) {
                                    image2.print(font, 104, 20, member.user.tag);
                                    Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function(font) {
                                        image2.print(font, 102, 18, member.user.tag)
                                        image2.resize(400, 120);
                                        image.resize(90, 90);
                                        mask.resize(90, 90);
                                        image.mask(mask, 0, 0);
                                        image2.composite(image, 5, 5);
                                        image2.getBuffer(Jimp.MIME_PNG,
                                            (error, buffer) => { message.channel.send({ files: [{ name: 'welcome.png', attachment: buffer }] }); });
                                    });
                                });
                            });
                        });
                    });
                })
            });
        } else {
            if (wchannelid === null) { wchannel = "Not Set" } else { wchannel = `<#${wchannelid}>` }
            message.channel.send(`:wave: **ICW WELCOME**
            \n:black_square_button: | \`\`on/off\`\` welcome switch
            \n:black_square_button: | \`\`use-image\`\` switch of welcome image
            \n:black_square_button: | \`\`use-jointext\`\` switch of user join text
            \n:black_square_button: | \`\`use-leavetext\`\` switch of user leave text
            \n:black_square_button: | \`\`use-userinfo\`\` switch of userinfo (if user is owner of 200+ members server)
            \n:black_square_button: | \`\`set-joinmessage <message>\`\` set join message for welcome
            \n:black_square_button: | \`\`set-leavemessage <message>\`\` set leave message
            \n:black_square_button: | \`\`set-channel <#channel>\`\` set channel for welcome
            \n:black_square_button: | \`\`jointest <@${message.author.tag}>\`\` test the welcome
            \n\n:black_square_button: | welcome main switch is **${welcomeMstatus}**
            \n:black_square_button: | welcome channel is **${wchannel}**
            \n:black_square_button: | welcome join text switch is **${wtextonoff}**
            \n:black_square_button: | welcome leave text switch is **${wleavetextonoff}**
            \n:black_square_button: | welcome userinfo text switch is **${wuinfoonoff}**
            \n:black_square_button: | welcome image switch is **${wimageonoff}**
            `)
        }
    }
/*
    if (command === "warn") {
        let warnUser = message.mentions.members.first();
        if (!warnUser) return message.channel.send(`Specify a user to warn`);
        let args2 = message.content.substring(prefix.length + command.length).split(`<@${warnUser.user.id}>`);
        let reason = args2.join(" ").substring(3);
        if (!reason) return message.channel.send("You did not give a reason to warn the user.");
        if (!warnUser.id == message.author.id) return message.channel.send("You cannot warn yourself/!");
        message.delete().catch(err => bot.channels.get(botrejectionschannel).send(`${message.author.username} from ${message.guild.name} using warn command \n${err}`))
        warnUser.send(`**you have been warned from** ${message.guild}. \n**Reason**: ${reason}`).catch(err => {});
        message.channel.send(`***${warnUser.user.tag} has been warned***`)

    }

    if (command === "kick") {
        if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) return message.channel.send(`I don't have permission to do that`);
        if (message.author.id !== botowner && !message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`U don't have permission to do that`);
        let kickUser = message.mentions.members.first();
        if (!kickUser) return message.channel.send(`Specify a user to kick`);
        let args2 = message.content.substring(prefix.length + command.length).split(`<@${kickUser.user.id}>`);
        let reason = args2.join(" ").substring(3);
        if (!reason) return message.channel.send("You did not give a reason to kick the user.")
        if (!kickUser.id == message.author.id) return message.channel.send("You cannot kick yourself/!");
        if (!kickUser.kickable) return message.channel.send("my role is either the same or lower than the user you wish to kick.");
        kickUser.send(`**You have been kicked from** ${message.guild}. \n**Reason**: ${reason}`).catch(err => {});
        try {
            message.guild.member(kickUser).kick();
            var kickembed = new Discord.RichEmbed()
                .setColor(randomcolor)
                .setAuthor("Action by : " + message.author.username.toString(), message.author.displayAvatarURL)
                .setDescription(`**Action**: Kick \n**Mamber**: ${kickUser.user.tag} (${kickUser.id}) \n**Reason**: ${reason}`)
                .setTimestamp();
            message.channel.send({ embed: kickembed });
        } catch (err) {
            message.channel.send(`I failed to kick the user... Reason: ${err}e`);
        }
    }

    if (command === "ban") {
        if (!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) return message.channel.send(`I don't have permission to do that`);
        if (message.author.id !== botowner && !message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`You don't have permission to do that`);
        let banUser = message.mentions.members.first();
        if (!banUser) return message.channel.send(`Specify a user to ban`);
        let args2 = message.content.substring(prefix.length + command.length).split(`<@${banUser.user.id}>`);
        let reason = args2.join(" ").substring(3);
        if (!reason) return message.channel.send("You did not give a reason to ban the user.")
        if (!banUser.id == message.author.id) return message.channel.send("You cannot ban yourself/!");
        if (!banUser.bannable) return message.channel.send("my role is either the same or lower than the user you wish to ban.");
        banUser.send(`**You have been baned from** ${message.guild}. \n**Reason**: ${reason}`).catch(err => {});
        try {
            message.guild.member(banUser).ban();
            var banembed = new Discord.RichEmbed()
                .setColor(randomcolor)
                .setAuthor("Action by : " + message.author.username.toString(), message.author.displayAvatarURL)
                .setDescription(`**Action**: ban \n**Mamber**: ${banUser.user.tag} (${banUser.id}) \n**Reason**: ${reason}`)
                .setTimestamp();
            message.channel.send({ embed: banembed });
        } catch (err) {
            message.channel.send(`I failed to ban the user... Reason: ${err}`);
        }
    }

    if (command === "serverinfo") {
        let guildTchannels = message.guild.channels.filter(e => e.type !== 'voice').size;
        let guildVchannels = message.guild.channels.filter(e => e.type === 'voice').size;
        let serverowner = message.guild.owner.user.tag;
        let serverownerid = message.guild.owner.id;
        let servermembers = message.guild.memberCount;
        let serveronlinemembers = message.guild.members.filter(m => m.user.presence.status !== "offline").size;
        let serveroflinemembers = message.guild.members.filter(m => m.user.presence.status === "offline").size;
        let serverroles = message.guild.roles.size;
        let serverregion = message.guild.region;
        let servercreatedat = message.guild.createdAt;
        let sicon = message.guild.iconURL == null ? "https://images-ext-1.discordapp.net/external/v1EV83IWPZ5tg7b5NJwfZO_drseYr7lSlVjCJ_-PncM/https/cdn.discordapp.com/icons/268683615632621568/168a880bdbc1cb0b0858f969b2247aa3.jpg?width=80&height=80" : message.guild.iconURL;
        var serverinfoembed = new Discord.RichEmbed()
            .setAuthor(message.guild.name + "info", sicon)
            .setColor(randomcolor)
            .setDescription(`Since: ${servercreatedat}`)
            .addField("Server Owner:", `${serverowner}`, inline = true)
            .addField("Owner id:", `${serverownerid}`, inline = true)
            .addField("Members:", `${serveronlinemembers}/${servermembers}`, inline = true)
            .addField("Totel Roles:", `${serverroles}`, inline = true)
            .addField("Text channel:", `${guildTchannels}`, inline = true)
            .addField("Voice channels:", `${guildVchannels}`, inline = true)
            .addField("Server Region:", `${serverregion}`)
            .setThumbnail(sicon)
            .setFooter("Bot Developed by: PK#1650 ", "https://cdn.discordapp.com/attachments/399064303170224131/405585474988802058/videotogif_2018.01.24_10.14.40.gif")
            .setTimestamp();
        message.channel.send({ embed: serverinfoembed });
    }*/
});
const randomcolor = '0x' + Math.floor(Math.random() * 16777215).toString(16);

bot.on("error", function(err) {
    bot.channels.get(boterrorchannel).send(err);
});
