// app/dashboard/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface UserProfile {
    name: string;
    image: string | null;
    id: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [roast, setRoast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await fetch("/api/spotify/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch {
            console.error("Failed to fetch user profile");
        }
    };

    const handleRoast = async () => {
        setLoading(true);
        setError(null);
        setRoast(null);

        try {
            const res = await fetch("/api/roast", { method: "POST" });

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server error. Please try again.");
            }

            const data = await res.json();

            if (!res.ok) {
                // If session expired, redirect to login
                if (
                    res.status === 401 ||
                    data.error?.includes("expired") ||
                    data.error?.includes("login")
                ) {
                    window.location.href = "/api/auth/spotify/login";
                    return;
                }
                setError(data.error || "Failed to generate roast");
            } else {
                setRoast(data.roast);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        window.location.href = "/api/auth/logout";
    };

    const handleShare = async () => {
        if (!cardRef.current) return;

        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: "#0a0a0a",
                scale: 2,
            });

            canvas.toBlob((blob: Blob | null) => {
                if (!blob) return;

                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `listen-to-this-roast-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);

                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }, "image/png");
        } catch (err) {
            console.error("Failed to generate share image", err);
        }
    };

    return (
        <main className="min-h-screen bg-linear-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] text-white relative overflow-hidden">
            {/* Header */}
            <header className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-white/10">
                <h1 className="text-2xl font-extrabold bg-linear-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
                    listen-to-this
                </h1>
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3">
                            {user.image && (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    width={36}
                                    height={36}
                                    className="rounded-full border-2 border-[#1DB954]"
                                />
                            )}
                            <span className="text-sm text-gray-400 hidden sm:block">
                                {user.name}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-gray-400 border border-white/20 rounded-full hover:bg-white/5 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-5 py-16 relative z-10">
                {!roast ? (
                    <div className="text-center">
                        {/* Greeting */}
                        <div className="mb-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-3">
                                Hey {user?.name || "there"} 👋
                            </h2>
                            <p className="text-lg text-gray-500">
                                Ready to face the music? (literally)
                            </p>
                        </div>

                        {/* Warning */}
                        <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-3 mb-10">
                            <span className="text-2xl">⚠️</span>
                            <p className="text-red-400 text-sm">
                                Warning: Your ego may not survive this
                            </p>
                        </div>

                        {/* Roast Button */}
                        <div>
                            <button
                                onClick={handleRoast}
                                disabled={loading}
                                className={`inline-flex items-center gap-3 px-12 py-5 text-xl font-bold text-black bg-linear-to-r from-[#1DB954] to-[#1ed760] rounded-full shadow-[0_0_30px_rgba(29,185,84,0.4)] hover:shadow-[0_0_50px_rgba(29,185,84,0.6)] hover:scale-105 transition-all duration-300 ${
                                    loading
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin">🔥</span>
                                        Analyzing your terrible taste...
                                    </>
                                ) : (
                                    <>💀 Roast Me</>
                                )}
                            </button>
                        </div>

                        {error && <p className="mt-6 text-red-400">{error}</p>}
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {/* Shareable Card - using inline styles for html2canvas compatibility */}
                        <div
                            ref={cardRef}
                            style={{
                                width: "100%",
                                maxWidth: "33.6rem",
                                background:
                                    "linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)",
                                borderRadius: "1.8rem",
                                padding: "2.4rem",
                                border: "1px solid rgba(29, 185, 84, 0.3)",
                                boxShadow:
                                    "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(29,185,84,0.1)",
                            }}
                        >
                            {/* Card Header */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "1.25rem",
                                        fontWeight: 800,
                                        color: "#1DB954",
                                    }}
                                >
                                    listen-to-this
                                </span>
                                <span style={{ fontSize: "1.875rem" }}>💀</span>
                            </div>

                            {/* User Section */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                {user?.image && (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            borderRadius: "50%",
                                            border: "3px solid #1DB954",
                                            marginBottom: "0.75rem",
                                        }}
                                    />
                                )}
                                <p
                                    style={{
                                        fontSize: "1.125rem",
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        margin: 0,
                                    }}
                                >
                                    {user?.name || "Anonymous"}&apos;s Roast
                                </p>
                            </div>

                            {/* Roast Text */}
                            <div
                                style={{
                                    background: "rgba(0,0,0,0.3)",
                                    borderRadius: "1.2rem",
                                    padding: "1.8rem",
                                    marginBottom: "1.8rem",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "1.15rem",
                                        lineHeight: 1.8,
                                        color: "#e0e0e0",
                                        margin: 0,
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {roast}
                                </p>
                            </div>

                            {/* Card Footer */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingTop: "1rem",
                                    borderTop:
                                        "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#1DB954",
                                    }}
                                >
                                    listen-to-this.vercel.app
                                </span>
                                <span
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#666666",
                                    }}
                                >
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-7 py-4 text-base font-semibold text-black bg-linear-to-r from-[#1DB954] to-[#1ed760] rounded-full hover:scale-105 transition-all"
                            >
                                {copied ? "✅ Saved!" : "📤 Share / Download"}
                            </button>
                            <button
                                onClick={handleRoast}
                                className="px-7 py-4 text-base font-semibold text-white border-2 border-white/20 rounded-full hover:bg-white/5 transition-all"
                            >
                                🔄 Roast Me Again
                            </button>
                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Share your L with the world 🌍
                        </p>
                    </div>
                )}
            </div>

            {/* Background Emojis */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {["💀", "🔥", "😭", "🎧", "📉"].map((emoji, i) => (
                    <span
                        key={i}
                        className="absolute text-6xl opacity-10 animate-pulse"
                        style={{
                            left: `${10 + i * 20}%`,
                            top: "50%",
                            animationDelay: `${i * 0.3}s`,
                        }}
                    >
                        {emoji}
                    </span>
                ))}
            </div>
        </main>
    );
}
