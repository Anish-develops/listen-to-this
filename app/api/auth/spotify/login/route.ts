// app/api/auth/spotify/login/route.ts
import { NextResponse } from "next/server";

const scopes = [
    "user-read-recently-played",
    "user-top-read",
    "playlist-read-private",
    "user-library-read",
].join(" ");

export async function GET() {
    const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        scope: scopes,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    });

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    return NextResponse.redirect(spotifyAuthUrl);
}
