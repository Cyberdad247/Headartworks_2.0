import {Form, useActionData} from '@remix-run/react';

export function LoginForm() {
  const actionData = useActionData();

  return (
    <div className="login-form">
      <Form method="post" action="/account/login">
        <fieldset>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-label="Email address"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-label="Password"
            required
            minLength={8}
          />
          <button type="submit">Sign In</button>
        </fieldset>
        {actionData?.error ? (
          <p className="error">{actionData.error}</p>
        ) : null}
      </Form>
      <div className="login-footer">
        <p>
          Don't have an account?{' '}
          <a href="/account/register">Create one</a>
        </p>
        <p>
          <a href="/account/recover">Forgot password?</a>
        </p>
      </div>
    </div>
  );
}
