if (!global.attackIntervals) global.attackIntervals = {};

module.exports = {
  config: {
    name: "attack",
    version: "1.0",
    role: 2,
    author: "You + ChatGPT",
    description: "Continuous auto message attack until stopped",
    category: "UTILITY",
    usages: "attack on | attack off",
    cooldowns: 5
  },

  onStart: async function ({ message, event, args }) {
    const threadID = event.threadID;
    const action = args[0]?.toLowerCase();

    const messages = [
      "Antaba mo zaf",
      "Botchog zaf",
      "antaba mo",
      "wala ka mama"
    ];

    const BETWEEN_MSG_DELAY_MS = 5000; // adjust if gusto mo mas mabilis

    // 🛑 OFF — HINTO LANG PAG IKAW NAG-SABI
    if (action === "off") {
      if (global.attackIntervals[threadID]) {
        clearInterval(global.attackIntervals[threadID]);
        delete global.attackIntervals[threadID];
      }
      return; // silent
    }

    // ▶️ ON
    if (action === "on") {
      if (global.attackIntervals[threadID]) return; // already running

      let msgIndex = 0;

      const interval = setInterval(async () => {
        try {
          await message.send(messages[msgIndex]);
          msgIndex++;

          if (msgIndex >= messages.length) {
            msgIndex = 0; // loop forever
          }
        } catch (err) {
          // ❗ kahit mag-error, tuloy pa rin hangga't di mo sinasabi off
        }
      }, BETWEEN_MSG_DELAY_MS);

      global.attackIntervals[threadID] = interval;
      return; // silent
    }
  },

  onBotKicked: async function ({ event, threadID }) {
    // Trigger the "off" action when the bot is kicked
    if (global.attackIntervals[threadID]) {
      clearInterval(global.attackIntervals[threadID]);
      delete global.attackIntervals[threadID];
    }
  }
};
