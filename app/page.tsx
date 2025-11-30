// app/page.tsx

"use client";

import { useState, useEffect } from "react";

const roastPreviews = [
    "\"Your playlist screams 'I peaked in 2012'\" 💀",
    '"Spotify Wrapped? More like Spotify Trapped in bad taste"',
    '"Even the algorithm is embarrassed for you"',
    '"Your music taste has a restraining order against rhythm"',
    '"I\'ve seen better playlists at dentist offices" 🦷',
];

const floatingEmojis = [
    { emoji: "🎧", left: "5%", size: "30px" },
    { emoji: "💀", left: "15%", size: "25px" },
    { emoji: "🔥", left: "25%", size: "35px" },
    { emoji: "😭", left: "35%", size: "28px" },
    { emoji: "🎵", left: "50%", size: "32px" },
    { emoji: "💅", left: "60%", size: "26px" },
    { emoji: "🗑️", left: "70%", size: "30px" },
    { emoji: "📉", left: "80%", size: "28px" },
    { emoji: "🤡", left: "88%", size: "34px" },
    { emoji: "✨", left: "95%", size: "24px" },
];

export default function HomePage() {
    const [currentRoast, setCurrentRoast] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRoast((prev) => (prev + 1) % roastPreviews.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = () => {
        window.location.href = "/api/auth/spotify/login";
    };

    return (
        <main style={styles.main}>
            {/* Floating background emojis */}
            <div style={styles.floatingContainer}>
                {floatingEmojis.map((item, i) => (
                    <span
                        key={i}
                        style={{
                            ...styles.floatingEmoji,
                            left: item.left,
                            animationDelay: `${i * 0.5}s`,
                            fontSize: item.size,
                        }}
                    >
                        {item.emoji}
                    </span>
                ))}
            </div>

            {/* Glitch title */}
            <div style={styles.titleContainer}>
                <h1 style={styles.title} data-text="listen-to-this">
                    <span style={styles.titleGlitch}>listen-to-this</span>
                </h1>
                <p style={styles.subtitle}>...if you dare 👀</p>
            </div>

            {/* Rotating roast preview */}
            <div style={styles.roastPreview}>
                <p style={styles.roastText}>{roastPreviews[currentRoast]}</p>
            </div>

            {/* Main description */}
            <div style={styles.descriptionBox}>
                <h2 style={styles.descHeading}>🎯 What is this?</h2>
                <p style={styles.descText}>
                    Connect your Spotify. We analyze your top tracks.
                    <br />
                    Then our AI{" "}
                    <span style={styles.highlight}>
                        absolutely destroys
                    </span>{" "}
                    your music taste.
                </p>
                <p style={styles.descText}>
                    No sugarcoating. No mercy. Just pure, unfiltered judgment.
                </p>
            </div>

            {/* How it works */}
            <div style={styles.stepsContainer}>
                <div style={styles.step}>
                    <span style={styles.stepEmoji}>🔗</span>
                    <p style={styles.stepText}>Connect Spotify</p>
                    <p style={styles.stepSubtext}>
                        (we promise not to judge... yet)
                    </p>
                </div>
                <div style={styles.stepArrow}>→</div>
                <div style={styles.step}>
                    <span style={styles.stepEmoji}>🔍</span>
                    <p style={styles.stepText}>We Analyze</p>
                    <p style={styles.stepSubtext}>(finding the cringe)</p>
                </div>
                <div style={styles.stepArrow}>→</div>
                <div style={styles.step}>
                    <span style={styles.stepEmoji}>💀</span>
                    <p style={styles.stepText}>Get Roasted</p>
                    <p style={styles.stepSubtext}>(emotionally devastated)</p>
                </div>
            </div>

            {/* CTA Button */}
            <button
                onClick={handleLogin}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    ...styles.ctaButton,
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    boxShadow: isHovered
                        ? "0 0 40px #1DB954, 0 0 80px #1DB95450"
                        : "0 0 20px #1DB95450",
                }}
            >
                <span style={styles.spotifyIcon}>
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                    >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                </span>
                {isHovered ? "Let's see those L's" : "Expose My Spotify"}
            </button>

            {/* Trust badges / Privacy note */}
            <div style={styles.privacyNote}>
                <p style={styles.privacyText}>
                    🔒 chill, we don&apos;t store anything • your embarrassing
                    taste stays between us
                </p>
            </div>

            {/* Footer chaos */}
            <div style={styles.footer}>
                <p style={styles.footerText}>
                    made with 💔 and zero respect for your feelings
                </p>
                <p style={styles.footerDisclaimer}>
                    (not affiliated with Spotify, they have better taste)
                </p>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
                    50% { transform: translateY(-100px) rotate(180deg); opacity: 0.6; }
                }
                @keyframes glitch {
                    0%, 100% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; }
                    25% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; }
                    50% { text-shadow: 2px 2px #ff00ff, -2px -2px #00ffff; }
                    75% { text-shadow: -2px 2px #ff00ff, 2px -2px #00ffff; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}</style>
        </main>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    main: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        color: "#ffffff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
    },
    floatingContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
    },
    floatingEmoji: {
        position: "absolute",
        animation: "float 6s ease-in-out infinite",
        opacity: 0.3,
    },
    titleContainer: {
        textAlign: "center",
        marginBottom: "20px",
        zIndex: 1,
    },
    title: {
        fontSize: "clamp(2.5rem, 8vw, 5rem)",
        fontWeight: 900,
        margin: 0,
        letterSpacing: "-2px",
    },
    titleGlitch: {
        background: "linear-gradient(90deg, #1DB954, #1ed760, #1DB954)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "glitch 0.5s ease-in-out infinite",
        display: "inline-block",
    },
    subtitle: {
        fontSize: "1.5rem",
        color: "#b3b3b3",
        marginTop: "8px",
        fontStyle: "italic",
    },
    roastPreview: {
        background: "rgba(29, 185, 84, 0.1)",
        border: "1px solid #1DB95430",
        borderRadius: "12px",
        padding: "20px 40px",
        marginBottom: "40px",
        maxWidth: "600px",
        minHeight: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    roastText: {
        fontSize: "1.1rem",
        color: "#1DB954",
        textAlign: "center",
        fontStyle: "italic",
        animation: "pulse 3s ease-in-out infinite",
        margin: 0,
    },
    descriptionBox: {
        textAlign: "center",
        maxWidth: "600px",
        marginBottom: "40px",
        zIndex: 1,
    },
    descHeading: {
        fontSize: "1.8rem",
        marginBottom: "16px",
        color: "#ffffff",
    },
    descText: {
        fontSize: "1.1rem",
        lineHeight: 1.6,
        color: "#b3b3b3",
        marginBottom: "12px",
    },
    highlight: {
        color: "#ff4757",
        fontWeight: 700,
        textDecoration: "underline wavy",
    },
    stepsContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "50px",
        flexWrap: "wrap",
        zIndex: 1,
    },
    step: {
        textAlign: "center",
        padding: "20px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        minWidth: "140px",
    },
    stepEmoji: {
        fontSize: "2.5rem",
        display: "block",
        marginBottom: "8px",
    },
    stepText: {
        fontSize: "1rem",
        fontWeight: 600,
        color: "#ffffff",
        margin: "4px 0",
    },
    stepSubtext: {
        fontSize: "0.75rem",
        color: "#666",
        margin: 0,
    },
    stepArrow: {
        fontSize: "2rem",
        color: "#1DB954",
    },
    ctaButton: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "18px 40px",
        fontSize: "1.2rem",
        fontWeight: 700,
        color: "#000000",
        background: "linear-gradient(90deg, #1DB954, #1ed760)",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginBottom: "30px",
        zIndex: 1,
    },
    spotifyIcon: {
        display: "flex",
        alignItems: "center",
    },
    privacyNote: {
        marginBottom: "40px",
        zIndex: 1,
    },
    privacyText: {
        fontSize: "0.9rem",
        color: "#666",
        textAlign: "center",
    },
    footer: {
        marginTop: "auto",
        textAlign: "center",
        paddingTop: "40px",
        zIndex: 1,
    },
    footerText: {
        fontSize: "0.9rem",
        color: "#444",
        marginBottom: "8px",
    },
    footerDisclaimer: {
        fontSize: "0.75rem",
        color: "#333",
    },
};
