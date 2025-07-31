import {Form, useActionData} from '@remix-run/react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Register'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  const {customerAccount} = context;
  const form = await request.formData();

  const email = String(form.get('email'));
  const password = String(form.get('password'));
  const passwordConfirm = String(form.get('passwordConfirm'));
  const firstName = String(form.get('firstName') || '');
  const lastName = String(form.get('lastName') || '');

  if (password !== passwordConfirm) {
    return {error: 'Passwords do not match'};
  }

  try {
    const {data, errors} = await customerAccount.create({
      email,
      password,
      firstName,
      lastName,
    });

    if (errors?.length) {
      return {error: errors[0].message};
    }

    if (!data?.customerCreate?.customer?.id) {
      return {error: 'Registration failed. Please try again.'};
    }

    return await customerAccount.authorize();
  } catch (error) {
    if (error instanceof Error) {
      return {error: error.message};
    }
    return {error: 'Registration failed. Please try again.'};
  }
}

export default function Register() {
  const actionData = useActionData();

  return (
    <div className="register">
      <h1>Create an Account</h1>
      <Form method="post">
        <fieldset>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-label="First name"
          />
          
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-label="Last name"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            aria-label="Email address"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            aria-label="Password"
            required
            minLength={8}
          />

          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            aria-label="Re-enter password"
            required
            minLength={8}
          />

          <button type="submit">Create Account</button>
        </fieldset>
        {actionData?.error ? (
          <p className="error">{actionData.error}</p>
        ) : null}
      </Form>
      <div className="auth-footer">
        <p>
          Already have an account? <a href="/account/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
