import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import LoginForm from './LoginForm';
import '../admin.css';

export const metadata = { title: 'Admin login', robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin');
  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <img src="/brand/logo-12th-edition.svg" alt="Nepal Wood International Expo" width={160} height={70} />
        <h1>Team dashboard</h1>
        <p>Registrations, stand enquiries and gate check-in.</p>
        <LoginForm />
      </div>
    </main>
  );
}
