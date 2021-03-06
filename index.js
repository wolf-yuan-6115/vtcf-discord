require("dotenv").config();
const { Client, Collection, MessageAttachment, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { getInfo } = require("ytdl-core");
const Canvas = require("node-canvas");
const Rss = require("rss-feed-emitter");
const disbut = require("discord-buttons");

const client = new Client();
disbut(client);
const rss = new Rss({
  skipFirstLoad: true
});

rss.add({
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCP8f3laAxgn85pOVRSiM7qw",
  refresh: 15000,
  eventName: "salmon"
}, {
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsi9DTrwFRbNLagOgiddnkg",
  refresh: 15000,
  eventName: "baka"
}, {
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIzOGbR1J-cV3UjRxOURBOw",
  refresh: 15000,
  eventName: "vegetable"
}, {
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCqeR-UWr2KwGtAc6MHhM-_w",
  refresh: 15000,
  eventName: "partner"
});

let prefix = "v!"
client.commands = new Collection();
Canvas.registerFont("./canvas/font.ttf", {
  family: "custom-font"
});

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`Load ${command.name}`);
}

function makeRssEmbed(event) {
  return new Promise(async (reslove, reject) => {
    let embed = new MessageEmbed()
      .setTitle(`${event.title}`)
      .setURL(event.link)
      .setImage(event["media:group"]["media:thumbnail"]["@"]["url"])
      .setColor("BLURPLE")
      .addField("頻道名稱:", `[${event["atom:author"]["name"]["#"]}](${event["atom:author"]["uri"]["#"]})`, true);
    let videoInfo = await getInfo(event.link);
    if (videoInfo.liveBroadcastDetails) {
      let startDate = Date.parse(videoInfo.liveBroadcastDetails.startTimestamp);
      let startString = startDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
      embed.addField("直播開始時間", startString, true);
    }
    reslove(embed);
  });
}

rss.on("salmon", async (event) => {
  let channel = client.channels.cache.get("864315435398463509");
  let embed = await makeRssEmbed(event);
  channel.send("<@&864192749275185193>", embed)
    .catch(console.error);
});

rss.on("baka", async (event) => {
  let channel = client.channels.cache.get("864315258347978783");
  let embed = await makeRssEmbed(event);
  channel.send("<@&864192749275185193>", embed)
    .catch(console.error);
});

rss.on("vegetable", async (event) => {
  let channel = client.channels.cache.get("864315342705000480");
  let embed = await makeRssEmbed(event);
  channel.send("<@&864192749275185193>", embed)
    .catch(console.error);
});

rss.on("partner", async (event) => {
  let channel = client.channels.cache.get("872808532129497139");
  let embed = await makeRssEmbed(event);
  channel.send("<@&864192749275185193>", embed)
    .catch(console.error);
});

client.on("ready", () => {
  console.log(`Logged as ${client.user.tag}`);
  setInterval(() => {
    client.user.setPresence({
      status: "idle",
      activity: {
        name: "VTCF | 由Wolf yuan製作",
        type: "PLAYING"
      }
    });
  }, 15000);

  let stats = client.channels.cache.get("866332085651374080");
  let guild = client.guilds.cache.get("863460026483081226");
  stats.setName(`👥 ${guild.memberCount}個成員`);
});


client.on("clickButton", async (btn) => {
  const member = btn.guild.members.cache.get(btn.clicker.user.id);
  if (!member) return;
  await btn.reply.defer();
  const add = (id) => {
    if (member.roles.cache.has(id)) member.roles.remove(id).catch(console.error);
    else member.roles.add(id).catch(console.error)
  }
  switch (btn.id) {
    case "viewer":
      add("864192749275185193");
      break;
    case "r6":
      add("864519476518453298");
      break;
    case "amogus":
      add("864519909622415390");
      break;
    case "minecraft":
      add("866633040419880970");
      break;
    case "rick":
      add("867053753270272030");
      break;
  }
})

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  if (!message.guild) return message.channel.send("❌ | 我不接受私訊!")

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    return message.channel.send('❌ | 執行時發生錯誤!');
  }
});

const applyText = (canvas, text) => {
  const context = canvas.getContext('2d');
  let fontSize = 70;
  do {
    context.font = `${fontSize -= 10}px custom-font`;
  } while (context.measureText(text).width > canvas.width - 300);
  return context.font;
};

client.on("guildMemberAdd", async (member) => {
  let stats = client.channels.cache.get("866332085651374080");
  stats.setName(`👥 ${member.guild.memberCount}個成員`);
  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext('2d');

  const background = await Canvas.loadImage('./canvas/bg.jpg');
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#74037b';
  context.strokeRect(0, 0, canvas.width, canvas.height);

  context.font = '28px custom-font';
  context.fillStyle = '#ffffff';
  context.fillText('歡迎', canvas.width / 2.5, canvas.height / 3.5);

  context.font = applyText(canvas, `${member.displayName}!`);
  context.fillStyle = '#ffffff';
  context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  context.font = '30px custom-font';
  context.fillStyle = '#ffffff';
  context.fillText(`您是第${member.guild.memberCount}個成員`, canvas.width / 2.5, canvas.height / 1.3);

  context.beginPath();
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
    format: 'png'
  }));
  context.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new MessageAttachment(canvas.toBuffer(), 'image.png');

  client.channels.cache.get("863460026483081229").send(`<@${member.user.id}>歡迎來到VTCF的觀眾伺服器!\n請前往 <#863460026483081230> 閱讀版鮭和領取身份組喔`, attachment);
});

client.on("guildMemberRemove", (member) => {
  let stats = client.channels.cache.get("866332085651374080");
  stats.setName(`👥 ${member.guild.memberCount}個成員`);
});

client.login(process.env.TOKEN);
