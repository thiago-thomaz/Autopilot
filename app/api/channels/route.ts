import { NextResponse } from 'next/server';

export async function GET() {
  const channels = [
    { name: 'Instagram', code: 'INSTAGRAM', category: 'Core', autoPublish: true },
    { name: 'Facebook Pages', code: 'FACEBOOK_PAGES', category: 'Core', autoPublish: true },
    { name: 'TikTok', code: 'TIKTOK', category: 'Secondary', autoPublish: true },
    { name: 'YouTube', code: 'YOUTUBE', category: 'Core', autoPublish: true },
    { name: 'YouTube Shorts', code: 'YOUTUBE_SHORTS', category: 'Core', autoPublish: true },
    { name: 'Pinterest', code: 'PINTEREST', category: 'Core', autoPublish: true },
    { name: 'X (Twitter)', code: 'X', category: 'Core', autoPublish: true },
    { name: 'Threads', code: 'THREADS', category: 'Core', autoPublish: true },
    { name: 'WhatsApp', code: 'WHATSAPP', category: 'Core', autoPublish: true },
    { name: 'Telegram', code: 'TELEGRAM', category: 'Core', autoPublish: true },
    { name: 'Snapchat', code: 'SNAPCHAT', category: 'Secondary', autoPublish: true },
    { name: 'LinkedIn Pages', code: 'LINKEDIN_PAGES', category: 'Secondary', autoPublish: true },
    { name: 'Google Business Profile', code: 'GOOGLE_BUSINESS_PROFILE', category: 'Secondary', autoPublish: true },
    { name: 'Reddit', code: 'REDDIT', category: 'Secondary', autoPublish: false, note: 'MANUAL_REQUIRED' },
    { name: 'Discord', code: 'DISCORD', category: 'Secondary', autoPublish: true },
    { name: 'Blog (WordPress/Custom)', code: 'BLOG', category: 'Core', autoPublish: true },
    { name: 'E-mail Marketing', code: 'EMAIL', category: 'Core', autoPublish: true },
    { name: 'Web Push', code: 'WEB_PUSH', category: 'Core', autoPublish: true },
    { name: 'RSS Feed', code: 'RSS', category: 'Core', autoPublish: true },
    { name: 'Site Próprio (Own Website)', code: 'OWN_WEBSITE', category: 'Core', autoPublish: true },
  ];

  return NextResponse.json({ success: true, count: channels.length, channels });
}
