import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/LoginForm';
import { isAuthenticated } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  if (isAuthenticated()) redirect('/admin/');
  return <LoginForm />;
}
