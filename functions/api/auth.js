/**
 * GitHub OAuth — Authorization Redirect
 *
 * This Cloudflare Pages Function redirects users to GitHub's OAuth
 * authorization page. It's the first step in the OAuth flow used by
 * Decap CMS to authenticate editors.
 *
 * SETUP:
 * Set GITHUB_CLIENT_ID as an environment variable in Cloudflare Pages dashboard.
 */
export async function onRequest(context) {
  const clientId = context.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response('GITHUB_CLIENT_ID environment variable not set', {
      status: 500,
    });
  }

  // Build the callback URL from the current request
  const callbackUrl = new URL('/api/callback', context.request.url).toString();

  // Redirect to GitHub OAuth authorization
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('redirect_uri', callbackUrl);

  return Response.redirect(authUrl.toString(), 301);
}
