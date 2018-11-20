const config = require("../../config");
const { Command } = require("klasa");

//const log = require("../../logger");

const sharp = require("sharp");
const fs = require("fs");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
const sizeOf = require("image-size");
const gifsicle = require("gifsicle");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      description: "Add an emoji via a URL",
      usage: "<url:url> <name:str{1,20}>",
      usageDelim: " ",
      aliases: ["addEmoji", "add"]
    });
  }

  async run(message, [url, name]) {
    if (!message.member.hasPermission("MANAGE_EMOJIS"))
      return message.channel.send(
        "You do not have the Manage Emojis permission in this server."
      );

    const file = getFileOut(message);
    await saveFile(url, file);

    // Example output: { width: 240, height: 240, type: 'gif' }
    const imgDimensions = sizeOf(file);

    if (imgDimensions.width <= 128 && imgDimensions.height <= 128) {
      await saveEmoji(message, url, name);
    } else {
      const img = await resizeImage(file, imgDimensions.type, "128", message);
      await saveEmoji(message, img, name);
    }
    deleteImage(file);
  }
};

async function deleteImage(file) {
  fs.unlink(file, err => {
    if (err) throw err;
    return Promise.resolve();
  });
}

//It will first try 128x128 then recursively call itself to 64 then 32 if size
//is not below 256kb.
async function resizeImage(file, type, imgSize, msg) {
  if (type == "gif") {
    // msg is only present on the first call and not recursively.
    if (msg) {
      msg.channel.send("Processing...");
    }
    await execFile(gifsicle, ["--resize-fit-width", imgSize, "-o", file, file]);
    const fileSize = await getFilesizeInBytes(file);
    if (fileSize > 256000) {
      return Promise.resolve(resizeImage(file, type, imgSize / 2));
    } else {
      return Promise.resolve(file);
    }
  } else {
    return Promise.resolve(
      await sharp(file)
        .resize(128, 128)
        .toBuffer()
    );
  }
}

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return Promise.resolve(fileSizeInBytes);
}

async function saveEmoji(message, file, name) {
  return message.guild.emojis
    .create(file, name)
    .then(emoji => {
      message.channel.send(`Successfully uploaded **${name}** ${emoji}.`);
      return Promise.resolve();
    })
    .catch(e => {
      message.channel.send(`Unable to create emoji for reason: ${e}`);
      return Promise.resolve();
    });
}

//Takes a message and returns the output location for saved files
function getFileOut(message) {
  //Need to check for file extensions
  return `./images${message.id}`;
}

// Takes a URL and a directory+filename and saves to that directory with that
// file name.
async function saveFile(url, saveAs) {
  if (fs.existsSync(saveAs)) {
    return;
  } else {
    await execFile("curl", [url, "-o", saveAs]);
    return Promise.resolve();
  }
}
