const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  async execute(message, args) {
    let embed = new MessageEmbed()
      .setTitle("延遲")
      .setDescription(`正在測試...`)
      .setColor("BLURPLE");
    let sent = await message.channel.send(embed);
    embed.setDescription(`🏓: ${Date.now() - sent.createdTimestamp}ms | ❤️ ${message.client.ws.ping}ms`);
    return sent.edit(embed);
  }
}