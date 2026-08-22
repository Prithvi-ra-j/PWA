import React from 'react';
import { MILESTONES, ACCENT } from '../constants.js';
import { getDaysUntilYearEnd } from '../helpers/dateHelpers.js';

/**
 * Milestones tab — existing three-phase timeline with persistent checkboxes.
 * Design is identical to original; state is now driven by IndexedDB via props.
 *
 * Props:
 *   t                  — current theme object
 *   milestoneChecks    — { "m-mi-ti": boolean }
 *   onToggle(key)      — called when a task checkbox is tapped
 */
export default function MilestonesTab({ t, milestoneChecks, onToggle }) {
  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', lineHeight: 1.1, marginBottom: '0.5rem' }}>
          {getDaysUntilYearEnd()} Days.
        </div>
        <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: t.muted, lineHeight: 1.7 }}>
          Not enough time to become a different person. Exactly enough time to prove to yourself that you can.
        </p>
      </div>

      {MILESTONES.map((m, mi) => (
        <div key={mi} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `2px solid ${m.color}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.5rem', letterSpacing: '0.2em', color: m.color, textTransform: 'uppercase' }}>
              {m.period}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{m.label}</div>
          </div>

          {m.tasks.map((task, ti) => {
            const key  = `m-${mi}-${ti}`;
            const done = !!milestoneChecks[key];
            return (
              <div
                key={ti}
                id={`milestone-task-${key}`}
                onClick={() => onToggle(key)}
                style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr',
                  gap: '0.75rem', padding: '0.7rem 0',
                  borderBottom: `1px solid ${t.borderFaint}`,
                  cursor: 'pointer', alignItems: 'start',
                }}
              >
                <div style={{
                  width: 18, height: 18, flexShrink: 0,
                  border: `2px solid ${done ? m.color : t.checkboxBorder}`,
                  borderRadius: 3,
                  background: done ? m.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', marginTop: 1,
                }}>
                  {done && <span style={{ color: 'white', fontSize: '0.58rem' }}>✓</span>}
                </div>
                <span style={{ fontSize: '0.9rem', lineHeight: 1.6, textDecoration: done ? 'line-through' : 'none', color: done ? t.muted : t.pageText }}>
                  {task}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      <div style={{ background: t.invertBg, color: t.invertText, padding: '1.25rem', marginTop: '1rem' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.5rem', letterSpacing: '0.25em', color: ACCENT, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Dec 31 — The Only Question
        </div>
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.7, color: t.invertMuted80 }}>
          Did you become someone who cannot go back to who he was in August? That is the only metric that matters.
        </p>
      </div>
    </>
  );
}
