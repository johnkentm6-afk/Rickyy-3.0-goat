module.exports = {
  name: "groupnamelock",
  role: 2,
  description: "Lock group name",
  category: "UTILITY",
  usage: "groupnamelock on <name> | off",

  onStart: async function ({ api, event, args, threadsData }) {
    const threadID = event.threadID;

    if (args[0] === "off") {
      await threadsData.set(threadID, { enable: false }, "groupNameLock");
      return api.sendMessage("🔓 Group name lock disabled.", threadID);
    }

    if (args[0] !== "on") {
      return api.sendMessage("Usage: groupnamelock on <name>", threadID);
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

    if (!lockData?.enable || !lockData.name) return;

    await api.setTitle(lockData.name, threadID);
  }
};
