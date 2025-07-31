import {json} from '@shopify/remix-oxygen';
import {Form, useActionData} from '@remix-run/react';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return json({});
}

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  const {customerAccount} = context;
  const form = await request.formData();
  const email = String(form.get('email'));

  try {
    await customerAccount.recoveryEmailToken(email);
    return json({resetRequested: true, email});
  } catch (error) {
    if (error instanceof Error) {
      return json({error: error.message, resetRequested: false});
    }
    return json({error: 'An error occurred', resetRequested: false});
  }
}

export default function RecoverPassword() {
  const actionData = useActionData();

  return (
    <div className="account-recover">
      <h1>Recover Password</h1>
      <p>
        Enter your email to receive password reset instructions. You will receive an
        email if an account exists for this address.
      </p>
      {actionData?.resetRequested ? (
        <p className="success">
          If an account exists for {actionData?.email}, you will receive an email
          with instructions on how to reset your password in a few minutes.
        </p>
      ) : (
        <Form method="post">
          <fieldset>
            <label htmlFor="email">Email</label>
            <input
              aria-label="Email address"
              autoComplete="email"
              autoFocus
              id="email"
              name="email"
              placeholder="Email address"
              required
              type="email"
            />
          </fieldset>
          <button type="submit">Request Reset Link</button>
          {actionData?.error ? (
            <p className="error">{actionData.error}</p>
          ) : null}
        </Form>
      )}
      <div className="auth-footer">
        <p>
          <a href="/account/login">Back to Sign in</a>
        </p>
      </div>
    </div>
  );
}
