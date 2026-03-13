"use client";

import React from "react";

interface AnimatedExerciseProps {
    exerciseName: string;
    isPlaying?: boolean;
}

/**
 * Maps exercise names to their CSS-animated SVG demonstrations.
 * Each animation is a silhouette stick-figure performing the exercise motion.
 */
export default function AnimatedExercise({ exerciseName, isPlaying = true }: AnimatedExerciseProps) {
    const key = exerciseName.toLowerCase().replace(/\s+/g, "_");
    const animation = EXERCISE_ANIMATIONS[key];

    if (!animation) {
        return (
            <div style={containerStyle}>
                <div style={fallbackStyle}>
                    <span style={{ fontSize: 48 }}>🏋️</span>
                    <span style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 8 }}>{exerciseName}</span>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <svg
                viewBox="0 0 200 200"
                style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: 180,
                    maxHeight: 180,
                }}
            >
                <defs>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--theme-gradient-from)" />
                        <stop offset="100%" stopColor="var(--theme-gradient-to)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <style>{`
          .limb { stroke: url(#bodyGrad); stroke-width: 4; stroke-linecap: round; fill: none; filter: url(#glow); }
          .head { fill: url(#bodyGrad); filter: url(#glow); }
          .floor { stroke: var(--border); stroke-width: 1; opacity: 0.3; }
          ${isPlaying ? animation.css : ""}
        `}</style>
                {/* Floor line */}
                <line className="floor" x1="20" y1="180" x2="180" y2="180" />
                {animation.svg}
            </svg>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio: "1",
    maxWidth: 180,
    maxHeight: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.04)",
    overflow: "hidden",
};

const fallbackStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

interface AnimationDef {
    svg: React.ReactNode;
    css: string;
}

const EXERCISE_ANIMATIONS: Record<string, AnimationDef> = {
    // ===== PUSH UP =====
    push_up: {
        svg: (
            <g id="pushup-figure">
                <circle className="head" cx="50" cy="90" r="10" id="pu-head" />
                <line className="limb" x1="60" y1="95" x2="110" y2="110" id="pu-torso" />
                <line className="limb" x1="110" y1="110" x2="150" y2="115" id="pu-legs" />
                <line className="limb" x1="60" y1="95" x2="55" y2="130" id="pu-arm-l" />
                <line className="limb" x1="80" y1="100" x2="75" y2="130" id="pu-arm-r" />
                {/* Hand dots */}
                <circle className="head" cx="55" cy="132" r="3" />
                <circle className="head" cx="75" cy="132" r="3" />
                <circle className="head" cx="152" cy="117" r="3" />
            </g>
        ),
        css: `
      #pu-head { animation: pu-head-move 1.6s ease-in-out infinite; }
      #pu-torso { animation: pu-torso-move 1.6s ease-in-out infinite; }
      @keyframes pu-head-move {
        0%, 100% { cy: 90; }
        50% { cy: 115; }
      }
      @keyframes pu-torso-move {
        0%, 100% { y1: 95; }
        50% { y1: 120; }
      }
    `,
    },

    // ===== BARBELL BENCH PRESS =====
    barbell_bench_press: {
        svg: (
            <g id="bench-figure">
                {/* Bench */}
                <rect x="40" y="135" width="100" height="8" rx="3" fill="var(--secondary)" />
                <rect x="55" y="143" width="8" height="35" rx="2" fill="var(--border)" />
                <rect x="115" y="143" width="8" height="35" rx="2" fill="var(--border)" />
                {/* Person lying on bench */}
                <circle className="head" cx="50" cy="120" r="10" />
                <line className="limb" x1="60" y1="125" x2="130" y2="130" id="bp-torso" />
                {/* Arms with barbell */}
                <line className="limb" x1="75" y1="125" x2="75" y2="80" id="bp-arm-l" />
                <line className="limb" x1="105" y1="128" x2="105" y2="83" id="bp-arm-r" />
                {/* Barbell */}
                <line className="limb" x1="55" y1="78" x2="125" y2="81" id="bp-bar" strokeWidth={5} />
                <circle className="head" cx="50" cy="78" r="7" />
                <circle className="head" cx="130" cy="81" r="7" />
            </g>
        ),
        css: `
      #bp-arm-l, #bp-arm-r, #bp-bar {
        animation: bp-press 1.8s ease-in-out infinite;
      }
      @keyframes bp-press {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(30px); }
      }
    `,
    },

    // ===== BARBELL SQUAT =====
    barbell_squat: {
        svg: (
            <g id="squat-figure">
                <circle className="head" cx="100" cy="40" r="10" id="sq-head" />
                <line className="limb" x1="100" y1="50" x2="100" y2="100" id="sq-torso" />
                <line className="limb" x1="100" y1="100" x2="80" y2="150" id="sq-leg-l" />
                <line className="limb" x1="100" y1="100" x2="120" y2="150" id="sq-leg-r" />
                <line className="limb" x1="80" y1="150" x2="75" y2="175" id="sq-shin-l" />
                <line className="limb" x1="120" y1="150" x2="125" y2="175" id="sq-shin-r" />
                {/* Barbell on shoulders */}
                <line className="limb" x1="60" y1="55" x2="140" y2="55" id="sq-bar" strokeWidth={5} />
                <circle className="head" cx="55" cy="55" r="7" />
                <circle className="head" cx="145" cy="55" r="7" />
                {/* Feet */}
                <circle className="head" cx="73" cy="177" r="3" />
                <circle className="head" cx="127" cy="177" r="3" />
            </g>
        ),
        css: `
      #squat-figure {
        animation: squat-move 2s ease-in-out infinite;
        transform-origin: 100px 175px;
      }
      @keyframes squat-move {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(0.75); }
      }
    `,
    },

    // ===== PULL UPS =====
    pull_ups: {
        svg: (
            <g id="pullup-figure">
                {/* Bar */}
                <line className="limb" x1="40" y1="30" x2="160" y2="30" strokeWidth={6} />
                {/* Figure */}
                <circle className="head" cx="100" cy="55" r="10" id="pull-head" />
                <line className="limb" x1="100" y1="65" x2="100" y2="120" id="pull-torso" />
                <line className="limb" x1="100" y1="65" x2="75" y2="32" id="pull-arm-l" />
                <line className="limb" x1="100" y1="65" x2="125" y2="32" id="pull-arm-r" />
                <line className="limb" x1="100" y1="120" x2="85" y2="160" id="pull-leg-l" />
                <line className="limb" x1="100" y1="120" x2="115" y2="160" id="pull-leg-r" />
            </g>
        ),
        css: `
      #pullup-figure {
        animation: pullup-move 1.8s ease-in-out infinite;
      }
      @keyframes pullup-move {
        0%, 100% { transform: translateY(30px); }
        50% { transform: translateY(0px); }
      }
    `,
    },

    // ===== PLANK =====
    plank: {
        svg: (
            <g id="plank-figure">
                <circle className="head" cx="45" cy="108" r="10" />
                <line className="limb" x1="55" y1="113" x2="140" y2="118" />
                <line className="limb" x1="140" y1="118" x2="165" y2="120" />
                <line className="limb" x1="55" y1="113" x2="50" y2="145" />
                <line className="limb" x1="65" y1="115" x2="60" y2="145" />
                <circle className="head" cx="50" cy="147" r="3" />
                <circle className="head" cx="60" cy="147" r="3" />
                <circle className="head" cx="167" cy="122" r="3" />
                {/* Pulse aura */}
                <ellipse cx="100" cy="125" rx="70" ry="12" fill="none" stroke="var(--theme-glow)" strokeWidth="0.5" opacity="0.3" id="plank-aura" />
            </g>
        ),
        css: `
      #plank-aura { animation: plank-pulse 1.5s ease-in-out infinite; }
      @keyframes plank-pulse {
        0%, 100% { opacity: 0.1; rx: 65; }
        50% { opacity: 0.4; rx: 75; }
      }
    `,
    },

    // ===== DUMBBELL CURL =====
    dumbbell_curl: {
        svg: (
            <g id="curl-figure">
                <circle className="head" cx="100" cy="35" r="10" />
                <line className="limb" x1="100" y1="45" x2="100" y2="110" />
                <line className="limb" x1="100" y1="110" x2="85" y2="165" />
                <line className="limb" x1="100" y1="110" x2="115" y2="165" />
                {/* Left arm (stationary) */}
                <line className="limb" x1="100" y1="60" x2="75" y2="100" />
                {/* Right arm (curling) */}
                <line className="limb" x1="100" y1="60" x2="130" y2="85" id="curl-upper" />
                <line className="limb" x1="130" y1="85" x2="125" y2="65" id="curl-forearm" />
                {/* Dumbbell */}
                <rect x="120" y="58" width="15" height="6" rx="2" fill="url(#bodyGrad)" id="curl-weight" />
                <circle className="head" cx="85" cy="175" r="3" />
                <circle className="head" cx="115" cy="175" r="3" />
            </g>
        ),
        css: `
      #curl-forearm, #curl-weight {
        animation: curl-move 1.4s ease-in-out infinite;
      }
      @keyframes curl-move {
        0%, 100% { transform: rotate(0deg); transform-origin: 130px 85px; }
        50% { transform: rotate(-60deg); transform-origin: 130px 85px; }
      }
    `,
    },

    // ===== WALKING LUNGES =====
    walking_lunges: {
        svg: (
            <g id="lunge-figure">
                <circle className="head" cx="100" cy="40" r="10" id="lu-head" />
                <line className="limb" x1="100" y1="50" x2="100" y2="105" id="lu-torso" />
                {/* Front leg */}
                <line className="limb" x1="100" y1="105" x2="65" y2="145" id="lu-leg-f" />
                <line className="limb" x1="65" y1="145" x2="60" y2="175" id="lu-shin-f" />
                {/* Back leg */}
                <line className="limb" x1="100" y1="105" x2="140" y2="140" id="lu-leg-b" />
                <line className="limb" x1="140" y1="140" x2="150" y2="170" id="lu-shin-b" />
                <circle className="head" cx="58" cy="177" r="3" />
                <circle className="head" cx="152" cy="172" r="3" />
            </g>
        ),
        css: `
      #lunge-figure {
        animation: lunge-bob 1.8s ease-in-out infinite;
      }
      @keyframes lunge-bob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(15px); }
      }
    `,
    },

    // ===== LATERAL RAISE =====
    lateral_raise: {
        svg: (
            <g id="lateral-figure">
                <circle className="head" cx="100" cy="35" r="10" />
                <line className="limb" x1="100" y1="45" x2="100" y2="110" />
                <line className="limb" x1="100" y1="110" x2="85" y2="170" />
                <line className="limb" x1="100" y1="110" x2="115" y2="170" />
                {/* Arms */}
                <line className="limb" x1="100" y1="60" x2="60" y2="100" id="lat-arm-l" />
                <line className="limb" x1="100" y1="60" x2="140" y2="100" id="lat-arm-r" />
                {/* Dumbbells */}
                <rect x="52" y="97" width="12" height="5" rx="2" fill="url(#bodyGrad)" id="lat-wt-l" />
                <rect x="136" y="97" width="12" height="5" rx="2" fill="url(#bodyGrad)" id="lat-wt-r" />
                <circle className="head" cx="85" cy="175" r="3" />
                <circle className="head" cx="115" cy="175" r="3" />
            </g>
        ),
        css: `
      #lat-arm-l, #lat-wt-l {
        animation: lat-raise-l 1.6s ease-in-out infinite;
        transform-origin: 100px 60px;
      }
      #lat-arm-r, #lat-wt-r {
        animation: lat-raise-r 1.6s ease-in-out infinite;
        transform-origin: 100px 60px;
      }
      @keyframes lat-raise-l {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-40deg); }
      }
      @keyframes lat-raise-r {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(40deg); }
      }
    `,
    },

    // ===== BICYCLE CRUNCH =====
    bicycle_crunch: {
        svg: (
            <g id="crunch-figure">
                {/* Lying figure */}
                <circle className="head" cx="55" cy="105" r="10" id="cr-head" />
                <line className="limb" x1="65" y1="110" x2="120" y2="125" id="cr-torso" />
                {/* Legs cycling */}
                <line className="limb" x1="120" y1="125" x2="100" y2="100" id="cr-leg-l" />
                <line className="limb" x1="120" y1="125" x2="155" y2="140" id="cr-leg-r" />
                {/* Hands behind head */}
                <line className="limb" x1="55" y1="100" x2="65" y2="85" />
            </g>
        ),
        css: `
      #cr-head { animation: crunch-head 1.2s ease-in-out infinite; }
      #cr-leg-l { animation: crunch-leg-l 1.2s ease-in-out infinite; }
      @keyframes crunch-head {
        0%, 100% { cx: 55; cy: 105; }
        50% { cx: 70; cy: 95; }
      }
      @keyframes crunch-leg-l {
        0%, 100% { x2: 100; y2: 100; }
        50% { x2: 85; y2: 90; }
      }
    `,
    },

    // ===== RUSSIAN TWIST =====
    russian_twist: {
        svg: (
            <g id="twist-figure">
                <circle className="head" cx="100" cy="65" r="10" />
                <line className="limb" x1="100" y1="75" x2="100" y2="125" />
                {/* Legs (bent, seated) */}
                <line className="limb" x1="100" y1="125" x2="75" y2="155" />
                <line className="limb" x1="100" y1="125" x2="125" y2="155" />
                <line className="limb" x1="75" y1="155" x2="80" y2="175" />
                <line className="limb" x1="125" y1="155" x2="120" y2="175" />
                {/* Arms twisting */}
                <line className="limb" x1="100" y1="90" x2="65" y2="95" id="tw-arm-l" />
                <line className="limb" x1="100" y1="90" x2="135" y2="95" id="tw-arm-r" />
            </g>
        ),
        css: `
      #tw-arm-l, #tw-arm-r {
        animation: twist-arms 1.4s ease-in-out infinite;
        transform-origin: 100px 90px;
      }
      @keyframes twist-arms {
        0%, 100% { transform: rotate(-25deg); }
        50% { transform: rotate(25deg); }
      }
    `,
    },

    // ===== LEG PRESS =====
    leg_press: {
        svg: (
            <g id="legpress-figure">
                {/* Machine sled */}
                <rect x="100" y="60" width="60" height="10" rx="3" fill="var(--secondary)" id="lp-sled" />
                {/* Person reclined */}
                <circle className="head" cx="45" cy="110" r="10" />
                <line className="limb" x1="55" y1="115" x2="80" y2="130" />
                {/* Legs pushing */}
                <line className="limb" x1="80" y1="130" x2="100" y2="100" id="lp-thigh" />
                <line className="limb" x1="100" y1="100" x2="110" y2="72" id="lp-shin" />
            </g>
        ),
        css: `
      #lp-sled { animation: lp-push 1.8s ease-in-out infinite; }
      #lp-shin { animation: lp-leg 1.8s ease-in-out infinite; }
      @keyframes lp-push {
        0%, 100% { y: 60; }
        50% { y: 40; }
      }
      @keyframes lp-leg {
        0%, 100% { x2: 110; y2: 72; }
        50% { x2: 115; y2: 52; }
      }
    `,
    },

    // ===== Generic strength exercise (reused for several) =====
    dumbbell_shoulder_press: {
        svg: (
            <g id="shoulder-press">
                <circle className="head" cx="100" cy="40" r="10" />
                <line className="limb" x1="100" y1="50" x2="100" y2="115" />
                <line className="limb" x1="100" y1="115" x2="85" y2="170" />
                <line className="limb" x1="100" y1="115" x2="115" y2="170" />
                <line className="limb" x1="100" y1="60" x2="65" y2="40" id="sp-arm-l" />
                <line className="limb" x1="100" y1="60" x2="135" y2="40" id="sp-arm-r" />
                <rect x="58" y="33" width="12" height="6" rx="2" fill="url(#bodyGrad)" id="sp-wt-l" />
                <rect x="130" y="33" width="12" height="6" rx="2" fill="url(#bodyGrad)" id="sp-wt-r" />
            </g>
        ),
        css: `
      #sp-arm-l, #sp-wt-l { animation: sp-press-l 1.6s ease-in-out infinite; transform-origin: 100px 60px; }
      #sp-arm-r, #sp-wt-r { animation: sp-press-r 1.6s ease-in-out infinite; transform-origin: 100px 60px; }
      @keyframes sp-press-l {
        0%, 100% { transform: rotate(20deg); }
        50% { transform: rotate(-10deg); }
      }
      @keyframes sp-press-r {
        0%, 100% { transform: rotate(-20deg); }
        50% { transform: rotate(10deg); }
      }
    `,
    },

    // ===== ROMANIAN DEADLIFT =====
    romanian_deadlift: {
        svg: (
            <g id="rdl-figure">
                <circle className="head" cx="100" cy="40" r="10" id="rdl-head" />
                <line className="limb" x1="100" y1="50" x2="100" y2="105" id="rdl-torso" />
                <line className="limb" x1="100" y1="105" x2="90" y2="160" />
                <line className="limb" x1="100" y1="105" x2="110" y2="160" />
                <line className="limb" x1="100" y1="80" x2="95" y2="115" id="rdl-arm-l" />
                <line className="limb" x1="100" y1="80" x2="105" y2="115" id="rdl-arm-r" />
                {/* Barbell */}
                <line className="limb" x1="75" y1="115" x2="125" y2="115" id="rdl-bar" strokeWidth={4} />
            </g>
        ),
        css: `
      #rdl-figure {
        animation: rdl-bend 2s ease-in-out infinite;
        transform-origin: 100px 105px;
      }
      @keyframes rdl-bend {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(45deg); }
      }
    `,
    },

    // ===== HANGING LEG RAISE =====
    hanging_leg_raise: {
        svg: (
            <g id="hlr-figure">
                <line className="limb" x1="60" y1="20" x2="140" y2="20" strokeWidth={6} />
                <circle className="head" cx="100" cy="40" r="10" />
                <line className="limb" x1="100" y1="50" x2="100" y2="100" />
                <line className="limb" x1="100" y1="50" x2="80" y2="22" />
                <line className="limb" x1="100" y1="50" x2="120" y2="22" />
                <line className="limb" x1="100" y1="100" x2="90" y2="150" id="hlr-leg-l" />
                <line className="limb" x1="100" y1="100" x2="110" y2="150" id="hlr-leg-r" />
            </g>
        ),
        css: `
      #hlr-leg-l, #hlr-leg-r {
        animation: hlr-raise 1.8s ease-in-out infinite;
        transform-origin: 100px 100px;
      }
      @keyframes hlr-raise {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(-70deg); }
      }
    `,
    },
};

// Create aliases for exercises that share similar movement patterns
EXERCISE_ANIMATIONS["incline_dumbbell_press"] = EXERCISE_ANIMATIONS["barbell_bench_press"];
EXERCISE_ANIMATIONS["chest_dips"] = EXERCISE_ANIMATIONS["push_up"];
EXERCISE_ANIMATIONS["cable_fly"] = EXERCISE_ANIMATIONS["lateral_raise"];
EXERCISE_ANIMATIONS["lat_pulldown"] = EXERCISE_ANIMATIONS["pull_ups"];
EXERCISE_ANIMATIONS["barbell_bent_row"] = EXERCISE_ANIMATIONS["romanian_deadlift"];
EXERCISE_ANIMATIONS["seated_cable_row"] = EXERCISE_ANIMATIONS["barbell_bent_row"];
EXERCISE_ANIMATIONS["hammer_curl"] = EXERCISE_ANIMATIONS["dumbbell_curl"];
EXERCISE_ANIMATIONS["tricep_pushdown"] = EXERCISE_ANIMATIONS["dumbbell_curl"];
EXERCISE_ANIMATIONS["overhead_tricep_extension"] = EXERCISE_ANIMATIONS["dumbbell_shoulder_press"];
EXERCISE_ANIMATIONS["arnold_press"] = EXERCISE_ANIMATIONS["dumbbell_shoulder_press"];
EXERCISE_ANIMATIONS["rear_delt_fly"] = EXERCISE_ANIMATIONS["lateral_raise"];
