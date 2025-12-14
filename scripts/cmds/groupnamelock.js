module.exports = {
  name: "groupnamelock",
  role: 2, // admin only
  description: "Lock group name",
  usage: "groupnamelock on (name) | off",

  onStart: async function ({ api, event, args, threadsData }) {
    const threadID = event.threadID;

    if (args[0] === "off") {
      await threadsData.set(threadID, false, "groupNameLock.enable");
      return api.sendMessage("🔓 Group name lock disabled.", threadID);
    }

    if (args[0] !== "on") {
      return api.sendMessage("Usage: groupnamelock on (name)", threadID);
    }

    const lockName = args.slice(1).join(" ").trim();
    if (!lockName) {
      return api.sendMessage("❌ Please provide a group name.", threadID);
    }

    await api.setTitle(lockName, threadID);
    await threadsData.set(threadID, {
      enable: true,
      name: lockName
    }, "groupNameLock");

    api.sendMessage(`🔒 Group name locked to:\n${lockName}`, threadID);
  },

  onEvent: async function ({ api, event, threadsData }) {
    if (event.logMessageType !== "log:thread-name") return;

    const threadID = event.threadID;
    const lockData = await threadsData.get(threadID, "groupNameLock");

    if (!lockData || !lockData.enable) return;

    await api.setTitle(lockData.name, threadID);
  }
};
