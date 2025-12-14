module.exports = {
  name: "nicknamelock",
  role: 2,
  description: "Lock nickname",
  category: "UTILITY",
  usage: "nicknamelock on <nickname> | off",

  onStart: async function ({ api, event, args, threadsData }) {
    const threadID = event.threadID;
    const userID = event.senderID;

    if (args[0] === "off") {
      await threadsData.set(threadID, { enable: false }, "nicknameLock");
      return api.sendMessage("🔓 Nickname lock disabled.", threadID);
    }

    if (args[0] !== "on") {
      return api.sendMessage("Usage: nicknamelock on <nickname>", threadID);
    }

    const nickname = args.slice(1).join(" ").trim();
    if (!nickname) {
      return api.sendMessage("❌ Please provide a nickname.", threadID);
    }

    await api.changeNickname(nickname, threadID, userID);
    await threadsData.set(threadID, {
      enable: true,
      nickname,
      userID
    }, "nicknameLock");

    api.sendMessage(`🔒 Nickname locked to:\n${nickname}`, threadID);
  },

  onEvent: async function ({ api, event, threadsData }) {
    if (event.logMessageType !== "log:user-nickname") return;

    const threadID = event.threadID;
    const lockData = await threadsData.get(threadID, "nicknameLock");

    if (!lockData?.enable) return;
    if (event.logMessageData?.participant_id !== lockData.userID) return;

    await api.changeNickname(
      lockData.nickname,
      threadID,
      lockData.userID
    );
  }
};
