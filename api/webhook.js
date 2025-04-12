export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ status: "ok" });
  }

  try {
    const body = req.body;

    console.log("?? Получен Webhook от Helius");
    console.log(JSON.stringify(body, null, 2));

    // Для начала просто логируем все POST-запросы
    return res.status(200).json({ status: "received" });
  } catch (err) {
    console.error("? Ошибка обработки webhook:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}
