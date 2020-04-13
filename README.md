# Covid Counter Bot

Created 13 April 2020 by Eric Zhang for the STMC Programming Club.

This is a quick Discord bot I made for my school's Progamming Club that sends messages providing the coronavirus cases for any territory listed on https://www.worldometers.info/, as well as global case counts.

# How it works
The bot uses axios to open an HTTP request to https://www.worldometers.info/ and then parses the HTML response with various string manipulation methods built into JavaScript. The bot then sends an embed to the Discord channel where the data was requested. In other words, structuring the data on a web page for the user's convenience.
