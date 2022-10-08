// require("../../requires")
// const Canvas = require("canvas");


// const { Chart } = require("chart.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "power",
    slashcommand:
        new SlashCommandBuilder()
        .setName("power")
        .setDescription("Send power options to the server")
        .addStringOption(option => option
            .setName("action")
            .setDescription("The action to perform on the server")
            .setRequired(true)
            .addChoices(
				{ name: 'start',    value: 'start'  },
				{ name: 'restart',  value: 'restart'},
				{ name: 'stop',     value: 'stop'   },
				{ name: 'kill',     value: 'kill'   }
            )
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
        let action    = interactionObject.options.getString("action")
        let serverid  = interactionObject.options.getString("server_identifier")
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


        switch(action){
            case "start":
            case "restart":
            case "stop":
            case "kill":
                break;

            default:
                interactionObject.editReply("You somehow managed to supply an invalid power option, please dont try to break this system, thanks")
                return;
        }

        fetch(`${config.panel.url}/api/client/servers/${serverid}/power`,{
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await commands.get("profile_handler").getKey(interactionObject)}`,
                'User-Agent': `${config.panel.useragent}`,
            },
            "body": JSON.stringify({
                "signal": `${action}`
            })
        })
        .then(async response => {
            // console.log(response);
            var message = {
                embeds:[{
                    color: `#F7A8B8`,
                    description: `Server has received \`${action}\` power option`
                }]
            }
            switch(response.status){
                case 204:
                    // message.embeds[0].title
                    break;
                case 404:
                    message.embeds[0].description = `You do not seem to have permissions to perform this action on the specified server`
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