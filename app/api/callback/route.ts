import { NextRequest, NextResponse } from "next/server";

const client_id = process.env.CLIENT_ID || "";
const client_secret = process.env.CLIENT_SECRET || "";
const redirect_uri = process.env.REDIRECT_URI || "";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const state = req.nextUrl.searchParams.get("state");

  if (error) {
    console.error("Error during Spotify authorization:", error);
    return NextResponse.json(
      { error: "Authorization failed. Please try again." },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error exchanging code for token:", errorData);
      return NextResponse.json(
        { error: "Failed to exchange code for token" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in } = data;

    console.log("Access Token:", access_token);
    console.log("Refresh Token:", refresh_token);
    console.log("Expires In:", expires_in);

    // TODO: Save access_token, refresh_token, and expiration time in the database along with the user's email or Spotify ID.

    return NextResponse.redirect(`/home?access_token=${access_token}`);
  } catch (error) {
    console.error("Error in /api/callback route:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
