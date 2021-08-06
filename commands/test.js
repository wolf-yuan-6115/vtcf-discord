module.exports = {
  name: "test",
  execute(message) {
    message.client.emit("guildMemberAdd", message.member);
  }
}