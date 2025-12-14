module.exports = {
  config: {
    name: "nicknamelockall",
    role: 2,
    category: "utility",
    description: "Lock nicknames of all members",
    usage: "nicknamelockall on | off"
  },

  onStart: async function ({ api, event, args, threadsData }) {
    const threadID = event.threadID;

    // OFF
    if (args[0] === "off") {
      await threadsData.set(threadID, { enable: false }, "nicknameLockAll");
      return api.sendMessage("🔓 Nickname lock (all users) disabled.", threadID);
    }

    // ON
    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.participantIDs;

    const nicknames = {};
    for (const uid of members) {
      nicknames[uid] = threadInfo.nicknames?.[uid] || "";
    }

    await threadsData.set(threadID, {
      enable: true,
      nicknames
    }, "nicknameLockAll");

    api.sendMessage(
      "🔒 Nicknames of all members are now locked.",
      threadID
    );
  },

  onEvent: async function ({ api, event, threadsData }) {
    if (event.logMessageType !== "log:user-nickname") return;

    const threadID = event.threadID;
    const data = await threadsData.get(threadID, "nicknameLockAll");

    if (!data?.enable) return;

    const uid = event.logMessageData?.participant_id;
    if (!uid) return;

    const lockedNick = data.nicknames[uid] ?? "";

    // REVERT
    await api.changeNickname(lockedNick, threadID, uid);
  }
};
