// app/api/spotify/me/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const accessToken = req.cookies.get("spotify_access_token")?.value;

    if (!accessToken) {
        return NextResponse.json(
            { error: "Not authenticated with Spotify" },
            { status: 401 }
        );
    }

    const res = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data);
        return NextResponse.json(
            { error: "Failed to fetch user profile" },
            { status: 500 }
        );
    }

    return NextResponse.json({
        name: data.display_name || "Anonymous Listener",
        image: data.images?.[0]?.url || null,
        id: data.id,
    });
}
