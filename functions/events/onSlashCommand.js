const included = require("../../requires")


module.exports = {
    name:"onSlashCommand",
    event:true,
    async function(interaction){
        // console.log(interaction)
        if(commands.get(interaction.commandName)){
            // interaction.reply("a", {ephermal:true})
            commands.get(interaction.commandName).function(interaction)
        }
    }
}