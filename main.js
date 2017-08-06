const Discord = require('discord.js');
var fs = require("fs");
const client = new Discord.Client();
var util = require('./utilities.js');

var commands = JSON.parse(fs.readFileSync('commands.json', 'utf8'));
var config =JSON.parse(fs.readFileSync('config.json', 'utf8'));
var prefix = config.prefix;

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
    if(message.content.startsWith(prefix)){
        var param = message.content.split(" ");
        param[0] = param[0].split(prefix)[1];
        var command = util.checkalias(param[0]);
            
        if(command.type == "execute"){command.type = param[0]};
        switch(command.type){       
            case "simple":
                message.channel.send(command.content);
                break;

            case "say":
                break;
                    
            case "embed":
                var embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .setImage(command.content);
                 message.channel.send({embed});
                break;
                    
            case "add":
                var name = param[2];
                var type = param[1];
                param.shift();
                param.shift();
                param.shift();
                commands[name] = {
                    "type":type,
                    "content": (param.join(" ")).split("\\n").join("\n"),
                    "alias":[]
                };
                fs.writeFileSync('commands.json',JSON.stringify(commands), 'utf8');
                message.reply("Command added");
                message.delete();
                break;
                
            case "alias":
                if(!commands[param[1]].alias){commands[param[1]].alias = [];};
                commands[param[1]].alias.push( param[2]);
                fs.writeFileSync('commands.json',JSON.stringify(commands), 'utf8');
                message.edit("Alias added");
                break;
                    
            case "show":
                var messageOut = "";
                var keys = Object.keys(commands);
                var i = 0;
                var out = {};
                for(i=0;i<keys.length;i++){
                    console.log(commands[keys[i]].type);
                    if(commands[keys[i]].type === param[1]){
                        messageOut += key + ", ";
                    }
                }
                message.reply(messageOut);
                break;

                    
            case "remove":
                delete commands[param[1]];
                fs.writeFileSync('commands.json',JSON.stringify(commands), 'utf8');
                message.reply("Command removed");
                message.delete();
                break;
                
            case "default":
            default:
                message.reply('This command is not on our realm');
                break;
        }
    }
});

client.login(process.env.discord_token);
