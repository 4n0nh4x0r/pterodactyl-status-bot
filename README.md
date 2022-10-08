
# Pterodactyl Status Bot

This discord bot allows you to have an interface between discord and your pterodactyl interface  
Its kept relatively basic and is planned to be expanded in the future


## How to use this

Clone the project

```bash
git clone https://github.com/4n0nh4x0r/pterodactyl-status-bot
```

Go to the project directory

```bash
cd pterodactyl-status-bot
```

Install dependencies

```bash
npm i
```

Edit Config
```json
{
    "token":        "Bot Token",        <-- enter your discord bot token here
    "ownerId":      [],
    "ignorelist":   [],
    "database":{                        <-- Database credentials and connection target
        "host":     "db Server Ip",
        "port":     "3306",
        "username": "pterobot",
        "password": "db User Password",
        "dbname":   "pterobot"
    },
    "panel":{                           <-- The panel information
        "allowRegistration":    true,
        "url":                  "Your pterodactyl URL",
        "applicationKey":       "Your admin application key",
        "useragent":            "pterobot"
    }
}
```
#### Bot Token
You need to create a bot application on discord and get the token for said bot to insert it here  
[Discord Developer Portal](https://discord.com/developers/applications)
#### Database
You can use the same database server as the one you use for the panel  
This bot however requires you to set up a second database which is very small in size and wont put any further strain on your server  
You will find the `pterobot.sql` file in the main directory, run this on the database Server  
Best practice here is to create a new user account for this database that will only need access to the new database with select, insert and update permissions, that way even if someone would get access, they couldnt really do any harm
#### Panel
Here you now add the information required to access the panel  
The url is the base url to reach your panel, for example `https://panel.example.com`  
Next you need to create an application key in your panel using the admin account `https://panel.example.com/admin/api/new`  
This key needs the permissions to `read & write` users, every other permission can be on either none or read only  
**ATTENTION :** This is **NOT** a client api key (You will need one of these later aswell though)


Start the bot

```bash
  npm run start
```

You will need to add the bot to one of your servers  
Make sure that the bot is added also with `applications.commands` as scope  
Next you type in `g/reload` or `gslashreload` into the console of your bot and hit enter (This will provision all the servers the bot is on with its slash commands (This can take a little while))  

Once the slash commands are available, you can now use the `/register` command with the client key parameter, here you enter a client key to your account that you want to link with the bot  
Once that is done and everything worked, the bot should reply with that the account was linked

After this, you can now use the slash commands the bot has to offer for managing your pterodactyl servers

## Commands
- `/list_servers` Shows a list of all your servers
- `/list_servers server_identifier` Shows details about the specified server
- `/power` Sends a specific power option to a specified server
- `/command` Sends a command to the console of a specified server