const included = require("../../requires")

// Here you can add functions that will be run at each startup of the bot

module.exports = {
    name:"reloadCommands",
    async function(msg, args){
        commands.clear()
        var path = `${__dirname}/../../functions`
        var folders = fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isDirectory();
        });
        folders.forEach(element => {
            var commandFiles = fs.readdirSync(`${path}/${element}`).filter(file => file.endsWith('.js') && !file.startsWith("index"));
            for (const file of commandFiles) {
                delete require.cache[require.resolve(`${path}/${element}/${file}`)];
                try {
                    const command = require(`${path}/${element}/${file}`);
                    commands.set(command.name, command);
                } catch (error) {
                    console.log(error);
                }

            }
        });
        console.log(`Reloading ${commands.size} modules done`)
    }
}