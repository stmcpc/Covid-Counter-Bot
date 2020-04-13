// Call on the Discord API
const { config } = require("dotenv");
const Discord = require("discord.js");
var axios = require('axios');

// Declares our bot,
// the disableEveryone prevents the client to ping @everyone
const client = new Discord.Client({
    disableEveryone: true
});

config({
    path: __dirname + "/.env"
})

// When the bot's online, what's in these brackets will be executed
client.on("ready", () => {
    console.log(`${client.user.username} is now online.`);

    // Set the user presence
    client.user.setActivity('case counts rise, !cc help', { type: 'WATCHING' });

})

// When a message comes in, what's in these brackets will be executed
client.on("message", async message => {
    const prefix = "!cc";
    // If the author's a bot, return
    // If the message was not sent in a server, return
    // If the message doesn't start with the prefix, return
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    // Website where I retrieve (not steal, totally) data from
    const url = "https://www.worldometers.info/coronavirus/";

    // If the player types !cc stats with nothing afterward    
    if (cmd == "stats" && args[0] == undefined) {
        // Call on our hero axios to make a sick HTTP request to that website we looked at just above.
        axios.get(url).then(function (response) {
            // We scan through the response axios gave us, and find the part where it lists case counts. The response given is the entire source code of the website.
            const substring = response.data.substring(
                response.data.search("<h1>Coronavirus Cases:</h1>"), 
                response.data.search('<div style="margin-top:50px;"></div>')
            ).replace(/\s/g, ''); //Removes all spaces in the text, makes it easier to parse

            // Find the part with confirmed cases. Read up on substrings and searching functions in JavaScript for more information.
            const confirmed_cases = substring.substring(
                substring.search('<spanstyle="color:#aaa">') + '<spanstyle="color:#aaa">'.length,
                substring.search('</span>')
            )

            // Find the part with deaths.
            const deaths = substring.substring(
                substring.search('<h1>Deaths:</h1><divclass="maincounter-number"><span>') + '<h1>Deaths:</h1><divclass="maincounter-number"><span>'.length,
                substring.search('</span></div></div><divid="maincounter-wrap"style="margin-top:15px;">')
            );
            
            // Find the part with recoveries.
            const recoveries = substring.substring(
                substring.search('"color:#8ACA2B"><span>') + '"color:#8ACA2B"><span>'.length,
                substring.length - 19
            );
            
            // Embed we are gonna send to the user
            const gameMessage = {
                color: 0x1c73ff,
                title: 'Coronavirus (COVID-19): Worldwide',
                description: "Source: Worldometer",
                fields: [
                    {
                        name: 'Confirmed Cases',
                        value: confirmed_cases,
                    },
                    {
                        name: 'Deaths',
                        value: deaths,
                    },
                    {
                        name: 'Recoveries',
                        value: recoveries, 
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: "Bot created by Eric Zhang.",
                },
            };

            message.channel.send({ embed: gameMessage })
        }).catch(function (error) {
            // If something goes wrong.
            message.channel.send("Oops, I got an error.")
        });
    }
    // If the user specifies a country
    else if (cmd == "stats" && args[0] != undefined) {
        // We add /country/countryname to the URL of the website to steal, I mean, borrow their data.
        axios.get(url+"/country/"+args[0]).then(function (response) {
            // Includes the name of the country and flag this time around.
            const countrySubstring = response.data.substring(
                response.data.search('<div style="display:inline">'), 
                response.data.search('<div style="margin-top:50px;"></div>') + '<div style="margin-top:50px;"></div>'.length
            )
            
            // Same as the previous substring
            const substring = countrySubstring.substring(
                countrySubstring.search("<h1>Coronavirus Cases:</h1>"), 
                countrySubstring.search('<div style="margin-top:50px;"></div>')
            ).replace(/\s/g, ''); //Removes all spaces in the text, makes it easier to parse
            
            // Find the country name
            const country = countrySubstring.substring(
                countrySubstring.search('solid #aaa" /></div>&nbsp;') + 'solid #aaa" /></div>&nbsp;'.length,
                countrySubstring.search("</h1>")
            )
            
            // Find the flag
            const flag = countrySubstring.substring(
                countrySubstring.search('<img src="') + '<img src="'.length,
                countrySubstring.search('" width="60"')
            )

            // Find confirmed cases, deaths, etc
            const confirmed_cases = substring.substring(
                substring.search('<spanstyle="color:#aaa">') + '<spanstyle="color:#aaa">'.length,
                substring.search('</span>')
            )

            const deaths = substring.substring(
                substring.search('<h1>Deaths:</h1><divclass="maincounter-number"><span>') + '<h1>Deaths:</h1><divclass="maincounter-number"><span>'.length,
                substring.search('</span></div></div><divid="maincounter-wrap"style="margin-top:15px;">')
            );
            
            const recoveries = substring.substring(
                substring.search('"color:#8ACA2B"><span>') + '"color:#8ACA2B"><span>'.length,
                substring.length - 19
            );
            
            const gameMessage = {
                color: 0x1c73ff,
                title: 'Coronavirus (COVID-19): '+country,
                description: "Source: Worldometer",
                fields: [
                    {
                        name: 'Confirmed Cases',
                        value: confirmed_cases,
                    },
                    {
                        name: 'Deaths',
                        value: deaths,
                    },
                    {
                        name: 'Recoveries',
                        value: recoveries, 
                    }
                ],
                thumbnail: {
                    url: 'https://www.worldometers.info/'+flag
                },
                timestamp: new Date(),
                footer: {
                    text: "Bot created by Eric Zhang.",
                },
            };

            message.channel.send({ embed: gameMessage }).catch(function(error) {
                // If the user gives us a bad country code
                message.channel.send("Country or territory not found.")
            } )
        }).catch(function (error) {
            // If something goes wrong
            message.channel.send("Country or territory not found.")
        });
    }
    else if (cmd=="help") {
        // Self explanatory embed, nothing special.
        const gameMessage = {
            color: 0x1c73ff,
            title: 'Help',
            description: "Command: Type '!cc stats <countryname>' for coronavirus statistics. Leave the country name blank for a worldwide count.",
            fields: [
                {
                    name: 'Some country codes',
                    value: 'us = United States, holy-see = Vatican City',
                }
            ],
            timestamp: new Date(),
            footer: {
                text: "Bot created by Eric Zhang.",
            },
        };

        message.channel.send({ embed: gameMessage });
    }
})

client.login(process.env.TOKEN);