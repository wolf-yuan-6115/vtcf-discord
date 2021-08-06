module.exports = {
  name:　"ban",
  async execute(message) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("❌ | 你沒有權限，你必須要有管理員權限才能執行此指令!");
    if (!message.mentions.size < 1) return message.channel.send("❌ | 請標註一個人!");
    message.mentions.each(member => {
      try {
        member.kick();
      } catch (e) {
        message.channel.send(`❌ | 無法踢出${member.displayName}`);
      }
    });
    return message.channel.send(`✅ | 成功踢出${message.mentions.size}個成員`);
  }
}