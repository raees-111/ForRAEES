const Discord = require(`discord.js`);
const { Client, Collection, MessageEmbed,MessageAttachment } = require(`discord.js`);
const { readdirSync } = require(`fs`);
const { join } = require(`path`);
const db = require('quick.db');
const { TOKEN, PREFIX, AVATARURL, BOTNAME, } = require(`./config.json`);
const figlet = require("figlet");
const client = new Client({ disableMentions: `` , partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.login('ODI2MTE4NzExMzMyMDQ0ODEw.YGH1AQ.4FQpZQU_GSBW0FB1d-LLSYgThCo');
client.commands = new Collection();
client.setMaxListeners(0);
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);

//this fires when the BOT STARTS DO NOT TOUCH
client.on(`ready`, () => {	
//////////////


////////
   
   ///////////////////////////////
    ////////////IFCHEMPTY//////////
        //remove everything in between those 2 big comments if you want to disable that the bot leaves when ch. or queue gets empty!
        setInterval(() => { 
          let member;
        client.guilds.cache.forEach(async guild =>{
        await delay(15);
          member = await client.guilds.cache.get(guild.id).members.cache.get(client.user.id)
        //if not connected
          if(!member.voice.channel)
          return;
        //if alone 
        if (member.voice.channel.members.size === 1) 
        { return member.voice.channel.leave(); }
      });
      

    client.user.setActivity(`Type: ${PREFIX}help | ${client.guilds.cache.size} Server,Users ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)},`, { type: "PLAYING"});
   
  
      }, (5000));
      ////////////////////////////////
      ////////////////////////////////
    figlet.text(`${client.user.username} ready!`, function (err, data) {
      if (err) {
          console.log('Something went wrong');
          console.dir(err);
      }
      console.log(`═════════════════════════════════════════════════════════════════════════════`);
      console.log(data)
      console.log(`═════════════════════════════════════════════════════════════════════════════`);
    })
   
});
//DO NOT TOUCH
//FOLDERS:
//Admin custommsg data FUN General Music NSFW others
commandFiles = readdirSync(join(__dirname, `Music`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `Music`, `${file}`));
  client.commands.set(command.name, command);
}
commandFiles = readdirSync(join(__dirname, `others`)).filter((file) => file.endsWith(`.js`));
for (const file of commandFiles) {
  const command = require(join(__dirname, `others`, `${file}`));
  client.commands.set(command.name, command);
}
//COMMANDS //DO NOT TOUCH
client.on(`message`, async (message) => {
  if (message.author.bot) return;
  
  //getting prefix 
  let prefix = await db.get(`prefix_${message.guild.id}`)
  //if not prefix set it to standard prefix in the config.json file
  if(prefix === null) prefix = PREFIX;

  //information message when the bot has been tagged
  if(message.content.includes(client.user.id)) {
    message.reply(new Discord.MessageEmbed().setColor("#c219d8").setAuthor(`${message.author.username}, My Prefix is ${prefix}, to get started; type ${prefix}help`, message.author.displayAvatarURL({dynamic:true})));
  } 
  //An embed announcement for everyone but no one knows so fine ^w^
  if(message.content.startsWith(`${prefix}help`)){
    //define saymsg
    const saymsg = message.content.slice(Number(prefix.length) + 5)
    //define embed
     message.react("✅");
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setThumbnail(message.author.avatarURL({dynamic: "true"}))
      .setAuthor("Help Commands!","https://cdn.discordapp.com/<a:emoji_36:815555655502135297>")
    .setImage('https://cdn.discordapp.com/attachments/770233044392607776/788173412123934720/ab45bb4451536652faca51ae4f42d5dd.gif')
    
    .setTitle("NEW UPDATE IN PLAY🎵")
    .setFooter(`Requested by: ${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))

    .setDescription(`\`≪  Prefix Bot ${PREFIX} <a:setting:813404135181385759> ≫

Filter Commands <a:setting:813404135181385759>
- ${PREFIX}fi bassboost - ${PREFIX}fi 8D
- ${PREFIX}fi vaporwave - ${PREFIX}fi nightcore 
- ${PREFIX}fi phaser    - ${PREFIX}fi tremolo 
- ${PREFIX}fi vibrato   - ${PREFIX}fi surrounding 
- ${PREFIX}fi pulsator 
- ${PREFIX}fi clear --- removes all filters

Music <a:Voulome:813460704031145986>
- ${PREFIX}loop(l)-${PREFIX}lyrics(ly)
- ${PREFIX}np(current)-${PREFIX}pause(pe)
- ${PREFIX}-play(p)-${PREFIX}queue(qu)
- ${PREFIX}radio(ro)-${PREFIX}remove(delete) 
- ${PREFIX}resume(r)${PREFIX}search(find)
- ${PREFIX}shuffle(mix)${PREFIX}-skip(s)
- ${PREFIX}skipto(st)-${PREFIX}stop(sp)
- ${PREFIX}volume(v)

Others <a:Erore:813505315534405632>
- ${PREFIX}help - ${PREFIX}ping
- ${PREFIX}prefix -${PREFIX}uptime
- ${PREFIX}lock - ${PREFIX}help roles
- ${PREFIX}setLevel up - ${PREFIX}profile
\`
**[   SUPPORT  ](https://discord.gg/58RbVj9HtJ)** -  [   INVITE   ](https://discord.com/api/oauth2/authorize?client_id=826558555318386738&permissions=8&scope=bot) -
 [   VOTE   ]( https://top.gg/bot/784304843807391755)-  [   YOUTUBE  ](https://youtube.com/channel/UClugW3tNgw4lcsnfBtihxyw)`)
    //delete the Command
  //////  message.delete({timeout: 300})
    //send the Message
    message.channel.send(embed)
  }
 

//command Handler DO NOT TOUCH
 const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
 if (!prefixRegex.test(message.content)) return;
 const [, matchedPrefix] = message.content.match(prefixRegex);
 const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
 const commandName = args.shift().toLowerCase();
 const command =
   client.commands.get(commandName) ||
   client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
 if (!command) return;
 if (!cooldowns.has(command.name)) {
   cooldowns.set(command.name, new Collection());
 }
 const now = Date.now();
 const timestamps = cooldowns.get(command.name);
 const cooldownAmount = (command.cooldown || 1) * 1000;
 if (timestamps.has(message.author.id)) {
   const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
   if (now < expirationTime) {
     const timeLeft = (expirationTime - now) / 1000;
     return message.reply(
      new MessageEmbed().setColor("#c219d8")
      .setTitle(`<:no:770326304473350145> Please wait \`${timeLeft.toFixed(1)} seconds\` before reusing the \`${prefix}${command.name}\`!`)    
     );
   }
 }
 timestamps.set(message.author.id, now);
 setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
 try {
   command.execute(message, args, client);
 } catch (error) {
   console.error(error);
   message.reply( new MessageEmbed().setColor("#ff0000")
   .setTitle(`<:no:770326304473350145> There was an error executing that command.`)).catch(console.error);
 }


});
function delay(delayInms) {
 return new Promise(resolve => {
   setTimeout(() => {
     resolve(2);
   }, delayInms);
 });
}
//////////////
client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;
  let command = message.content.split(" ")[0];
  command = command.slice(PREFIX.length);
  let args = message.content.split(" ").slice(1);
  if (command == "say") {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "ADMINISTRATOR ليس لديك صلاحيات rolling_eyes"
      );
    message.channel.send("" + args.join(" "));
    message.delete();
  }
});
//////////
client.on("message", message => {
  if (message.content.toLowerCase() === PREFIX + "roles") {
    let roles = message.guild.roles.cache
      .map(r => `[ ${r.name}  - Color ${r.color} ]`)
      .join("\n");
    let embed = new Discord.MessageEmbed()
      .setTitle("Server Roles")
      .setDescription(" ```javascript\n" + roles + "``` ");
    message.channel.send(embed);
  }
  if (message.content.toLowerCase() === PREFIX + "help roles") {
    let roles = new Discord.MessageEmbed()
      .setTitle(`Command: roles `)
      .addField("Usage", `${PREFIX}roles`)
      .addField("Information", "Show All Roles For Server");
    message.channel.send(roles);
  }
});
/////////
client.on("message", async message => {
  let command = message.content.toLowerCase().split(" ")[0];
  command = command.slice(PREFIX.length);
  if (command == "avatar") {
    let args = message.content.split(" ");
    let user =
      message.mentions.users.first() ||
      message.author ||
      message.guild.member.cache.get(args[1]);
    message.channel.send(
      new Discord.MessageEmbed()
        .setAuthor(user.username)
        .setDescription(`**[Avatar Link](${user.avatarURL()})**`)
        .setImage(user.avatarURL({ dynamic: true, format: "png", size: 1024 }))
    );
  }
});
///////
client.on("message", async message => {
  if (message.content.startsWith(PREFIX + "lock")) {
    if (!message.channel.guild)
      return message.channel.send(
        "ghallat" + "** | Sorry This Command Only For Servers .**"
      );

    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
      return;
    message.channel.updateOverwrite(message.guild.id, {
      SEND_MESSAGES: false
    });
    const lock = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `<a:emoji_3:784873566428332033>| Locked Channel
Channel Name : <#${message.channel.id}>
Locked By : <@${message.author.id}>
`
      )
       .setThumbnail(message.author.avatarURL({dynamic: "true"}))
      .setAuthor(message.author.username, message.author.displayAvatarURL)
    message.channel.send(lock);
  }
});


//////

//////////
const setxp = JSON.parse(fs.readFileSync('./setxp.json' , 'utf8'));
client.on('message', message => {
           if (!message.channel.guild) return;
    let room = message.content.split(' ').slice(1).join(" ")
    let channel = message.guild.channels.cache.find(channel => channel.name ===  `${room}`) || message.mentions.channels.first()
    if(message.content.startsWith(prefix + "setLevel up")) {
        if(!message.channel.guild) return;
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('**Sorry But You Dont Have Permission** `MANAGE_GUILD`' );
if(!room) return message.channel.send('**Please Type The Name Channel Or mention**')
if(!channel) return message.channel.send('**Cant Find This Channel**')
let embed = new Discord.MessageEmbed()
.setAuthor(message.author.username,message.author.avatarURL())
.setThumbnail(message.author.avatarURL())
.setTitle('**✅Done Check The Level Code Has Been Setup**')
.addField('Channel:', `${room}`)
.addField('Server', `${message.guild.name}`)
.addField('Requested By:', `${message.author}`)
.setColor("RANDOM")
.setFooter(`${client.user.username}`)
.setTimestamp()
message.channel.send(embed)
setxp[message.guild.id] = {
channel: channel.name
}
fs.writeFile("./setxp.json", JSON.stringify(setxp), (err) => {
if (err) console.error(err)
})}})
let xp = require('./xp.json');
client.on('message', message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    let Addxp = Math.floor(Math.random() * 6) + 8;
 
    if(!xp[message.author.id]){
        xp[message.author.id] = {
            xp: 0,
            level: 1
        };
    }
    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level + 1;
    let nextLvL = xp[message.author.id].level * 1000;
    xp[message.author.id].xp = curxp + Addxp;
    if(nextLvL <= xp[message.author.id].xp){
        xp[message.author.id].level = xp[message.author.id].level + 1;
       let channels = client.channels.cache.find(channel => channel.name ===  setxp[message.guild.id].channel)
         channels.send(`**<@${message.author.id}> Congratulations level up,🍃 your level now [ ${curlvl} ] 💖**`)
    }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
            if(err) console.log(err)
        });
});
/////////
client.on("message", async message => {
  if (message.content.toLowerCase() === prefix + "profile") {
    message.channel.startTyping();
    setTimeout(() => {
      message.channel.stopTyping();
    }, Math.random() * (1 - 3) + 1 * 200).then(
      message.channel.send({
        files: [
          {
            name: "prfoilebycutie.png",
            attachment: `https://api.probot.io/profile/${message.author.id}`
          }
        ]
      })
    );
  }
});
///////////
