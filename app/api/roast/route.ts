// app/api/roast/route.ts
import { NextRequest, NextResponse } from "next/server";

interface SpotifyTrack {
    name: string;
    artists: string;
    album: string;
    popularity: number;
}

export async function POST(req: NextRequest) {
    try {
        // Get access token from cookies directly instead of making another HTTP call
        const accessToken = req.cookies.get("spotify_access_token")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: "Not authenticated with Spotify" },
                { status: 401 }
            );
        }

        // Fetch Spotify top tracks directly
        const tracks = await getSpotifyTopTracks(accessToken);

        if (!tracks || tracks.length === 0) {
            return NextResponse.json(
                { error: "No tracks found. Listen to more music first!" },
                { status: 400 }
            );
        }

        // Build prompt and get roast
        const prompt = buildRoastPrompt(tracks);
        const roast = await getRoastFromGoogle(prompt);

        return NextResponse.json({ roast });
    } catch (err) {
        console.error("Roast error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unexpected error" },
            { status: 500 }
        );
    }
}

// Fetch top tracks from Spotify API
async function getSpotifyTopTracks(
    accessToken: string
): Promise<SpotifyTrack[]> {
    const res = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!res.ok) {
        const error = await res.json();
        console.error("Spotify API error:", error);
        throw new Error("Failed to fetch Spotify data");
    }

    const data = await res.json();

    return data.items.map((track: Record<string, unknown>) => ({
        name: track.name as string,
        artists: (track.artists as Array<{ name: string }>)
            .map((a) => a.name)
            .join(", "),
        album: (track.album as { name: string }).name,
        popularity: track.popularity as number,
    }));
}

// Build the roast prompt
function buildRoastPrompt(tracks: SpotifyTrack[]): string {
    const list = tracks
        .map(
            (t, i) =>
                `${i + 1}. "${t.name}" by ${t.artists} (popularity: ${
                    t.popularity
                }/100)`
        )
        .join("\n");

    return `You are a savage, witty comedian who roasts people's music taste.

Here are this person's top 20 Spotify tracks:
${list}

Based on their music taste, write a brutal but funny roast in 3-5 sentences. make the roast in hinglish.
these are indian songs.and indian users.    
Be creative, reference specific songs/artists from their list, and make it personal.
Keep it playful and not actually mean or offensive.`;
}

// Call Google Gemini API
async function getRoastFromGoogle(prompt: string): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error("Google API key not configured");
    }

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 300,
                },
            }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        console.error("Gemini API error:", data);
        throw new Error("Failed to generate roast");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("Empty response from AI");
    }

    return text.trim();
}
