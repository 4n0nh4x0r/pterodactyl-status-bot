// const included = require(`../../requires`)

/*

                    DO NOT FORGET TO ADD EVERY SINGLE EVENT ADDED HERE TO THE REMOVELISTENER ARRAY

*/

client.removeAllListeners("interactionCreate")

client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()){
        commands.get("onSlashCommand").function(interaction)
    }
})