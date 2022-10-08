// require("../../requires")
// const Canvas = require("canvas");


// const { Chart } = require("chart.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "command",
    slashcommand:
        new SlashCommandBuilder()
        .setName("command")
        .setDescription("Send command to the server console")
        .addStringOption(option => option
            .setName("command")
            .setDescription("The action to perform on a user")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setRequired(true)
            .setName("server_identifier")
            .setDescription("The server to perform the action on")
        )
        .addStringOption(option => option
            .setName("visibility")
            .setDescription("Show the result only to yourself, or everyone in chat")
            .addChoices(
				{ name: 'public', value: '0' },
				{ name: 'private', value: '1' }
            )
        )

        ,
    slashcommandGlobal:true,
    async function(interactionObject) {
        let ephemeral = interactionObject.options.getString("visibility")
        let serverid  = interactionObject.options.getString("server_identifier")
        let command   = interactionObject.options.getString("command")
        if(ephemeral == undefined){
            ephemeral = true
        }else{
            if(ephemeral == "1"){
                ephemeral = true
            }else{
                ephemeral = false
            }
        }
        await interactionObject.deferReply({ephemeral:ephemeral})


        if(!await commands.get("profile_handler").function(interactionObject)){
            interactionObject.editReply("You need to have an account in order to use this command, please register first")
            return
        }

        
        fetch(`${config.panel.url}/api/client/servers/${serverid}/command`,{
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await commands.get("profile_handler").getKey(interactionObject)}`,
                'User-Agent': `${config.panel.useragent}`,
            },
            "body": JSON.stringify({
                "command": `${command}`
            })
        })
        .then(async response => {
            // console.log(response);
            var message = {
                embeds:[{
                    color: `#F7A8B8`,
                    description: `Server has received the command \`${command}\``
                }]
            }
            switch(response.status){
                case 204:
                    // change nothing
                    break;
                case 404:
                    message.embeds[0].description = `You do not seem to have permissions to perform this action on the specified server`
                    break
                case 502:
                    message.embeds[0].description = `The server must be running in order for the command to be passed to it`
                    break
                default:
                    message.embeds[0].description = `Unknown error, please try again\nIf the issue persists, contact your server administrator\nResponse Code : ${response.status}`
                    break;
            }


            interactionObject.editReply(message)
        })
        .catch(err => console.error(err));
    }
}