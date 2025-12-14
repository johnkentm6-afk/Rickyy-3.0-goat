global.nickLock = global.nickLock || {};
global.savedNick = global.savedNick || {};

module.exports = {
  config: {
    name: "nicklock",
    version: "1.2",
    author: "ChatGPT",
    role: 1,
    description: "Lock all nicknames in group",
    category: "admin",
    usages: "&nicklock on | &nicklock off",
    cooldowns: 5
  },

  run: async function ({ api, event, args }) {
    const threadID = event.threadID;

    if (!args[0])
      return api.sendMessage("&nicklock on | &nicklock off", threadID);

    if (args[0] === "off") {
      global.nickLock[threadID] = false;
      return api.sendMessage("🔓 Nickname lock OFF", threadID);
    }

    if (args[0] === "on") {
      global.nickLock[threadID] = true;
      global.savedNick[threadID] = {};

      const info = await api.getThreadInfo(threadID);
      for (const uid of info.participantIDs) {
        global.savedNick[threadID][uid] =
          info.nicknames[uid] || "";
      }

      return api.sendMessage("🔒 Nickname lock ON", threadID);
    }
  }
};
