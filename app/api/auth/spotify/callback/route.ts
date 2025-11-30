// app/api/auth/spotify/callback/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    });

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
        console.error(tokenData);
        return NextResponse.json(
            { error: "Token exchange failed" },
            { status: 500 }
        );
    }

    const { access_token, refresh_token } = tokenData;

    // Store tokens in cookies (simplest approach for now)
    const response = NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    );

    response.cookies.set("spotify_access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60, // 1 hour
    });

    response.cookies.set("spotify_refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
}
