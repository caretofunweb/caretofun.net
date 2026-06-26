/**
 * GitHub OAuth — Callback Handler
 *
 * This Cloudflare Pages Function handles the OAuth callback from GitHub.
 * It exchanges the authorization code for an access token, then passes
 * the token back to the Decap CMS window via postMessage.
 *
 * SETUP:
 * Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET as environment variables
 * in Cloudflare Pages dashboard.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('OAuth environment variables not configured', {
      status: 500,
    });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(`OAuth error: ${tokenData.error_description}`, {
        status: 400,
      });
    }

    // Build the postMessage script that sends the token to the CMS window
    const content = `
<!DOCTYPE html>
<html>
  <head><title>OAuth Callback</title></head>
  <body>
    <script>
      (function() {
        function receiveMessage(e) {
          console.log("receiveMessage %o", e);
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({
              token: tokenData.access_token,
              provider: 'github',
            })}',
            e.origin
          );
          window.removeEventListener("message", receiveMessage, false);
          window.close();
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
    <p>Completing authentication...</p>
  </body>
</html>`;

    return new Response(content, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  } catch (error) {
    return new Response(`Authentication failed: ${error.message}`, {
      status: 500,
    });
  }
}
