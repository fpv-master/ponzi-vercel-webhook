export default async function handler(req, res) {
  try {
    const body = req.body;

    console.log("?? ����祭 Webhook:");
    console.dir(body, { depth: null });

    const instructions = body?.transaction?.message?.instructions || [];

    for (const ix of instructions) {
      const parsed = ix?.parsed;
      if (!parsed) continue;

      const type = parsed?.type;
      if (type === "initializeTransferFeeConfig") {
        const feeBps = parsed?.info?.transferFeeBasisPoints;

        if (feeBps >= 800 && feeBps <= 1200) {
          const mint = parsed?.info?.mint;
          console.log(`?? �����㦥� �����-⮪��: ${mint} (Fee: ${feeBps / 100}%)`);
        }
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (e) {
    console.error("? �訡�� � ��ࠡ��稪� Webhook:", e);
    res.status(500).json({ error: "internal error" });
  }
}

