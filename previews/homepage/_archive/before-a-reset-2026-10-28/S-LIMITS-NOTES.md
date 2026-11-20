# S limits carousel

Component: `renderSLimits()` from s-limits.mjs, with s-limits.css and s-limits.js. It is independent of `.no-row`, with a centered heading, one open demonstration stage, short explanation, minimal chevrons/count/pause control. Parent integrates it into S; R and earlier components are untouched.

Five slides: daily allowance; different weekday limits; break reminders; bedtime reminder; watch-free hours/days. Values are illustrative, stated once beneath the stage and in each diagram's accessible label. They are not live settings or promises about defaults.

## App implementation audit (read-only)

- `disconnect/src/components/UsageScheduleSettings.tsx:122–180,198–210`: default allowance and per-weekday allowance are separately adjustable, with real schedule rows and default resets. `src/utils/usageScheduleSummary.ts:7–13` resolves each weekday to its enabled schedule or the default. We show30-minute weekdays/60-minute weekends, simply illustrative supported values.
- `src/components/BreakWarningPreferences.tsx:30–62`: configurable reminder intervals30minutes/1hour/2hours/3hours; separately configurable timeout duration and ignore delay. `BreakReminderPanel.tsx:92–121`: reminder pauses playback until a choice; duration can be chosen for taking a break. `src/utils/breakTimeout.ts:14–26` includes a5minute option. Homepage says choose when reminded and how long a break, avoiding claims that every reminder forces an immutable break.
- `src/pages/Settings.tsx:3535–3615`: bedtime reminder enabled/time controls and the real options Continue past bedtime / Snooze30minutes / I'll go to bed. `src/utils/sleepReminder.ts:162–180` distinguishes grey-screen continuation, snoozing and locked watching. Homepage accurately describes stop/snooze/keep watching in grey, not a hard mandatory bedtime.
- `src/components/UsageScheduleSettings.tsx:218–235` exposes selected weekday watch-free start/end hours. `src/utils/usageScheduleSummary.ts:32–37` summarizes blocked windows. `TodayScheduleSection.tsx:698–704` permits whole-date watch-free days. `VideoPlayer.tsx:6317–6341` displays an Outside Watching Hours / Today is watch-free blocker, with different bypass behavior for whole-day bans. Homepage introduces time to leave watching aside, without promising unrestricted enforcement across browsers or apps.

No channel-level limits, advanced source controls, accountability groups, or settings tutorial added.

## Rotation and accessibility

Initial HTML already shows the meaningful daily allowance example. JS reveals controls. A7.5second timer starts only when at least25% of the section is visible; it pauses while hovered/hidden/offscreen. Any pointerdown or focus on the example (except the explicit rotation control) stops rotation until the visitor deliberately presses Play. Manual arrows and ArrowLeft/Right/Home/End stop rotation and announce the selected example. Automatic changes do not flood live announcements. A visible Pause/Play control is always available. Reduced motion starts with rotation off; explicit Play opts into timed slide changes without animations. Changing the motion preference stops rotation again. Page exit clears timers and observer. The stage has a stable reserved height at each breakpoint.

Validation: syntax checks pass. A fake-clock runtime verifies first-visibility scheduling,7.5second hold, one automatic advance, persistent stop after manual choice, hidden/visible suspension, hover suspension, focus stop, reduced-motion initial suppression, explicit opt-in without animation, preference-change stop, and pagehide teardown. Parent performs real browser/responsive QA for integrated S.

Additional scope check: personal `WatchSchedule` / `ScheduleDayAssignment` / `ScheduleTimeWindow` types (`src/types/database.ts:339–374`) and the personal schedule editor expose default/weekday allowances and recurring hour windows, not a temporary date-range allowance override. Specific whole watch-free dates are supported. Date-windowed group restrictions exist separately, so this homepage carousel does not imply they are personal temporary allowance settings.

