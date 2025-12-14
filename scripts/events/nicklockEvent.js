module.exports = async function ({ api, event }) {
  const threadID = event.threadID;

  if (
    global.nickLock?.[threadID] &&
    event.logMessageType === "log:user-nickname"
  ) {
    const uid = event.logMessageData.participant_id;
    const oldNick = global.savedNick?.[threadID]?.[uid] || "";

    setTimeout(() => {
      api.changeNickname(oldNick, threadID, uid);
    }, 1000);
  }
};
