import axios from "axios";

// �㭪�� ��ࠢ�� ᮮ�饭�� � Telegram
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
    console.error("�訡�� �� ��ࠢ�� � Telegram:", error.message);
  }
};

// �᭮���� ��ࠡ��稪 ����㪠
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Webhook received");

  const data = req.body;

  try {
    const logs = data?.[0]?.meta?.logMessages || [];

    // �饬 �������� ᮧ����� ⮪���
    const detected = logs.find((msg) =>
      msg.includes("Instruction: InitializeMint")
    );

    if (detected) {
      const signature = data?.[0]?.transaction?.signatures?.[0] || "�������⭮";
      const link = `https://solscan.io/tx/${signature}`;

      const message = `?? *���� ⮪�� �����㦥�!*\n\n[��ᬮ���� � Solscan](${link})`;
      console.log("NEW TOKEN DETECTED:", signature);

      await sendTelegramMessage(message);
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
