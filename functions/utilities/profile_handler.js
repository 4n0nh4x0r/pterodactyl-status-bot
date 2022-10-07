
module.exports = {
    name: "profile_handler",
    async function(interactionObject) {
        return new Promise(async resolve => {
            var user  = interactionObject.user
            var guild = interactionObject.guild

            // Check if profiles object exists, and create it if not
            if(!sharedVars.profiles){
                sharedVars.profiles = {}
            }
            // Check if user exists in profiles object, if not, create
            if(!sharedVars.profiles[user.id]){
                sharedVars.profiles[user.id] = {}
                var userdata = await commands.get("queryCommand").function(`SELECT * FROM tbl_users WHERE dtDiscordID = ?`,[user.id])
                if(userdata.length == 0){
                    resolve(false)
                    return
                }
                sharedVars.profiles[user.id].key = userdata[0].dtKey
                sharedVars.profiles[user.id].userid = userdata[0].idUser
                sharedVars.profiles[user.id].credits = userdata[0].dtCredits

            }
            sharedVars.profiles[user.id].lastEdit = new Date().getTime()
            resolve(true)
        })

    },
    getKey : async function(interactionObject){
        return new Promise(async resolve => {
            var userid = interactionObject.user.id
            if(!sharedVars.profiles){              resolve(false);return}
            if(!sharedVars.profiles[userid]){      resolve(false);return}
            if(!sharedVars.profiles[userid].key){  resolve(false);return}
            resolve(sharedVars.profiles[userid].key)
        })
    }
}