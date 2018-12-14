### Emojibotten

Simple bot for simple purpose. Written in [Klasa](http://klasa.js.org) on top of [discord.js](https://discord.js.org).

Three simple commands:

- inv/invite/link
- emoji/addEmoji/add
- remove/removeEmoji/emojiRemove/delete/deleteEmoji/emojiDelete

Emoji command usage: `>emoji [url] [emoji name]`
Delete command usage `>emoji [name OR use actual emoji]`

#### Resizing

Discord currently only allows images/gifs below 256kb in size and 128x128 or
smaller to be uploaded.

Due to this, Emojibotten will automatically re-size any image to 128x128 (The highest
possible resolution).

Gifs will be resized first to 128x128 and will then have their file sizes
checked. If it isn't 256kb or smaller, it will run the same operation but with
half the resolution (64x64) recursively until it's 256kb or lower in size.

Resizing gifs might take a few seconds to complete due to being resized multiple
times depending on the size.
