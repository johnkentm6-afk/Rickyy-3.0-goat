let lockedGroupName = {};
let groupLockStatus = {};

module.exports = {
  config: {
    name: "grouplock",
    version: "1.0",
    author: "ChatGPT",
    role: 1,
    description: "Lock group name (auto revert)",
    category: "admin",
    usages: "&grouplock on <name>\n&grouplock off",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;

    if (args[0] === "off") {
      groupLockStatus[threadID] = false;
      return api.sendMessage("🔓 Group Name Lock OFF", threadID);
    }

    if (args[0] === "on") {
      const name = args.slice(1).join(" ");
      if (!name) return api.sendMessage("❌ Enter group name", threadID);

      lockedGroupName[threadID] = name;
      groupLockStatus[threadID] = true;

      await api.setTitle(name, threadID);
      return api.sendMessage(`🔒 Group name locked:\n${name}`, threadID);
    }
  },

  onEvent: async function ({ api, event }) {
    const threadID = event.threadID;

    if (
      groupLockStatus[threadID] &&
      event.logMessageType === "log:thread-name"
    ) {
      setTimeout(() => {
        api.setTitle(lockedGroupName[threadID], threadID);
      }, 1000);
    }
  }
};
