import { NextResponse } from "next/server";
import crypto from "crypto";
import querystring from "querystring";

const client_id = process.env.CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;

function generateRandomString(length: number) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export async function GET() {
  const state = generateRandomString(16);
  const scope = "user-read-recently-played user-read-email";

  const authUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    });

  return NextResponse.redirect(authUrl);
}
