import { NextResponse } from 'next/server';

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    return NextResponse.json({ success: false, error: "Missing ENV variables" });
  }

  try {
    const endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = { chat_id: chatId, text: "Teste interno da API na Vercel/Coolify" };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json({ success: true, token: botToken.substring(0,5) + '...', chatId, telegramResponse: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}
