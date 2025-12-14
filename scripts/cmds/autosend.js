if (!global.autoSendIntervals) global.autoSendIntervals = {};

module.exports = {
  config: {
    name: "autosend",
    version: "1.1",
    role: 0,
    author: "You + ChatGPT",
    description: "Auto send messages with start/stop trigger",
    category: "UTILITY",
    usages: "autosend start | autosend stop",
    cooldowns: 3
  },

  onStart: async function ({ message, event, args }) {
    const threadID = event.threadID;
    const action = args[0]?.toLowerCase();

    const messages = [
      "Antaba mo zaf",
      "Botchog zaf"
    ];

    const START_DELAY_MS = 5000;      // 5 seconds before start
    const BETWEEN_MSG_DELAY_MS = 5000; // 5 seconds per message
    const LOOPS = 5;

    // 🛑 STOP
    if (action === "stop") {
      if (global.autoSendIntervals[threadID]) {
        clearInterval(global.autoSendIntervals[threadID]);
        delete global.autoSendIntervals[threadID];
      }
      return; // silent
    }

    // ▶️ START
    if (action === "start") {
      if (global.autoSendIntervals[threadID]) return; // already running

      let loopCount = 0;
      let msgIndex = 0;

      // delay before starting
      setTimeout(() => {
        const interval = setInterval(async () => {
          try {
            await message.send(messages[msgIndex]);
            msgIndex++;

            if (msgIndex >= messages.length) {
              msgIndex = 0;
              loopCount++;
            }

            // stop after loops finished
            if (loopCount >= LOOPS) {
              clearInterval(interval);
              delete global.autoSendIntervals[threadID];
            }
          } catch (e) {
            clearInterval(interval);
            delete global.autoSendIntervals[threadID];
          }
        }, BETWEEN_MSG_DELAY_MS);

        global.autoSendIntervals[threadID] = interval;
      }, START_DELAY_MS);

      return; // silent
    }
  }
};
