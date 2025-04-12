import axios from "axios";

// Функция отправки сообщений в Telegram
const sendTelegramMessage = async (text) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("? Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID.");
      return;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await axios.post(url, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });

    console.log("? Сообщение отправлено в Telegram:", response.data);
  } catch (error) {
    console.error("? Ошибка при отправке в Telegram:", error.message);
  }
};

// Основной обработчик webhook от Helius
export default async function handler(req, res) {
  // Сразу отдаем ответ Helius'у, даже если дальше что-то сломается
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Отдаем ответ немедленно - Helius не любит ждать
  res.status(200).json({ status: "ok" });

  try {
    console.log("?? Получен webhook от Helius");

    const data = req.body;
    const logs = data?.[0]?.meta?.logMessages || [];

    const found = logs.find((msg) =>
      msg.includes("Instruction: InitializeMint")
    );

    if (found) {
      const signature = data?.[0]?.transaction?.signatures?.[0] || "???";
      const message = `?? *Новый токен обнаружен!*\n\n[Смотреть в Solscan](https://solscan.io/tx/${signature})`;

      console.log("?? Обнаружен InitializeMint:", signature);
      await sendTelegramMessage(message);
    } else {
      console.log("?? В этом webhook нет InitializeMint");
    }
  } catch (err) {
    console.error("? Ошибка обработки webhook:", err.message);
  }
}
