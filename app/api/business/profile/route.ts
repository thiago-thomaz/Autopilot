import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const profile = bos.profileService.getProfile();
  return NextResponse.json({ success: true, data: profile });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = bos.profileService.updateProfile(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
