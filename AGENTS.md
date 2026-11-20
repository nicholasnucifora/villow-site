# Villow development and publication

## Supporter moderation requested 16 November 2026

- The owner wants consented messages public immediately by default (Unreviewed),
  with Approved, Hidden and Needs review states. A local server-side language
  check holds likely slurs/profanity for review; donor feedback stays thankful
  and neutral. Never override withdrawn consent or suppression.
- The owner interface belongs at `/admin/support` on the existing Fix the Web
  domain, preferably `fixtheweb.org`, with server-side sign-in protection. Show
  name/message and review controls, not email/payment details. See
  `support/MODERATION.md`. The working local fixture is on port 4411.
- On 16 November 2026 the owner explicitly authorised activating the protected
  admin at `fixtheweb.org/admin/support`, the automatic message flow, and an
  owner-controlled censor-preview action. This includes the necessary database
  migrations, Worker secret/routes/deployment and a narrow update of the existing
  public support page and its privacy explanation. It does NOT authorise the
  website redesign, draft terms, app/extension policies or other pending changes.
  Use the isolated published-design release described in `support/MODERATION.md`;
  the root release guard stays enabled and there is no blanket push permission.
- Subsequent 16 November refinement: censor complete words with text hearts
  (`♥♥♥`), never leading letters or asterisks. Supporter dates in the private
  design are relative. Show a quiet one-message carousel only when there are
  multiple messages; keep one message static. Preserve pause controls and
  reduced-motion behaviour. This does not release the website redesign.
- The owner then requested a contained supporter card with the relative date
  beside the name. The loopback preview fills to three cards using clearly
  labelled samples, dropping a sample for each genuine message and removing all
  samples once there are three real entries. Never add samples to the live API
  or database, or automatically show them on public hosts.
- The latest 16 November sketch supersedes the single boxed carousel: put the
  heading outside individual borderless sage cards, in a continuously moving
  full-width row with fading edges. Drift to the right, allow horizontal pointer
  dragging and touch swipes, and preserve native vertical scrolling. Keep a
  pause control, keyboard browsing, hover pause and reduced-motion opt-in.
  One genuine message without samples remains static. This is local design only.
- The later wide-screen refinement confines the notes to the same content width
  as the section above (maximum 1100px), with wider 20% desktop edge fades and
  two rows of distinct messages moving in opposite directions. Remove the
  visible arrow/playback controls and the separate sample-preview caption.
  Keep individual Sample badges. The local preview now fills to six cards for
  two different three-card rows, with samples replaced as genuine notes arrive.
  Normal motion starts automatically; reduced-motion devices use the same
  Preview motion opt-in in the top design rail as the homepage. Retain drag,
  hover/tap pause and keyboard access without adding playback chrome to the cards.
- The next readability comparison keeps A as the current default and adds three
  local presets in the Get involved rail: B (1440px wide rows with short edge
  fades), C (300px compact cards within the content width), and D (a static,
  responsive grid with no fades). Routes are `/previews/support-wide`,
  `/previews/support-compact`, and `/previews/support-still`. Preset links target
  `#supporter-notes`; motion opt-in persists for the tab across the moving presets.
  All use the same consented feed and loopback-only labelled sample fill. These
  are alternatives for owner review, not a chosen replacement or a release.
- The owner then selected C / Compact cards as the local default for `/support`
  and `/get-involved`. The old `/previews/support-compact` address is an alias.
  Keep the full message text (Checkout enforces 255 characters); short cards keep
  their natural height. Labelled local examples include a 255-character note.
  E / Passing words is a single unboxed typography stream; F / In their words is
  a featured quote and person index; G / Little letters is a swipeable paper
  stack; H / Message garden uses selectable blooms. F–H browse the complete recent
  feed with reading time scaled to message length, manual selection, hover/focus
  pause, swipes, keyboard access and the existing motion opt-in. Garden stems
  paginate in groups of six as selection advances, never limiting the feed to six.
  These comparisons are local only; C remains selected while they are reviewed.
- The 17 November refinement supersedes natural-height C cards: use equal-height
  cards with three-line excerpts and a Read full note action only when text is
  visually clipped. Clicking a clipped card or pressing Enter on the selected
  row note opens the complete text in a native dialog and pauses both rows.
  Keep drag distinct from click, Escape/close with focus return, and clickable
  looping copies without extra offscreen keyboard stops. C remains the default.
  E keeps unboxed quotations but now uses narrower, aligned excerpts, quieter
  type and opening quote marks; it shares the full-note reader. Local only.
- The owner then chose Compact cards exclusively: remove A/B/D/E/F/G/H from
  active navigation/rendering and keep their sources only in the private archive.
  Prior comparison URLs resolve to the selected compact page. Cards are now
  168px high with tighter padding and the reading link directly after the excerpt.
  Closing the reader resumes both rows despite restored keyboard focus or stale
  hover state; a new pointer movement restores hover pause. Preserve explicit
  manual pauses and reduced-motion preferences. This remains local only.
- The latest 17 November request removes supporter hover pause and pointer/touch
  dragging. Rows drift continuously; click anywhere on any note to open the reader.
  Use clamped text with an ellipsis, no visible Read full note caption, and a pointer
  cursor on readable cards. Closing the reader resumes automatic motion, preserving
  explicit keyboard pauses and reduced-motion preferences. Keyboard browsing stays.
  C remains default; new D Quotations, E Folded notes and F Conversation compare
  borderless card treatments with the same equal heights and interaction. Earlier
  layout experiments stay archived. These new comparisons remain local only.
- The owner requested removing the final "These controls are possible." CTA from
  the Questions/FAQ page, leaving its questions and answers intact.
- The owner confirmed the admin password is in their password manager. The
  one-time plaintext setup file must not remain in the source tree or be moved
  into another repository. The existing Worker hash and password stay unchanged.
  Future setup requires an explicit private path outside this repository;
  secret installation and CLI verification receive credentials via stdin.

## Local website publication boundary

- The owner approved replacing the main LOCAL website with homepage 34 / Soft Nunito and its secondary previews on 14 November 2026. Keep the top preset controls while iteration continues.
- This redesign must remain private until the owner explicitly asks to publish it. Do not push, deploy, upload a public preview, or remove/bypass the public release guard without that instruction. Local changes and `npm run build:local` are authorised.
- `npm run dev` serves the integrated site on loopback port 4411. Android testing uses ADB reverse over USB, not a public tunnel or LAN listener.
- Reuse existing `site.config.yaml` destinations and existing policy content. Terms is unset and the live `/terms` returned 404 on 14 November 2026; do not invent a policy.
- `previews/homepage/` remains the shared source of the current design. Its more recent user-approved migration takes precedence over historical instructions in its AGENTS.md restricting edits to previews only. Preserve active presets and artwork.

## Terms research authorised 14 November 2026

- The owner subsequently requested researched terms and coordination with the web app and extension chats. `/terms` is now an explicitly labelled LOCAL DRAFT; `links.terms` points to it for review. This supersedes the earlier unset-terms note only for this authorised draft. Do not invent the legal entity, age policy, effective date or privacy facts.
- The owner lives in Queensland. On 14 November 2026, ABN 68 737 669 690 was verified as Nicholas Francis Nucifora, Individual/Sole Trader. The owner subsequently supplied a Stripe assistant response reporting the same legal name and Individual account type, and says the ABN was added to tax details. Exact Stripe ABN field/storage remains unverified; this is payment-account administration, not a blocker to naming the verified operator in the draft. Do not repeatedly send the owner to the same unavailable Business details fields or copy personal verification information into source/policies.
- The owner selected 16+ for the connected web app (including the app account when linking the extension), not a blanket age limit for website browsing or signed-out standalone extension use. This policy does not itself establish age assurance or statutory compliance.
- The owner explicitly chose MIT for both the app and extension, including commercial reuse. Their chats reconciled first-party licence files/wording locally; preserve third-party licences and notices. The extension's AMO licence metadata still needs a later authorised update. No store submission or publication is authorised.
- Terms acceptance and public product links must remain inactive until the final documents and operator details are ready. This does not authorise publication, a store release, payment-account changes or bypassing the release guard.

## Local privacy completion authorised 14 November 2026

- The owner requested completion of the remaining terms/privacy implementation with the app and extension chats, keeping everything local. Implement isolated review/test flows and release safeguards; draft/test receipts must not claim legal acceptance. No live migrations, data deletion, provider changes, push, deployment or store submission.
- The owner confirmed supporter Discord access lasts while the supporter community operates, subject to community rules. Voluntary refunds beyond mandatory remedies are reviewed individually. Preserve rights arising from earlier broader promises.
- The website policy must describe contact delivery through Resend, Stripe merchant access, optional public amounts and Discord identity/role handling. Match retention to actual code and provider settings; never invent an automatic deletion deadline.
- The owner clarified that first-use, two-week and three-month app check-ins are REQUIRED, with timing potentially changed later. Ad hoc feedback and supporter messages are optional. Do not describe all Tally surveys as voluntary. The participant code is linked to account settings, completion dates sync, and rendering a form contacts Tally before answers are submitted.
