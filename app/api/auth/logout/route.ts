// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/`
    );

    // Clear the Spotify tokens
    response.cookies.set("spotify_access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });

    response.cookies.set("spotify_refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });

    return response;
}

export async function GET() {
    // Also support GET for simple link-based logout
    return POST();
}
