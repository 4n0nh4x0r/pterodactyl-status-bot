// require("../../requires")
// const Canvas = require("canvas");


// const { Chart } = require("chart.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "list_servers",
    slashcommand:
        new SlashCommandBuilder()
        .setName("list_servers")
        .setDescription("List my servers")
        .addStringOption(option => option
            .setName("server_identifier")
            .setDescription("To get details on a server, you need to supply the server's identifier (ex : )")
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
    slashcommandGlobal:false,
    async function(interactionObject) {
        let ephemeral = interactionObject.options.getString("visibility")
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

        if(serverid != undefined){
            if(serverid.length != 8){
                interactionObject.editReply("The server id you supplied is incorrect")
                return
            }



            fetch(`${config.panel.url}/api/client/servers/${serverid}`,{
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${await commands.get("profile_handler").getKey(interactionObject)}`,
                    'User-Agent': `${config.panel.useragent}`,
                }
            })
            .then(async response => {
                response = await response.json()

                var response2 = await fetch(`${config.panel.url}/api/client/servers/${serverid}/resources`,{
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${await commands.get("profile_handler").getKey(interactionObject)}`,
                        'User-Agent': `${config.panel.useragent}`,
                    }
                })

                var response2 = await response2.json()
                var resources = response2.attributes.resources

                var serverStatus
                switch(response2.attributes.current_state){
                    case "running": serverStatus = "Running 🟢"; break;
                    case "starting": serverStatus = "Starting 🟡"; break;
                    case "offline": serverStatus = "Offline 🔴"; break;
                    default: serverStatus = "Unknown ⚫"; break;
                }

                var attributes = response.attributes
                var limits = response.attributes.limits
                var fields = [
                    {
                        "name": `Attributes`,
                        "value": `\`Status    : ${serverStatus}\`\n\`Node      : ${attributes.node}\`\n\`Is Owner  : ${attributes.server_owner}\`\n\`Suspended : ${attributes.is_suspended}\`\n`,
                    },
                    {
                        "name": `Limits`,
                        "value": `\`CPU  : ${Math.round(resources.cpu_absolute * 10) / 10}/${limits.cpu}%\`\n\`RAM  : ${Math.round(resources.memory_bytes / 100000) / 10}/${limits.memory}MB\`\n\`DISK : ${Math.round(resources.disk_bytes / 100000) / 10}/${limits.disk}MB\`\n`,
                    },
                ]
                var message = {
                    embeds:[{
                        color: `#F7A8B8`,
                        title: `${response.attributes.name}`,
                        fields:fields
                    }]
                }
                interactionObject.editReply(message)
            })
            .catch(err => console.error(err));
        }
        if(serverid != undefined)
            return




        fetch(`${config.panel.url}/api/client`,{
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await commands.get("profile_handler").getKey(interactionObject)}`,
                'User-Agent': `${config.panel.useragent}`,
            }
        })
        .then(async response => {
            response = await response.json()
            // console.log(response);
            // console.log(response.data[0].attributes);


            var message = ""
            if(response.data.length == 0){
                interactionObject.editReply(`You currently dont have any servers connected to your account`)
                return
            }
            for (let i = 0; i < response.data.length; i++) {
                // if(response.data[i].attributes.user == 9)
                    // console.log(response.data[i].attributes.name);
                message += `\`${response.data[i].attributes.identifier}\` : ${response.data[i].attributes.name}\n`
            }
            if(message.length <= 4000){
                interactionObject.editReply(message)
            }else{
                interactionObject.editReply(message.slice(0,3999))
            }
        })
        .catch(err => console.error(err));
    }
}