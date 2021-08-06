const { MessageButton, MessageActionRow } = require("discord-buttons");

module.exports = {
  name: "deploy",
  execute(message) {
    if (message.author.id !== "669194742218752070") return message.channel.send("Missing access!");

    const btn = new MessageButton()
        .setStyle("blurple")
        .setLabel("領取觀眾身份組")
        .setID("viewer"),
      btnRow = [],
      standAloneBtn = new MessageActionRow(),
      btnAction = new MessageActionRow();

    btnRow.push(new MessageButton()
      .setStyle("green")
      .setLabel("領取R6身份組")
      .setID("r6"));
    btnRow.push(new MessageButton()
      .setStyle("green")
      .setLabel("領取Among us身份組")
      .setID("amogus"));
    btnRow.push(new MessageButton()
      .setStyle("green")
      .setLabel("領取Minecraft身份組")
      .setID("minecraft"));
    btnRow.push(new MessageButton()
      .setStyle("blurple")
      .setLabel("領取Rick Astley身份組")
      .setID("rick"));
    
    btnAction.addComponents(...btnRow);
    standAloneBtn.addComponents(btn);
    
    message.client.channels.cache.get("863460026483081230").send("↓ 領取觀眾身份組 ↓", {
      components: [standAloneBtn]
    });
    message.client.channels.cache.get("863462132422541312").send("↓ 點選領取/移除身份組 ↓", {
      components: [btnAction]
    });
  }
}