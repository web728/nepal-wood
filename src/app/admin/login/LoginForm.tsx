'use client';
import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null as null | { error?: string });
  return (
    <form action={action} className="admin-login__form">
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      {state?.error && <p className="admin-err" role="alert">{state.error}</p>}
      <button className="btn btn--block" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
    </form>
  );
}
