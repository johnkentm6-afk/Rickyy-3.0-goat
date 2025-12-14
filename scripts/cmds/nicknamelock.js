module.exports = {
  config: {
    name: "botnicknamelock",
    role: 2,
    category: "utility",
    description: "Lock the bot's own nickname",
    usage: "botnicknamelock on <nickname> | off"
  },

  onStart: async function ({ api, event, args, threadsData }) {
    const threadID = event.threadID;
    const botID = api.getCurrentUserID();

    // OFF
    if (args[0] === "off") {
      await threadsData.set(threadID, { enable: false }, "botNicknameLock");
      return api.sendMessage("🔓 Bot nickname lock disabled.", threadID);
    }

    // ON
    const nickname = args.join(" ").trim();
    if (!nickname) {
      return api.sendMessage(
        "❌ Please provide a nickname.\nExample: botnicknamelock BotName",
        threadID
      );
    }

    // CHANGE BOT NICKNAME (NO ADMIN REQUIRED)
    await api.changeNickname(nickname, threadID, botID);

    // SAVE
    await threadsData.set(threadID, {
      enable: true,
      nickname
    }, "botNicknameLock");

    api.sendMessage(
      `🔒 Bot nickname locked to:\n${nickname}`,
      threadID
    );
  },

  onEvent: async function ({ api, event, threadsData }) {
    if (event.logMessageType !== "log:user-nickname") return;

    const threadID = event.threadID;
    const botID = api.getCurrentUserID();
    const data = await threadsData.get(threadID, "botNicknameLock");

    if (!data?.enable) return;

    // CHECK IF BOT WAS TARGETED
    if (event.logMessageData?.participant_id !== botID) return;

    // REVERT BOT NICKNAME
    await api.changeNickname(
      data.nickname,
      threadID,
      botID
    );
  }
};
