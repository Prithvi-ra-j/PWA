import React, { useEffect, useMemo, useState } from "react";

const PERSONA = [
  "He walks into a room and people notice — not because he announced himself, but because something about him is settled.",
  "He has read things, made things, trained his body, and thought seriously about how to live. You can feel it.",
  "He is not the loudest. He is the most interesting.",
  "He is unshakeable — not cold, but rooted. Nothing rattles him because he has already sat with hard questions alone.",
  "He finishes what he starts. This, above all, is what separates him from who he was.",
];

const GOALS = [
  {
    domain: "Body",
    label: "Track I",
    color: "#c1442c",
    icon: "⚔",
    start: "Inconsistent. Some activity but no real structure.",
    end: "A man who trains. It shows.",
    targets: [
      { text: "Train 4x per week for 90 consecutive days", metric: "90 days" },
      { text: "Complete one defined physical benchmark — 50 consecutive push-ups or a 10K run", metric: "1 feat" },
      { text: "Begin a combative discipline — first class attended", metric: "1 class" },
      { text: "Cold exposure or breathwork 5 mornings per week for 60 days", metric: "60 days" },
    ],
    proof: "Someone who hasn't seen you in 6 months notices without you mentioning it.",
    fear: "This one compounds slowly — but it's the one everyone else can see. Do not skip it because the mirror lies in month one.",
  },
  {
    domain: "Philosophy",
    label: "Track II",
    color: "#4a7ba6",
    icon: "∞",
    start: "Rarely reads books. Tech/work narrow.",
    end: "A man with a worldview he built himself.",
    targets: [
      { text: "Complete 6 books cover to cover before December 31", metric: "6 books" },
      { text: "Fill 40+ pages of the physical commonplace book", metric: "40 pages" },
      { text: "Write your own 10-entry Meditations — your actual beliefs", metric: "10 entries" },
      { text: "Speak for 5 minutes on Stoicism without notes — to anyone", metric: "1 moment" },
    ],
    proof: "Someone disagrees with you and instead of going quiet, you have something real to say. And you say it without aggression.",
    fear: "You will read slowly at first. That is correct. One paragraph of Meditations understood is worth ten chapters skimmed.",
  },
  {
    domain: "Art",
    label: "Track III",
    color: "#d99a2b",
    icon: "◈",
    start: "Dormant since school. Nothing made since.",
    end: "A man who has finished something and put it in the world.",
    targets: [
      { text: "Fill one sketchbook — any quality, any subject", metric: "1 sketchbook" },
      { text: "Study 4 masters by copying their work by hand — one per month", metric: "4 masters" },
      { text: "Produce one finished creative piece and share it publicly", metric: "1 piece" },
      { text: "20-minute drawing session every Thursday without exception", metric: "Every Thu" },
    ],
    proof: "You made something. It exists. You showed it to someone. That is more than 95% of people who say they are creative.",
    fear: "The first things you make will be bad. This is not a problem — it is the price of entry. The sketchbook is private. Fill it badly.",
  },
  {
    domain: "History & Strategy",
    label: "Track IV",
    color: "#4f8a5f",
    icon: "♟",
    start: "Untouched. No real strategic reading.",
    end: "A man who reads situations others cannot see.",
    targets: [
      { text: "Read one complete biography of a historical figure", metric: "1 biography" },
      { text: "Read The 48 Laws of Power — find 3 laws active in your own life right now", metric: "3 laws" },
      { text: "Write a one-page strategic analysis of a decision you made this year", metric: "1 page" },
      { text: "Identify the historical pattern in one current event per month", metric: "4 patterns" },
    ],
    proof: "A situation unfolds around you — at work, in a relationship, anywhere — and you see the shape of it before others do. You say nothing. You act correctly.",
    fear: "History feels slow and remote. Make it personal — always ask: what would I have done? That question makes every chapter alive.",
  },
];

const MILESTONES = [
  {
    period: "Now → Sep 30",
    label: "Foundation",
    color: "#c1442c",
    tasks: [
      "Buy the notebook. Label it. Today.",
      "Begin training 4x/week. Miss nothing in the first 30 days.",
      "Read Meditations — 10 pages per session, 3x per week.",
      "Draw for 20 minutes every Thursday.",
      "Start 48 Laws of Power.",
    ],
  },
  {
    period: "Oct → Nov 30",
    label: "Production",
    color: "#d99a2b",
    tasks: [
      "Physical benchmark attempt — 10K or 50 push-ups.",
      "Complete your first biography (Caesar or Napoleon).",
      "Finish the sketchbook.",
      "Write your 10-entry personal Meditations.",
      "Identify your finished creative piece and begin it.",
    ],
  },
  {
    period: "Dec → Dec 31",
    label: "Proof",
    color: "#4f8a5f",
    tasks: [
      "Share your creative piece. Publicly. No excuses.",
      "Write your strategic self-analysis — one honest page.",
      "Count your books. Count your training days. Count your notebook pages.",
      "Speak about Stoicism — to one person, for five minutes.",
      "Write one paragraph: who were you in August? Who are you now?",
    ],
  },
];

const THEMES = {
  light: {
    pageBg: "#f7f3ec",
    pageText: "#1c1916",
    muted: "#7a7065",
    headerBg: "#1c1916",
    headerText: "#f7f3ec",
    border: "rgba(28,25,22,0.12)",
    borderSoft: "rgba(28,25,22,0.10)",
    borderFaint: "rgba(28,25,22,0.07)",
    subtleBg: "rgba(28,25,22,0.04)",
    subtleBg2: "rgba(28,25,22,0.035)",
    checkboxBorder: "rgba(28,25,22,0.2)",
    checkboxBorder2: "rgba(28,25,22,0.22)",
    invertBg: "#1c1916",
    invertText: "#f7f3ec",
    invertMuted80: "rgba(247,243,236,0.8)",
    invertMuted85: "rgba(247,243,236,0.85)",
    invertMuted50: "rgba(247,243,236,0.5)",
    invertDivider: "rgba(247,243,236,0.1)",
    trackBg: "rgba(247,243,236,0.1)",
    trackBg2: "rgba(247,243,236,0.12)",
    tabInactive: "#7a7065",
  },
  dark: {
    pageBg: "#141210",
    pageText: "#f1ece2",
    muted: "#9d9border" === "" ? "" : "#a39a8c",
    headerBg: "#0b0a08",
    headerText: "#f1ece2",
    border: "rgba(241,236,226,0.14)",
    borderSoft: "rgba(241,236,226,0.12)",
    borderFaint: "rgba(241,236,226,0.09)",
    subtleBg: "rgba(241,236,226,0.05)",
    subtleBg2: "rgba(241,236,226,0.04)",
    checkboxBorder: "rgba(241,236,226,0.25)",
    checkboxBorder2: "rgba(241,236,226,0.28)",
    invertBg: "#000000",
    invertText: "#f1ece2",
    invertMuted80: "rgba(241,236,226,0.8)",
    invertMuted85: "rgba(241,236,226,0.85)",
    invertMuted50: "rgba(241,236,226,0.55)",
    invertDivider: "rgba(241,236,226,0.12)",
    trackBg: "rgba(241,236,226,0.12)",
    trackBg2: "rgba(241,236,226,0.14)",
    tabInactive: "#8a8175",
  },
};
// fix stray artifact from templating above
THEMES.dark.muted = "#a39a8c";

const ACCENT = "#c4821a";

export default function App() {
  const [expanded, setExpanded] = useState(null);
  // NOTE: localStorage/sessionStorage are not available inside Claude.ai artifacts,
  // so state below lives in memory for the session instead of persisting across reloads.
  const [checked, setChecked] = useState({});
  const [mChecked, setMChecked] = useState({});
  const [daily, setDaily] = useState({});
  const [tab, setTab] = useState("daily"); // "daily" | "goals" | "milestones" | "persona"
  const [dark, setDark] = useState(false);

  const t = dark ? THEMES.dark : THEMES.light;
  const todayKey = new Date().toISOString().slice(0, 10);

  function toggle(id) { setChecked(s => ({ ...s, [id]: !s[id] })); }
  function mToggle(id) { setMChecked(s => ({ ...s, [id]: !s[id] })); }
  function dailyToggle(id) {
    setDaily(s => ({ ...s, [todayKey]: { ...(s[todayKey] || {}), [id]: !s[todayKey]?.[id] } }));
  }

  const totalTargets = GOALS.reduce((a, g) => a + g.targets.length, 0);
  const doneTargets = Object.values(checked).filter(Boolean).length;

  const dailyItems = useMemo(() => [
    { id: "body", domain: "BODY", icon: "⚔", color: "#c1442c", text: "Train / complete today's physical work" },
    { id: "philosophy", domain: "PHILOSOPHY", icon: "∞", color: "#4a7ba6", text: "Read 10 pages or write in your commonplace book" },
    { id: "art", domain: "ART", icon: "◈", color: "#d99a2b", text: "20-minute drawing session — Thursday focus" },
    { id: "history", domain: "HISTORY & STRATEGY", icon: "♟", color: "#4f8a5f", text: "Read / study history or The 48 Laws of Power" },
  ], []);

  const todayDaily = daily[todayKey] || {};
  const dailyDone = dailyItems.filter(x => todayDaily[x.id]).length;

  return (
    <div style={{ background:t.pageBg, minHeight:"100vh", minHeight:"100dvh", fontFamily:"Georgia, serif", color:t.pageText, paddingBottom:"env(safe-area-inset-bottom)", transition:"background 0.2s, color 0.2s" }}>

      {/* HEADER */}
      <div style={{ background:t.headerBg, padding:"1rem 1.5rem", transition:"background 0.2s" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.5rem" }}>
          <span style={{ fontFamily:"monospace", fontSize:"0.58rem", letterSpacing:"0.3em", color:t.headerText, textTransform:"uppercase" }}>
            Prithvi · Year End Goals · 2026
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:"0.85rem" }}>
            <span style={{ fontFamily:"monospace", fontSize:"0.58rem", color:ACCENT, letterSpacing:"0.1em" }}>
              {tab === "daily" ? `${dailyDone}/${dailyItems.length} today` : `${doneTargets}/${totalTargets} targets`}
            </span>
            <button
              onClick={() => setDark(d => !d)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                width:26, height:26, borderRadius:"50%",
                border:`1px solid rgba(247,243,236,0.25)`,
                background:"transparent", color:t.headerText,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.8rem", padding:0, lineHeight:1,
              }}
            >
              {dark ? "☀" : "☾"}
            </button>
          </div>
        </div>
        {/* progress bar */}
        <div style={{ marginTop:"0.75rem", height:2, background:t.trackBg, borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(doneTargets/totalTargets)*100}%`, background:ACCENT, transition:"width 0.4s", borderRadius:2 }} />
        </div>
      </div>

      {/* TABS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", borderBottom:`2px solid ${t.headerBg}` }}>
        {[["daily","Today"],["goals","Goals"],["milestones","Timeline"],["persona","The Man"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding:"0.7rem 0.5rem",
            background: tab === v ? t.headerBg : "transparent",
            color: tab === v ? t.headerText : t.tabInactive,
            border:"none", cursor:"pointer",
            fontFamily:"monospace", fontSize:"0.55rem", letterSpacing:"0.2em", textTransform:"uppercase",
            transition:"all 0.2s",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ maxWidth:560, margin:"0 auto", padding:"1.5rem" }}>

        {/* ══ DAILY TAB ══ */}
        {tab === "daily" && <>
          <div style={{ marginBottom:"1.5rem" }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.52rem", letterSpacing:"0.25em", color:ACCENT, textTransform:"uppercase", marginBottom:"0.5rem" }}>
              Today · {new Date().toLocaleDateString(undefined, { weekday:"long", month:"short", day:"numeric" })}
            </div>
            <div style={{ fontSize:"2rem", fontWeight:900, lineHeight:1, marginBottom:"0.5rem" }}>Do the work.</div>
            <p style={{ fontSize:"0.85rem", fontStyle:"italic", color:t.muted, lineHeight:1.6 }}>
              Four small wins. Then you're done.
            </p>
          </div>

          <div style={{ marginBottom:"1.25rem", background:t.invertBg, color:t.invertText, padding:"1rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"monospace", fontSize:"0.55rem", letterSpacing:"0.12em" }}>
              <span>DAILY SCORE</span><span>{dailyDone}/{dailyItems.length}</span>
            </div>
            <div style={{ marginTop:"0.65rem", height:4, background:t.trackBg2, borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${dailyItems.length ? (dailyDone/dailyItems.length)*100 : 0}%`, background:ACCENT, transition:"width .25s" }} />
            </div>
          </div>

          {dailyItems.map(item => {
            const done = !!todayDaily[item.id];
            return (
              <div key={item.id} onClick={() => dailyToggle(item.id)} style={{
                borderLeft:`4px solid ${item.color}`,
                borderTop:`1px solid ${t.borderSoft}`,
                borderRight:`1px solid ${t.borderSoft}`,
                borderBottom:`1px solid ${t.borderSoft}`,
                padding:"1rem",
                marginBottom:"0.7rem",
                display:"grid",
                gridTemplateColumns:"auto 1fr",
                gap:"0.85rem",
                alignItems:"center",
                cursor:"pointer",
                background: done ? t.subtleBg2 : "transparent",
              }}>
                <div style={{
                  width:24, height:24, border:`2px solid ${done ? item.color : t.checkboxBorder2}`,
                  borderRadius:4, background:done ? item.color : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center"
                }}>
                  {done && <span style={{ color:"white", fontSize:"0.75rem" }}>✓</span>}
                </div>
                <div>
                  <div style={{ fontFamily:"monospace", fontSize:"0.48rem", letterSpacing:"0.18em", color:item.color, marginBottom:"0.25rem" }}>
                    {item.icon} · {item.domain}
                  </div>
                  <div style={{ fontSize:"0.92rem", lineHeight:1.5, textDecoration:done ? "line-through" : "none", color:done ? t.muted : t.pageText }}>
                    {item.text}
                  </div>
                </div>
              </div>
            );
          })}

          <button onClick={() => setTab("goals")} style={{
            width:"100%", padding:"0.85rem", marginTop:"0.4rem",
            background:"transparent", border:`1px solid ${t.border}`, color:t.pageText,
            fontFamily:"monospace", fontSize:"0.55rem", letterSpacing:"0.15em",
            textTransform:"uppercase", cursor:"pointer"
          }}>
            Open full goals →
          </button>
        </>}

        {/* ══ GOALS TAB ══ */}
        {tab === "goals" && <>
          <div style={{ marginBottom:"1.5rem", padding:"1rem", background:t.subtleBg, borderLeft:`3px solid ${ACCENT}` }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.25em", color:ACCENT, textTransform:"uppercase", marginBottom:"0.4rem" }}>Your Starting Point</div>
            <p style={{ fontSize:"0.85rem", fontStyle:"italic", color:t.muted, lineHeight:1.7 }}>
              August 17, 2026. Inconsistent body. Creative dormant since school. Rarely reads. Narrowly specialized at work. <strong style={{ fontStyle:"normal", color:t.pageText }}>135 days until December 31.</strong>
            </p>
          </div>

          {/* FEAR CALLOUT */}
          <div style={{ marginBottom:"1.75rem", padding:"1rem 1.1rem", background:t.invertBg, color:t.invertText }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.25em", color:ACCENT, textTransform:"uppercase", marginBottom:"0.4rem" }}>Your Real Fear</div>
            <p style={{ fontSize:"0.88rem", lineHeight:1.7, color:t.invertMuted80 }}>
              Spreading too thin and mastering nothing. The antidote is not doing less — it is <em>rotating deliberately</em>. One domain per morning. Every domain gets its day. Depth accumulates in each lane separately. This is how you get all four without losing any.
            </p>
          </div>

          {GOALS.map((g, gi) => {
            const isOpen = expanded === gi;
            const doneCt = g.targets.filter((_, ti) => checked[`${gi}-${ti}`]).length;
            return (
              <div key={gi} style={{ marginBottom:"0.75rem", border:`1px solid ${isOpen ? g.color : t.border}`, borderLeft:`4px solid ${g.color}`, overflow:"hidden" }}>
                {/* Card header */}
                <div onClick={() => setExpanded(isOpen ? null : gi)} style={{ padding:"1.1rem", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"1rem" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.25em", color:g.color, textTransform:"uppercase", marginBottom:"0.25rem" }}>
                      {g.label} · {g.domain}
                    </div>
                    <div style={{ fontWeight:700, fontSize:"1rem", marginBottom:"0.25rem" }}>
                      {g.end}
                    </div>
                    <div style={{ fontFamily:"monospace", fontSize:"0.52rem", color:t.muted }}>
                      {doneCt}/{g.targets.length} targets checked
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flexShrink:0 }}>
                    {/* mini progress */}
                    <div style={{ display:"flex", gap:3 }}>
                      {g.targets.map((_, ti) => (
                        <div key={ti} style={{ width:6, height:6, borderRadius:"50%", background: checked[`${gi}-${ti}`] ? g.color : t.checkboxBorder }} />
                      ))}
                    </div>
                    <span style={{ fontFamily:"monospace", color:t.muted, fontSize:"1rem", transform: isOpen ? "rotate(90deg)" : "none", transition:"transform 0.2s" }}>›</span>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ borderTop:`1px solid ${t.borderFaint}`, padding:"0 1.1rem 1.1rem" }}>
                    <div style={{ marginTop:"1rem", marginBottom:"1rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem", fontSize:"0.78rem" }}>
                      <div style={{ padding:"0.6rem", background:t.subtleBg }}>
                        <div style={{ fontFamily:"monospace", fontSize:"0.48rem", letterSpacing:"0.15em", color:t.muted, marginBottom:"0.25rem" }}>WHERE YOU START</div>
                        <div style={{ fontStyle:"italic", color:t.muted }}>{g.start}</div>
                      </div>
                      <div style={{ padding:"0.6rem", background:`rgba(${hexRgb(g.color)}, ${dark ? 0.12 : 0.05})` }}>
                        <div style={{ fontFamily:"monospace", fontSize:"0.48rem", letterSpacing:"0.15em", color:g.color, marginBottom:"0.25rem" }}>WHERE YOU END</div>
                        <div style={{ fontStyle:"italic", color:t.pageText }}>{g.end}</div>
                      </div>
                    </div>

                    <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.2em", color:t.muted, textTransform:"uppercase", marginBottom:"0.75rem" }}>Specific Targets</div>
                    {g.targets.map((tg, ti) => {
                      const key = `${gi}-${ti}`;
                      return (
                        <div key={ti} onClick={() => toggle(key)} style={{
                          display:"grid", gridTemplateColumns:"auto 1fr auto",
                          gap:"0.75rem", padding:"0.75rem 0",
                          borderBottom:`1px solid ${t.borderFaint}`,
                          cursor:"pointer", alignItems:"start",
                        }}>
                          <div style={{
                            width:18, height:18, flexShrink:0,
                            border:`2px solid ${checked[key] ? g.color : t.checkboxBorder}`,
                            borderRadius:3,
                            background: checked[key] ? g.color : "transparent",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            transition:"all 0.2s", marginTop:1,
                          }}>
                            {checked[key] && <span style={{ color:"white", fontSize:"0.58rem" }}>✓</span>}
                          </div>
                          <span style={{ fontSize:"0.88rem", lineHeight:1.6, textDecoration: checked[key] ? "line-through" : "none", color: checked[key] ? t.muted : t.pageText }}>
                            {tg.text}
                          </span>
                          <span style={{ fontFamily:"monospace", fontSize:"0.5rem", color:g.color, letterSpacing:"0.08em", whiteSpace:"nowrap", paddingTop:2 }}>
                            {tg.metric}
                          </span>
                        </div>
                      );
                    })}

                    <div style={{ marginTop:"1rem", padding:"0.85rem", background:t.subtleBg, borderLeft:`2px solid ${g.color}` }}>
                      <div style={{ fontFamily:"monospace", fontSize:"0.48rem", letterSpacing:"0.15em", color:g.color, marginBottom:"0.3rem", textTransform:"uppercase" }}>How You'll Know</div>
                      <p style={{ fontSize:"0.82rem", fontStyle:"italic", color:t.muted, lineHeight:1.65 }}>{g.proof}</p>
                    </div>

                    <div style={{ marginTop:"0.75rem", padding:"0.85rem", background:t.subtleBg }}>
                      <div style={{ fontFamily:"monospace", fontSize:"0.48rem", letterSpacing:"0.15em", color:t.muted, marginBottom:"0.3rem", textTransform:"uppercase" }}>Watch Out For</div>
                      <p style={{ fontSize:"0.82rem", fontStyle:"italic", color:t.muted, lineHeight:1.65 }}>{g.fear}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>}

        {/* ══ MILESTONES TAB ══ */}
        {tab === "milestones" && <>
          <div style={{ marginBottom:"1.5rem" }}>
            <div style={{ fontSize:"1.5rem", fontWeight:900, fontStyle:"italic", lineHeight:1.1, marginBottom:"0.5rem" }}>135 Days.</div>
            <p style={{ fontSize:"0.88rem", fontStyle:"italic", color:t.muted, lineHeight:1.7 }}>
              Not enough time to become a different person. Exactly enough time to prove to yourself that you can.
            </p>
          </div>

          {MILESTONES.map((m, mi) => (
            <div key={mi} style={{ marginBottom:"1.5rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1rem", paddingBottom:"0.75rem", borderBottom:`2px solid ${m.color}` }}>
                <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.2em", color:m.color, textTransform:"uppercase" }}>{m.period}</div>
                <div style={{ fontSize:"1rem", fontWeight:700 }}>{m.label}</div>
              </div>
              {m.tasks.map((task, ti) => {
                const key = `m-${mi}-${ti}`;
                return (
                  <div key={ti} onClick={() => mToggle(key)} style={{
                    display:"grid", gridTemplateColumns:"auto 1fr",
                    gap:"0.75rem", padding:"0.7rem 0",
                    borderBottom:`1px solid ${t.borderFaint}`,
                    cursor:"pointer", alignItems:"start",
                  }}>
                    <div style={{
                      width:18, height:18, flexShrink:0,
                      border:`2px solid ${mChecked[key] ? m.color : t.checkboxBorder}`,
                      borderRadius:3,
                      background: mChecked[key] ? m.color : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all 0.2s", marginTop:1,
                    }}>
                      {mChecked[key] && <span style={{ color:"white", fontSize:"0.58rem" }}>✓</span>}
                    </div>
                    <span style={{ fontSize:"0.9rem", lineHeight:1.6, textDecoration: mChecked[key] ? "line-through" : "none", color: mChecked[key] ? t.muted : t.pageText }}>
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ background:t.invertBg, color:t.invertText, padding:"1.25rem", marginTop:"1rem" }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.25em", color:ACCENT, textTransform:"uppercase", marginBottom:"0.5rem" }}>Dec 31 — The Only Question</div>
            <p style={{ fontSize:"0.9rem", fontStyle:"italic", lineHeight:1.7, color:t.invertMuted80 }}>
              Did you become someone who cannot go back to who he was in August? That is the only metric that matters.
            </p>
          </div>
        </>}

        {/* ══ PERSONA TAB ══ */}
        {tab === "persona" && <>
          <div style={{ marginBottom:"2rem" }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.52rem", letterSpacing:"0.3em", color:"#c1442c", textTransform:"uppercase", marginBottom:"0.75rem" }}>
              December 31, 2026
            </div>
            <div style={{ fontSize:"clamp(2rem, 8vw, 3.5rem)", fontWeight:900, lineHeight:0.95, letterSpacing:"-0.02em", marginBottom:"1.5rem" }}>
              Prithvi.<br /><span style={{ fontStyle:"italic", color:"#c1442c" }}>Remade.</span>
            </div>
          </div>

          {PERSONA.map((p, i) => (
            <div key={i} style={{
              padding:"1.25rem 0",
              borderBottom:`1px solid ${t.border}`,
              display:"grid",
              gridTemplateColumns:"1.5rem 1fr",
              gap:"1rem",
              alignItems:"start",
            }}>
              <span style={{ fontFamily:"monospace", fontSize:"0.55rem", color:ACCENT, paddingTop:"0.35rem" }}>
                {String(i+1).padStart(2,"0")}
              </span>
              <p style={{ fontSize:"1rem", lineHeight:1.75 }}>{p}</p>
            </div>
          ))}

          <div style={{ marginTop:"2rem", background:t.invertBg, color:t.invertText, padding:"1.5rem" }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.25em", color:ACCENT, textTransform:"uppercase", marginBottom:"0.75rem" }}>
              The Question You Will Answer In December
            </div>
            <p style={{ fontSize:"0.95rem", fontStyle:"italic", lineHeight:1.75, color:t.invertMuted85 }}>
              "Who were you in August 2026, and who are you now?"
            </p>
            <div style={{ marginTop:"1.25rem", height:1, background:t.invertDivider }} />
            <p style={{ marginTop:"1.25rem", fontSize:"0.8rem", fontStyle:"italic", lineHeight:1.7, color:t.invertMuted50 }}>
              Write this answer on December 31. One paragraph. Honest. That paragraph is the real measure of everything.
            </p>
          </div>

          <div style={{ marginTop:"1.5rem", padding:"1.1rem", border:`1px solid ${t.border}`, borderLeft:`4px solid ${ACCENT}` }}>
            <div style={{ fontFamily:"monospace", fontSize:"0.5rem", letterSpacing:"0.25em", color:t.muted, textTransform:"uppercase", marginBottom:"0.5rem" }}>
              What You Want People To Feel
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem", marginTop:"0.25rem" }}>
              {["The most interesting person in the room.", "Calm. Completely unshakeable.", "Someone who has actually lived and done things.", "Someone you can trust with anything."].map((q, i) => (
                <div key={i} style={{ display:"flex", gap:"0.75rem", alignItems:"center", fontSize:"0.88rem" }}>
                  <span style={{ color:ACCENT, fontSize:"0.7rem" }}>✦</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop:"1rem", fontSize:"0.78rem", fontStyle:"italic", color:t.muted, lineHeight:1.65 }}>
              All four. Not one or two. All four. This is why you cannot afford to neglect any domain — each one builds a different facet of the same man.
            </p>
          </div>
        </>}

      </div>
    </div>
  );
}

function hexRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)}, ${parseInt(hex.slice(3,5),16)}, ${parseInt(hex.slice(5,7),16)}`;
}
