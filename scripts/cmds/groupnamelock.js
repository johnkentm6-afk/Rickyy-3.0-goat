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

    // OFF - Unlock group name
    if (args[0] === "off") {
      await threadsData.set(threadID, { enable: false }, "groupNameLock");
      return api.sendMessage("🔓 Group name lock disabled.", threadID);
    }

    // INVALID - If the command is not 'on'
    if (args[0] !== "on") {
      return api.sendMessage(
        "Usage: groupnamelock on <name>",
        threadID
      );
    }

    // NAME - Get the group name to lock
    const lockName = args.slice(1).join(" ").trim();
    if (!lockName) {
      return api.sendMessage(
        "❌ Please provide a group name.",
        threadID
      );
    }

    // CHANGE NAME (TRYING TO AUTO-DETECT SUPPORTED METHODS)
    await changeGroupName(api, lockName, threadID);

    // SAVE LOCKED NAME TO DATABASE
    await threadsData.set(threadID, {
      enable: true,
      name: lockName
    }, "groupNameLock");

    // CONFIRMATION MESSAGE
    api.sendMessage(
      `🔒 Group name locked to: ${lockName}`,
      threadID
    );
  },

  onEvent: async function ({ api, event, threadsData }) {
    if (event.logMessageType !== "log:thread-name") return;

    const threadID = event.threadID;
    const lockData = await threadsData.get(threadID, "groupNameLock");

    if (!lockData?.enable || !lockData.name) return;

    // RE-LOCK THE NAME IF CHANGES ARE DETECTED
    await changeGroupName(api, lockData.name, threadID);
  }
};

// 🔧 UNIVERSAL GROUP NAME CHANGER WITH ERROR HANDLING
async function changeGroupName(api, name, threadID) {
  try {
    // Log available methods for debugging purposes
    console.log("Available API methods:", Object.keys(api));

    // Check for different methods to change the group name
    if (typeof api.setThreadName === "function") {
      console.log("Using setThreadName method");
      return api.setThreadName(name, threadID);
    }

    if (typeof api.setTitle === "function") {
      console.log("Using setTitle method");
      return api.setTitle(name, threadID);
    }

    if (typeof api.changeThreadName === "function") {
      console.log("Using changeThreadName method");
      return api.changeThreadName(name, threadID);
    }

    // If no method is supported, throw an error with a helpful message
    throw new Error("No supported method to change group name. Please check the API documentation.");
  } catch (error) {
    console.error(`Error in changeGroupName: ${error.message}`);
    // Notify the user if there's an issue
    api.sendMessage(
      `❌ Failed to lock the group name: ${error.message}`,
      threadID
    );
  }
}
