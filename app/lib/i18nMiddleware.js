import {AppSession} from '~/lib/session';
import {storefrontRedirect} from '@shopify/hydrogen';

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'];
const DEFAULT_LANGUAGE = 'en';

export function i18nMiddleware() {
  return async (req, res, next) => {
    // Skip middleware for static files
    if (req.path.startsWith('/build/') || 
        req.path.startsWith('/assets/') ||
        req.path.startsWith('/favicon.ico')) {
      return next();
    }

    const session = await getSession(req.headers.cookie);
    const urlLang = req.path.split('/')[1];
    let language = DEFAULT_LANGUAGE;

    // Check URL for valid language code
    if (SUPPORTED_LANGUAGES.includes(urlLang)) {
      language = urlLang;
    } 
    // Check session for saved language preference
    else if (session.has('language')) {
      language = session.get('language');
    }
    // Fallback to Accept-Language header
    else {
      const acceptLanguage = req.headers['accept-language'];
      if (acceptLanguage) {
        const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
        if (SUPPORTED_LANGUAGES.includes(preferredLang)) {
          language = preferredLang;
        }
      }
    }

    // If URL doesn't match detected language, redirect
    if (!req.path.startsWith(`/${language}/`) && 
        !['/_data', '/_image'].some(p => req.path.startsWith(p))) {
      const newPath = `/${language}${req.path === '/' ? '' : req.path}`;
      return res.redirect(302, newPath);
    }

    // Store language in session and locals
    session.set('language', language);
    res.locals.language = language;
    res.setHeader('Set-Cookie', await commitSession(session));

    next();
  };
}

export async function handleI18n(request, env, executionContext) {
  const session = await AppSession.init(request, [env.SESSION_SECRET]);
  const url = new URL(request.url);
  const urlLang = url.pathname.split('/')[1];
  let language = DEFAULT_LANGUAGE;

  // Check URL for valid language code
  if (SUPPORTED_LANGUAGES.includes(urlLang)) {
    language = urlLang;
  }
  // Check session for saved language preference
  else if (session.has('language')) {
    language = session.get('language');
  }
  // Fallback to Accept-Language header
  else {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
      if (SUPPORTED_LANGUAGES.includes(preferredLang)) {
        language = preferredLang;
      }
    }
  }

  // For now, skip redirect to avoid storefront issues during development
  // TODO: Implement proper i18n routing after storefront is configured
  /*
  if (!url.pathname.startsWith(`/${language}/`) &&
      !['/_data', '/_image'].some(p => url.pathname.startsWith(p))) {
    const newUrl = new URL(url);
    newUrl.pathname = `/${language}${url.pathname === '/' ? '' : url.pathname}`;
    return storefrontRedirect({
      request,
      response: new Response(null, {status: 302}),
      storefront: env.storefront,
      redirectTo: newUrl.toString(),
    });
  }
  */

  // Store language in session
  session.set('language', language);
  const cookie = await session.commit();

  return {language, cookie};
}