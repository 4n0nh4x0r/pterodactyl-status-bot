// require("../../requires")

const { PartialGroupDMChannel } = require("discord.js");

// Here you can add functions that will be run at each startup of the bot

module.exports = {
    name:"Startup_function",
    async function(msg, args){
        setTimeout(async () => {

            console.log("-------------------------------- Startup Function ------------------------------");
            // await commands.get("registerCommands").function(false)
            // plogger.info("Startup done")
            // commands.get("garbage_collector").function()
            console.log("--------------------------------------------------------------------------------");
        }, 500);
    }
}