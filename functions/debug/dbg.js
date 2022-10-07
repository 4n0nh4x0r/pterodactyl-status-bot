// const { Chart } = require("chart.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    name: "dbg",
    slashcommand:
        new SlashCommandBuilder()
        .setName("dbg")
        .setDescription("This command is for debugging purposes only, only the dev can issue the command"),
    slashcommandGlobal:false,
    async function(interactionObject) {
        // interactionObject.deferReply()
        var modal = new Modal()
            .setCustomId("testModal")
            .setTitle("Fill me uwu")

        var testInput1 = new TextInputComponent()
            .setCustomId("testInput")
            .setLabel("Input some data into me uwu")
            .setStyle("SHORT")

        const firstActionRow = new MessageActionRow().addComponents(testInput1)
        const secondActionRow = new MessageActionRow().addComponents(textMenu)
		modal.addComponents(firstActionRow, secondActionRow)

        await interactionObject.showModal(modal).then(res => {
            console.log(res);
        })
        
        // Collect a modal submit interaction
        const filter = (b) => b.customId === 'testModal' && b.user.id == interactionObject.user.id && b.channelid == interactionObject.channelid;
        interactionObject.awaitModalSubmit({ filter, time: 30000 })
        .then(i => {
            // console.log(interactionObject.id)
            // console.log(i.id);
            i.reply(`${i.fields.getTextInputValue('testInput')}`)
        })
        .catch(console.error);
    }
}