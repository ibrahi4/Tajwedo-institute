import React from "react";

/**
 * Original illustrations for the offer cards. Pure inline SVG: no image files,
 * no network requests, ~3 KB each. Faceless flat style with mixed skin tones.
 */

type PlanId = "solo" | "pair" | "family";

const SKIN = { light: "#F3CFAE", medium: "#D9A06F", tan: "#B67B4F", deep: "#7D4C30" };
const HAIR = { dark: "#2B1B14", brown: "#5A3825", black: "#171212" };

type Top = "hair-short" | "hair-long" | "hijab" | "kufi";

interface PersonProps {
  x: number;
  y: number;
  s?: number;
  skin: string;
  top: Top;
  cloth: string;
  hair?: string;
  hijab?: string;
}

/** Head centre is (0,0) in local space; body falls below it. */
function Person({ x, y, s = 1, skin, top, cloth, hair = HAIR.dark, hijab = "#F7F1E3" }: PersonProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {top === "hair-long" && (
        <path d="M -15 0 C -17 20 -14 32 -9 36 L 9 36 C 14 32 17 20 15 0 Z" fill={hair} />
      )}
      <path d="M -26 74 C -26 38 -14 24 0 24 C 14 24 26 38 26 74 Z" fill={cloth} />
      {top !== "hijab" && <rect x="-5" y="10" width="10" height="18" rx="4" fill={skin} />}

      {top === "hijab" ? (
        <>
          <path
            d="M 0 -21 C 15 -21 21 -8 20 6 C 19 18 24 26 28 40 C 20 52 -20 52 -28 40 C -24 26 -19 18 -20 6 C -21 -8 -15 -21 0 -21 Z"
            fill={hijab}
          />
          <ellipse cx="0" cy="2" rx="11" ry="13" fill={skin} />
          <path d="M -11 -4 C -6 -10 6 -10 11 -4" fill="none" stroke={hijab} strokeWidth="3" />
        </>
      ) : (
        <circle cx="0" cy="0" r="13" fill={skin} />
      )}

      {top === "hair-short" && (
        <path
          d="M -13.5 1 C -14 -13 -6 -17 0 -17 C 7 -17 14 -13 13.5 1 C 10 -8 4 -9 0 -9 C -4 -9 -10 -8 -13.5 1 Z"
          fill={hair}
        />
      )}
      {top === "hair-long" && (
        <path
          d="M -14 2 C -16 -14 -6 -19 0 -19 C 8 -19 16 -14 14 2 C 11 -6 6 -9 0 -9 C -6 -9 -11 -6 -14 2 Z"
          fill={hair}
        />
      )}
      {top === "kufi" && (
        <>
          <path d="M -12.5 -5 C -12.5 -18 -5 -21 0 -21 C 5 -21 12.5 -18 12.5 -5 Z" fill="#FFFFFF" />
          <path d="M -12.5 -5 L 12.5 -5" stroke="#C8A96E" strokeWidth="2" />
          <path d="M -8 -11 L 8 -11" stroke="#C8A96E" strokeWidth="1" strokeOpacity="0.7" />
        </>
      )}
    </g>
  );
}

const SPARKLE = "M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z";

function Sparkle({ x, y, s = 1, o = 0.8 }: { x: number; y: number; s?: number; o?: number }) {
  return <path d={SPARKLE} transform={`translate(${x} ${y}) scale(${s})`} fill="#E6CF9F" fillOpacity={o} />;
}

/** The "live teacher on screen" tile that tells the story: kids learning online, one-to-one. */
function TeacherTile({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="94" height="64" rx="10" fill="#FFFFFF" fillOpacity="0.96" />
      <rect x="4" y="4" width="86" height="56" rx="7" fill="#DCEFEA" />
      <g>
        <Person x={47} y={30} s={0.5} skin={SKIN.medium} top="hijab" cloth="#0D4F4F" hijab="#0D4F4F" />
      </g>
      <rect x="9" y="9" width="38" height="13" rx="6.5" fill="#E5484D" />
      <circle cx="16" cy="15.5" r="2.4" fill="#FFFFFF" />
      <text x="21" y="19" fontSize="8" fontWeight="700" fill="#FFFFFF" fontFamily="system-ui, sans-serif">
        LIVE
      </text>
    </g>
  );
}

/** Open book (Quran) with gold edging and a ribbon bookmark. */
function Book({ x, y, w = 1 }: { x: number; y: number; w?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${w})`}>
      <path d="M 0 6 C -16 -2 -38 -2 -54 3 L -54 34 C -38 29 -16 29 0 38 Z" fill="#F7F1E3" stroke="#C8A96E" strokeWidth="1.6" />
      <path d="M 0 6 C 16 -2 38 -2 54 3 L 54 34 C 38 29 16 29 0 38 Z" fill="#FBF7EC" stroke="#C8A96E" strokeWidth="1.6" />
      <path d="M -46 11 C -34 8 -18 9 -7 14 M -46 18 C -34 15 -18 16 -7 21 M -46 25 C -34 22 -18 23 -7 28" fill="none" stroke="#C8A96E" strokeWidth="1" strokeOpacity="0.55" />
      <path d="M 46 11 C 34 8 18 9 7 14 M 46 18 C 34 15 18 16 7 21 M 46 25 C 34 22 18 23 7 28" fill="none" stroke="#C8A96E" strokeWidth="1" strokeOpacity="0.55" />
      <path d="M 0 6 L 0 38" stroke="#C8A96E" strokeWidth="1.4" />
      <path d="M 4 36 L 4 49 L 8 45 L 12 49 L 12 38 Z" fill="#E5484D" />
    </g>
  );
}

const BG: Record<PlanId, [string, string]> = {
  solo: ["#0D4F4F", "#1B8079"],
  pair: ["#0B3E4E", "#1A7078"],
  family: ["#0A3B34", "#17705C"],
};

export function OfferArt({ id }: { id: PlanId }) {
  const [c1, c2] = BG[id];
  const g = `bg-${id}`;
  const p = `pat-${id}`;
  const m = `moon-${id}`;

  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <pattern id={p} width="40" height="40" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="1">
            <path d="M 9 9 H 31 V 31 H 9 Z" />
            <path d="M 20 4 L 36 20 L 20 36 L 4 20 Z" />
          </g>
        </pattern>
        <mask id={m}>
          <rect width="40" height="40" x="-20" y="-20" fill="#FFFFFF" />
          <circle cx="7" cy="-5" r="12" fill="#000000" />
        </mask>
      </defs>

      <rect width="320" height="200" fill={`url(#${g})`} />
      <rect width="320" height="200" fill={`url(#${p})`} />

      {/* Mihrab arch */}
      <path
        d="M 92 200 L 92 104 C 92 66 122 44 160 28 C 198 44 228 66 228 104 L 228 200 Z"
        fill="#FFFFFF"
        fillOpacity="0.1"
        stroke="#E6CF9F"
        strokeOpacity="0.75"
        strokeWidth="1.6"
      />
      <path
        d="M 106 200 L 106 106 C 106 74 130 56 160 43 C 190 56 214 74 214 106 L 214 200 Z"
        fill="none"
        stroke="#E6CF9F"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Crescent */}
      <g transform="translate(272 38)">
        <circle r="14" fill="#E6CF9F" mask={`url(#${m})`} />
      </g>

      <Sparkle x={290} y={78} s={0.9} o={0.7} />
      <Sparkle x={246} y={22} s={0.7} o={0.55} />
      <Sparkle x={30} y={104} s={0.8} o={0.6} />
      <Sparkle x={128} y={20} s={0.6} o={0.5} />

      <TeacherTile x={16} y={30} />

      {id === "solo" && (
        <>
          <Person x={180} y={118} s={1.25} skin={SKIN.medium} top="kufi" cloth="#E9B949" />
          <Book x={180} y={158} w={1.05} />
        </>
      )}

      {id === "pair" && (
        <>
          <Person x={140} y={122} s={1.15} skin={SKIN.light} top="hijab" cloth="#E86A5E" hijab="#F7F1E3" />
          <Person x={206} y={124} s={1.1} skin={SKIN.tan} top="kufi" cloth="#5B8DEF" />
          <Book x={172} y={160} w={1.1} />
        </>
      )}

      {id === "family" && (
        <>
          <Person x={96} y={134} s={0.95} skin={SKIN.deep} top="hair-long" hair={HAIR.black} cloth="#7BC8A4" />
          <Person x={254} y={136} s={0.95} skin={SKIN.light} top="kufi" cloth="#F4A7B9" />
          <Person x={172} y={112} s={1.3} skin={SKIN.medium} top="hijab" cloth="#E9B949" hijab="#F7F1E3" />
          <Person x={300} y={150} s={0.78} skin={SKIN.tan} top="hair-short" hair={HAIR.brown} cloth="#5B8DEF" />
          <Book x={172} y={166} w={1.0} />
        </>
      )}
    </svg>
  );
}

export default OfferArt;