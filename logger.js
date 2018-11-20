const bunyan = require("bunyan");

module.exports = bunyan.createLogger({
  name: "discordMessage",
  streams: [
    {
      level: "info",
      path: "message-logs.log"
    }
  ],
  serializers: {
    message: function messageSerializer(message) {
      const m = message;
      const c = message.channel;
      const g = message.guild;
      const a = message.author;
      const gm = message.member;

      const obj = {
        message: {
          id: m.id,
          content: m.content,
          cleanContent: m.cleanContent,
          url: m.url,
          createdAt: m.createdAt,
          createdTimestamp: m.createdTimestamp
        },
        channel: {
          id: c.id,
          name: c.name,
          nsfw: c.nsfw,
          topic: c.topic,
          type: c.type
        },
        guild: {
          id: g.id,
          joinedAt: g.joinedAt,
          joinedTimestamp: g.joinedTimestamp,
          memberCount: g.memberCount,
          mfwLevel: g.mfaLevel,
          name: g.name,
          verified: g.verified,
          //owner returns GuildMember
          owner: {
            id: g.owner.id,
            displayName: g.owner.displayName,
            nickname: g.owner.nickname
          }
        },
        //.author returns User object
        author: {
          id: a.id,
          bot: a.bot,
          createdAt: a.createdAt,
          createdTimestamp: a.createdTimestamp,
          defaultAvatarURL: a.defaultAvatarURL,
          discriminator: a.discriminator,
          username: a.username,
          tag: a.tag
        },
        //.member returns a guildMember object
        guildMember: {
          id: gm.id,
          displayName: gm.displayName,
          nickname: gm.nickname
        },
        attachments: m.attachments
      };
      return obj;
    }
  }
});
