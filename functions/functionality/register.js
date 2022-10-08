const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "register",
    slashcommand:
        new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register an account on the local pterodactyl web panel")
        .addStringOption(option => option
            .setName("username")
            .setDescription("The username for your account (needed if no client key is supplied)")
        )
        .addStringOption(option => option
            .setName("client_key")
            .setDescription("If you already have an account, create a client key, and add that one here to link your account")
        ),
    slashcommandGlobal:true,
    async function(interactionObject) {

        var username    = interactionObject.options.getString("username")
        var client_key  = interactionObject.options.getString("client_key")
        var firstname   = interactionObject.options.getString("firstname")
        var lastname    = interactionObject.options.getString("lastname")

        var password    = hashids.encode(Math.floor(Math.random() * 1000000))

        var ephemeral = true
        if(client_key != null){
            ephemeral = true
        }
        await interactionObject.deferReply({ephemeral:ephemeral})

        // This part triggers only when the client key is present, and is the only part that will trigger in that case
        // It will request the user's data based on the presented key, and then append that data to the account in the database or create one if none should be found
        if(client_key != null){
            if(client_key.length != 48){
                interactionObject.editReply("Incorrect Client Key size")
                return
            }
            fetch(`${mainconfig.panel.url}/api/client/account`,{
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${client_key}`,
                    'User-Agent': `${mainconfig.panel.useragent}`,
                }
            })
            .then(async response => {
                response = await response.json()
                if(response.errors){
                    switch(response.errors[0].status){
                        case "500":
                            interactionObject.editReply("Server Error")
                            break;
                        default:
                            interactionObject.editReply(`Your key is likely incorrect, please make sure that you are using the right key\n${mainconfig.panel.url}/account/api`)
                            break
                    }
                    return
                }
                commands.get("queryCommand").function("INSERT INTO tbl_users (idUser,dtDiscordID,dtKey) VALUES (?,?,?) ON DUPLICATE KEY UPDATE dtKey = ?",[response.attributes.id,interactionObject.user.id,client_key,client_key]).then(result => {
                    if(!result){
                        interactionObject.editReply(`There was an error trying to write the user to the database \nMake sure that the bot was set up correctly`)
                        return
                    }
                    interactionObject.editReply(`User ${response.attributes.username} linked`)
                })
                console.log(response);
            })
            .catch(err => console.error(err));
        }

        if(client_key != null)
            return

        if(username == null){
            interactionObject.editReply("You need to supply a valid username or a client key if you already have an account")
            return}

        if(!mainconfig.panel.allowRegistration){
            interactionObject.editReply("Registering new account has been disabled by the administrator")
            return
        }

        fetch(`${mainconfig.panel.url}/api/application/users`,{
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${mainconfig.panel.applicationKey}`,
                'User-Agent': `${mainconfig.panel.useragent}`,
            },
            "body":JSON.stringify({
                "email": `${interactionObject.user.id}@goodanimemes.com`,
                "username": `${username}`,
                "first_name": `${firstname}`,
                "last_name": `${lastname}`,
                "password": `${password}`
            })
        })
        .then(async response => {
            response = await response.json()
            console.log(response);
            if(response.errors){
                switch(response.errors[0].status){
                    case "500":
                        interactionObject.editReply("Server Error")
                        break;
                    case "422":
                        interactionObject.editReply(response.errors[0].detail)
                        break;
                }
                return
            }
            commands.get("queryCommand").function("INSERT INTO tbl_users (idUser,dtDiscordID) VALUES (?,?)",[response.attributes.id,interactionObject.user.id]).then(result => {
                if(!result){
                    interactionObject.editReply(`There was an error trying to write the user to the database \nMake sure that the bot was set up correctly`)
                    return
                }
                interactionObject.editReply(`User ${response.attributes.username} created`)




                interactionObject.user.send(
`${mainconfig.panel.url}\n
The password for your account __${username}__ is __${password}__\n\n
Now you can log into your account and go to your profile settings\n
Go to \`API Credentials\` and create a new key\n
Then go back to the server and use the register command again, this time using the \`client_key\` parameter with the key you just created
This message will get deleted <t:${Math.floor((new Date().getTime() + 120000)/1000)}:R>`
).then(dm => {
                    setTimeout(() => {
                        dm.delete()
                    }, 120000);
                })
            })
        })
        .catch(err => console.error(err));
    }
}