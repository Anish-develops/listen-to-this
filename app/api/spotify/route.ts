// app/api/spotify/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const accessToken = req.cookies.get("spotify_access_token")?.value;

    if (!accessToken) {
        return NextResponse.json(
            { error: "Not authenticated with Spotify" },
            { status: 401 }
        );
    }

    // Example: get top tracks
    const res = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=20",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    const data = await res.json();

    if (!res.ok) {
        console.error(data);
        return NextResponse.json(
            { error: "Failed to fetch Spotify data" },
            { status: 500 }
        );
    }

    // You can pre-process and only send needed fields
    const simplified = data.items.map((track: any) => ({
        name: track.name,
        artists: track.artists.map((a: any) => a.name).join(", "),
        album: track.album.name,
        popularity: track.popularity,
    }));

    return NextResponse.json({ tracks: simplified });
}
