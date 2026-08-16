// app/auth/callback/route.ts

// NextResponse lets the server send an HTTP redirect response
import { NextResponse } from 'next/server';

// Supabase uses these cookies to store the authenticated session
import { cookies } from 'next/headers';

// Creates a Supabase server client that has access to the
// request's cookies.
//
// This is important because the OAuth session needs to be
// stored in the user's cookies so that future requests know
// that the user is authenticated.
import { createClient } from '@/lib/supabase/server';

// This GET handler runs when the OAuth provider redirects the
// browser back to this route.
//
// Example:
// Google → /auth/callback?code=abc123
export async function GET(request: Request) {

  // Parse the callback URL.
  //
  // "origin" gives us the base URL of the application:
  // http://localhost:3000
  //
  // "searchParams" lets us read query parameters such as:
  // ?code=abc123
  const { searchParams, origin } = new URL(request.url);


  // Retrieve the authorization code that Supabase/Google
  // sent back after the user successfully authenticated.
  //
  // This code is temporary and must be exchanged for a
  // real Supabase session.
  const code = searchParams.get('code');


  // Only continue if an authorization code was actually
  // returned by the OAuth provider.
  if (code) {

    // Get the current request's cookie store.
    //
    // Supabase will use this to create/update the authentication
    // session cookies for the browser.
    const cookieStore = await cookies();


    // Create a Supabase server client using the user's cookies.
    const supabase = createClient(cookieStore);


    // Exchange the temporary OAuth authorization code
    // for an actual Supabase authentication session.
    //
    // If successful, Supabase sets the necessary session
    // information in the cookies through the server client.
    const { error } = await supabase.auth.exchangeCodeForSession(code);


    // If there was no error, authentication was successful.
    if (!error) {

      // Redirect the authenticated user to the dashboard.
      //
      // Example:
      // http://localhost:3000/auth/callback
      //                     ↓
      // http://localhost:3000/dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }


  // If:
  // - no authorization code was provided, OR
  // - exchanging the code for a session failed
  //
  // redirect the user back to the sign-in page with an
  // error query parameter.
  //
  // The sign-in page can use this parameter to display
  // an authentication failure message.
  return NextResponse.redirect(
    `${origin}/signin?error=auth_callback_failed`
  );
}