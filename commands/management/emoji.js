const config = require("../../config");
const { Command } = require("klasa");

const sharp = require("sharp");
const fs = require("fs");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
const sizeOf = require("image-size");
// const imagemin = require("imagemin");
// const imageminGifsicle = require("imagemin-gifsicle");
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

    const ext = getFileExt(url);
    const file = getFileOut(message, ext);
    await saveFile(url, file);

    // Returns true if <= 128x128
    // const uploadable = checkSize(file);

    // Example output: { width: 240, height: 240, type: 'gif' }
    const imgDimensions = sizeOf(file);

    if (imgDimensions.width <= 128 && imgDimensions.height <= 128) {
      saveEmoji(message, url, name);
    } else {
      const img = await resizeImage(file, imgDimensions.type, "128");
      saveEmoji(message, img, name);
    }
  }
};

//It will first try 128x128 then recursively call itself to 64 then 32 if size
//is not below 256kb.
async function resizeImage(file, type, imgSize) {
  if (type == "gif") {
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

// Gets file extension from URL
function getFileExt(url) {
  return url.match(/\.(\w+)$/)[1];
}

function saveEmoji(message, url, name) {
  message.guild.emojis
    .create(url, name)
    .then(emoji => {
      message.channel.send(`Successfully uploaded **${name}** ${emoji}.`);
    })
    .catch(e => {
      message.channel.send(`Unable to create emoji for reason: ${e}`);
    });
}

//Takes a message and returns the output location for saved files
function getFileOut(message, ext) {
  //Need to check for file extensions
  return `./images/${message.id}.${ext}`;
}

// Returns true if 128x128 or under
// function checkSize(file) {
//   const size = sizeOf(file);
//   if (size.width <= 128 || size.length <= 128) return true;
//   return false;
// }

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

// Returns false if either width or height is less than 128 pixels
function correctFileSize() {}
