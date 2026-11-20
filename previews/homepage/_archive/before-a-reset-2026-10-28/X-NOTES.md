# X — designing for life beyond the screen

Preview: http://127.0.0.1:4399/x.html#beyond-watching
Baseline: http://127.0.0.1:4399/w.html

## Scope

One new chapter before the closing invitation. W, T and all previous options remain visible in the top rail. Cloud cinema, the feed stack and its actions, boundaries, insights, device section, social chapter and the closing are unchanged. render-x.mjs asserts preservation. Production files are untouched.

The chapter makes the wider redesign purpose concrete through four small examples. The first pair is implemented in Villow; the second pair is explicitly labelled Concept previews / Not live features. No full app screenshot or four matching outlined panels are used.

## Content and source audit

### Days without raising limits

- Counts calendar days since its anchor, without a daily-use requirement.
- Increasing or removing a finite daily time/open allowance resets it; going over a threshold and raising a limit are different events.
- A decrease preserves the streak and is marked Limit decreased · streak kept. No extra days or points are invented.
- Illustration: sample eight-day streak and seven-day weekly strip, with one lowered-limit day.
- Sources: ../disconnect/src/utils/limitExtension.ts:1–47; src/pages/WatchTime.tsx:3092–3095; src/components/TodayScheduleSection.tsx:404–408,612; ../disconnect/api/settings.ts:1287–1297; supabase/migrations/117_track_usage_limit_decreases.sql.

### Things to do

- Optional implemented feature, supporting native tasks and Google Tasks/Todoist connections.
- Verified clear-feed workspace, player sidebar and header popover. No claim is made that every break, bedtime or limit prompt automatically presents it.
- Website sample checkboxes are local demonstration state only. They do not connect accounts, store tasks or transmit data.
- Sources: ../disconnect/src/components/ThingsToDoPreferences.tsx:12–22; hooks/useThingsToDoEnabled.ts:3–6; components/ThingsToDoWorkspace.tsx:313–371; pages/Home.tsx:718–724; components/VideoPlayer.tsx:5869,5986–6000; ../disconnect/lib/api/things-to-do.ts:1274–1325,1447–1473.

### Creator actions — concept preview

- Current app shows illustrative Get Involved panels only; live events, matching, creator submissions and signups are not implemented.
- Wording uses could, with an example of an action beside a video. There is no fake live event link or functional signup button.
- Sources: ../disconnect/src/components/CreatorCallToActionPlaceholder.tsx:37–72; VideoPlayer.tsx:5877,5978–5983; src/content/pages/creators.yaml and roadmap.yaml:33–47.

### Community Notes — concept preview

- No live source of notes, writing/rating system or correction notifications currently operates.
- Proposed sourced notes could notify earlier viewers after context arrives. The homepage does not claim proven prevention of disinformation or restored trust.
- Sources: ../disconnect/src/components/CommunityNotesPlaceholder.tsx:1–5,78–107; ConceptsSettings.tsx:54; src/content/pages/roadmap.yaml:33–40.

## Presentation and motion

Rounded typography, warm cream background, sage and a restrained gold lowered-limit state. Open two-part composition with different visual treatments: a streak counter/week, an actionable sample list, a video-to-action illustration, and a delayed-context timeline/notice. Desktop uses spacious columns; mobile reads top to bottom.

Reveal motion runs once when each group enters. Reduced motion and no-JS show complete static content. A small sample-week reveal settles and holds; there are no looping counters or retention effects.

## Verification

- Syntax and renderer preservation checks pass.
- Browser widths320,390,600,768,1024,1440: no horizontal overflow, no broken new-section images, natural single-column mobile layout.
- Sample task checks toggle by keyboard Space with visible checked/strikethrough feedback and can be reversed.
- Proposal status is visible on desktop/mobile; illustrative actions are not clickable fake links.
- No console warnings/errors during checks. Proof screenshots in qa/x-desktop.png, qa/x-mobile-working.png and qa/x-mobile-concepts.png.

Regenerate: node previews/homepage/render-x.mjs
Update comparison rail: node previews/homepage/sync-study-navigation.mjs
Serve: node previews/homepage/serve.mjs
