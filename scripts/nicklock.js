let nickLockStatus = {};
let savedNicknames = {};

module.exports = {
  config: {
    name: "nicklock",
    version: "1.0",
    author: "ChatGPT",
    role: 1,
    description: "Lock nicknames of all users",
    category: "admin",
    usages: "&nicklock on\n&nicklock off",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;

    if (args[0] === "off") {
      nickLockStatus[threadID] = false;
      return api.sendMessage("🔓 Nickname Lock OFF", threadID);
    }

    if (args[0] === "on") {
      nickLockStatus[threadID] = true;
      savedNicknames[threadID] = {};

      const info = await api.getThreadInfo(threadID);
      for (const user of info.participantIDs) {
        savedNicknames[threadID][user] =
          info.nicknames[user] || "";
      }

      return api.sendMessage("🔒 Nickname Lock ON", threadID);
    }
  },

  onEvent: async function ({ api, event }) {
    const threadID = event.threadID;

    if (
      nickLockStatus[threadID] &&
      event.logMessageType === "log:user-nickname"
    ) {
      const userID = event.logMessageData.participant_id;
      const originalNick = savedNicknames[threadID][userID] || "";

      setTimeout(() => {
        api.changeNickname(
          originalNick,
          threadID,
          userID
        );
      }, 1000);
    }
  }
};
