var readline = require("readline");
var Bot = require("./bot");
var INVALID_COMMAND = require("./contants").INVALID_COMMAND;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "COMMAND>"
});

var bot = new Bot();

rl.write("Input command to move the bot\n");
rl.prompt();

rl.on("line", function(input) {
  var command = input
    .toUpperCase()
    .trim()
    .split(" ");
  var action = command[0];
  var payload = command[1];
  if (action !== "PLACE" && payload !== undefined) {
    console.error(INVALID_COMMAND);
  } else {
    bot.executeCommand(action, payload);
  }
  rl.prompt();
});
