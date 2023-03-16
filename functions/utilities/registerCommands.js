// require("../../requires")

module.exports = {
    name: "registerCommands",
    async function(global, guild){
        return new Promise(resolve => {
            const { REST } = require('@discordjs/rest');
            const { Routes } = require('discord-api-types/v10');

            const token = mainconfig.token

            const commandsList = []


            var commandstopush = "| "
            commands.forEach(element => {
                if(element.slashcommand != undefined){

                    if(global){
                        if(element.slashcommandGlobal){
                            commandstopush += `${element.name} | `
                            commandsList.push(element.slashcommand)
                        }
                    }else{
                        commandstopush += `${element.name} | `
                        commandsList.push(element.slashcommand)
                    }
                    // commandsList.push(element.slashcommand)
                }
            });
            console.log(commandstopush);

            const rest = new REST({ version: '10' }).setToken(token);

            const clientId = client.user.id;
            const guildId  = '976160478432735272';

            (async () => {
                try {
                    if(!global){
                        await rest.put(
                            Routes.applicationGuildCommands(clientId, guildId),
                            { body: commandsList },
                        );
                    }else{
                        if(guild == undefined){
                            await rest.put(
                                Routes.applicationCommands(clientId),
                                { body: commandsList },
                            );
                        }else{
                            await rest.put(
                                Routes.applicationGuildCommands(clientId, guild.id),
                                { body: commandsList },
                            );
                        }
                    }
                    console.log('Successfully registered application commands.');
                    resolve()
                } catch (error) {
                    console.error(error);
                    resolve()
                }
            })();
        })
    }
}