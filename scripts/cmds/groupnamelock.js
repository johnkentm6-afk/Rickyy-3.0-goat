module.exports = {
  config: {
    name: "groupnamelock",
    role: 2,
    category: "utility",
    description: "Lock group name",
    usage: "groupnamelock on <name> | off"
  },

  onStart: async function ({ api, event, args, threadsData }) {
    const threadID = event.threadID;

    // OFF
    if (args[0] === "off") {
      await threadsData.set(threadID, { enable: false }, "groupNameLock");
      return api.sendMessage("🔓 Group name lock disabled.", threadID);
    }

    // INVALID
    if (args[0] !== "on") {
      return api.sendMessage(
        "Usage: groupnamelock on <name>",
        threadID
      );
    }

    // NAME
    const lockName = args.slice(1).join(" ").trim();
    if (!lockName) {
      return api.sendMessage(
        "❌ Please provide a group name.",
        threadID
      );
    }

    // ✅ CHANGE NAME (AUTO-DETECT)
    await changeGroupName(api, lockName, threadID);

    // SAVE
    await threadsData.set(threadID, {
      enable: true,
      name: lockName
    }, "groupNameLock");

    api.sendMessage(
      `🔒 Group name locked to:\n${lockName}`,
      threadID
    );
  },

  onEvent: async function ({ api, event, threadsData }) {
    if (event.logMessageType !== "log:thread-name") return;

    const threadID = event.threadID;
    const lockData = await threadsData.get(threadID, "groupNameLock");

    if (!lockData?.enable || !lockData.name) return;

    // RE-LOCK
    await changeGroupName(api, lockData.name, threadID);
  }
};

// 🔧 UNIVERSAL GROUP NAME CHANGER
async function changeGroupName(api, name, threadID) {
  if (typeof api.setThreadName === "function") {
    return api.setThreadName(name, threadID);
  }

  if (typeof api.setTitle === "function") {
    return api.setTitle(name, threadID);
  }

  if (typeof api.changeThreadName === "function") {
    return api.changeThreadName(name, threadID);
  }

  throw new Error("No supported method to change group name.");
}
