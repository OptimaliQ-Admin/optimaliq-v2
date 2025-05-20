import { NextResponse } from 'next/server';
import { checkAndCreateAssessmentReminders } from '@/lib/notifications/assessmentReminders';

export async function POST(req: Request) {
  try {
    // Verify the request is authorized (you should implement proper authentication)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    // Add your token verification logic here
    // if (!isValidToken(token)) {
    //   return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    // }

    // Process assessment reminders
    await checkAndCreateAssessmentReminders();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing assessment reminders:', error);
    return NextResponse.json(
      { error: 'Failed to process assessment reminders' },
      { status: 500 }
    );
  }
} 