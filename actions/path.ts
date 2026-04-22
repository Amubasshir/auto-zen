'use server';

import { auth } from '@/auth';
import { dbConnect } from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { revalidatePath } from 'next/cache';

export async function updatePathType(pathType: 'no-code' | 'developer') {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  await dbConnect();
  await User.findByIdAndUpdate(session.user.id, { pathType });
  revalidatePath('/dashboard', 'layout');
  return { success: true };
}
