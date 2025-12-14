let attackInterval = null;

const messages = [
  "Antaba mo ?",
  "Botchog ka? "
];

function handleCommand(command, sendMessage) {
  if (command === "&attack") {
    if (attackInterval) {
      sendMessage("⚠️ Attack already running");
      return;
    }

    sendMessage("🔥 Attack started");

    let msgIndex = 0;

    attackInterval = setInterval(() => {
      sendMessage(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    }, 1000); // 1 second delay
  }

  if (command === "&stop") {
    if (!attackInterval) {
      sendMessage("⚠️ No active attack");
      return;
    }

    clearInterval(attackInterval);
    attackInterval = null;
    sendMessage("🛑 Attack stopped");
  }
}

module.exports = handleCommand;
