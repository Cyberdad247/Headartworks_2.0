import {json} from '@shopify/remix-oxygen';
import {AppSession} from '~/lib/session';

export async function action({request, context}) {
  const session = await AppSession.init(request, [context.env.SESSION_SECRET]);
  const formData = await request.formData();
  const language = formData.get('language');

  session.set('language', language);
  return json(null, {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}
