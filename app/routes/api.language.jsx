import {json} from '@shopify/remix-oxygen';
import {getSession, commitSession} from '~/lib/session';

export async function action({request, context}) {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const language = formData.get('language');

  session.set('language', language);
  return json(null, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}