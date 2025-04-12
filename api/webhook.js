const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).json({ status: "ok" });
  }

  console.log("Webhook received");

  const transactions = req.body;

  if (!Array.isArray(transactions)) {
    console.error("Invalid webhook format: expected an array");
    return res.status(400).json({ error: "Invalid data format" });
  }

  try {
    for (const tx of transactions) {
      const instructions =
        tx?.transaction?.message?.instructions || [];

      for (const ix of instructions) {
        const data = ix?.parsed?.info;

        if (
          ix?.parsed?.type === "initializeMint" &&
          data?.mint
        ) {
          const mint = data.mint;
          const solscanUrl = `https://solscan.io/token/${mint}`;

          const message = `?? *®¢ë© â®ª¥­ ®¡­ àã¦¥­!*\n\nMint: \`${mint}\`\n[‘¬®âà¥âì ¢ Solscan](${solscanUrl})`;

          await sendTelegramMessage(message);

          console.log(`[NEW TOKEN DETECTED]: ${mint}`);
        }
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ===========================
// ”“Š–ˆŸ „‹Ÿ Ž’€‚Šˆ ‚ TELEGRAM
// ===========================

const sendTelegramMessage = async (text) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("Žè¨¡ª  ¯à¨ ®â¯à ¢ª¥ ¢ Telegram:", error.message);
  }
};
