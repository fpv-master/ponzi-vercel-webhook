export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ status: "ok" });
  }

  try {
    const body = req.body;

    console.log("?? ����祭 Webhook �� Helius");
    console.log(JSON.stringify(body, null, 2));

    // ��� ��砫� ���� �����㥬 �� POST-������
    return res.status(200).json({ status: "received" });
  } catch (err) {
    console.error("? �訡�� ��ࠡ�⪨ webhook:", err);
    return res.status(500).json({ error: "internal server error" });
  }
}
