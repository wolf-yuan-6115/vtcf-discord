module.exports = {
  name: "mute",
  async execute(message) {
    return message.channel.send("Development in progress!");
  }
}