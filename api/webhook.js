import axios from "axios";

// Отправка сообщения в Telegram
const sendTelegramMessage = async (text) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("? Отсутствует TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID в переменных окружения.");
      return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    });

    console.log("? Уведомление отправлено:", response.data);
  } catch (error) {
    console.error("? Ошибка при отправке в Telegram:", error.message);
  }
};

// Обработчик POST-запроса
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("?? Получен webhook от Helius");

  const data = req.body;

  try {
    const logs = data?.[0]?.meta?.logMessages || [];
    const detected = logs.find((msg) =>
      msg.includes("Instruction: InitializeMint")
    );

    if (detected) {
      const signature = data?.[0]?.transaction?.signatures?.[0] || "???";
      const message = `?? *Новый токен обнаружен!*\n\n[Смотреть в Solscan](https://solscan.io/tx/${signature})`;

      console.log("?? Обнаружен InitializeMint:", signature);
      await sendTelegramMessage(message);
    } else {
      console.log("?? Нет инициализации токена в этом webhook.");
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("? Ошибка в обработке webhook:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
