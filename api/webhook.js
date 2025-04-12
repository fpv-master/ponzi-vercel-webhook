export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;

  try {
    console.log('Webhook received');

    const transactions = Array.isArray(body) ? body : [body];
    transactions.forEach(tx => {
      const logs = tx.meta?.logMessages || [];
      const mintInstructions = logs.filter(line =>
        line.includes('InitializeMint') || line.includes('MintTo')
      );

      if (mintInstructions.length > 0) {
        const balances = tx.meta?.postTokenBalances || [];
        balances.forEach(balance => {
          console.log(`[NEW TOKEN DETECTED]: ${balance.mint}`);
        });
      }
    });

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
