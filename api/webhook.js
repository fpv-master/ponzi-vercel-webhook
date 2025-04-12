import axios from "axios";

// �㭪�� ��ࠢ�� ᮮ�饭�� � Telegram
const sendTelegramMessage = async (text) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("? ��� TELEGRAM_BOT_TOKEN ��� TELEGRAM_CHAT_ID.");
      return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });

    console.log("? ����饭�� ��ࠢ���� � Telegram:", response.data);
  } catch (error) {
    console.error("? �訡�� �� ��ࠢ�� � Telegram:", error.message);
  }
};

// �᭮���� ��ࠡ��稪 webhook �� Helius
export default async function handler(req, res) {
  // �ࠧ� �⤠�� �⢥� Helius'�, ���� �᫨ ����� ��-� ᫮������
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // �⤠�� �⢥� ���������� - Helius �� �� �����
  res.status(200).json({ status: "ok" });

  try {
    console.log("?? ����祭 webhook �� Helius");

    const data = req.body;
    const logs = data?.[0]?.meta?.logMessages || [];

    const found = logs.find((msg) =>
      msg.includes("Instruction: InitializeMint")
    );

    if (found) {
      const signature = data?.[0]?.transaction?.signatures?.[0] || "???";
      const message = `?? *���� ⮪�� �����㦥�!*\n\n[������� � Solscan](https://solscan.io/tx/${signature})`;

      console.log("?? �����㦥� InitializeMint:", signature);
      await sendTelegramMessage(message);
    } else {
      console.log("?? � �⮬ webhook ��� InitializeMint");
    }
  } catch (err) {
    console.error("? �訡�� ��ࠡ�⪨ webhook:", err.message);
  }
}
