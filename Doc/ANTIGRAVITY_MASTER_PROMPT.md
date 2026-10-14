You are a senior creative frontend engineer, motion designer, and UX
engineer. Build the complete, production-quality, mobile-responsive
Navratri interactive proposal website described below. Implement the
working website in the existing repository, not just a mockup or plan.

## FIRST: inspect before changing anything

1.  Inspect the existing repository, framework, package manager,
    scripts, and current components.
2.  Preserve existing project conventions and avoid replacing working
    configuration without need.
3.  Verify the exact media assets in `Desktop/Projects/navratri/images/`
    or the assets folder provided in the workspace. Copy them into
    `public/images/` if required.
4.  Use the exact filenames listed below. Do not invent alternative
    filenames or silently rename files.
5.  If the local folder is not accessible from the development
    environment, tell me which files must be copied into the repository
    and continue building around the exact expected paths.

## ASSET MAP --- USE THESE EXACT FILENAMES

Opening: - `public/images/devimaa.png` --- Devi illustration in the
opening scene. - `public/images/happynavaratri.png` --- Happy Navratri
greeting shown below the Devi image.

Boy character: - `public/images/happyboy.mp4` --- default happy boy
loop. - `public/images/sadboy.mp4` --- first NO reaction: sad/crying
boy. - `public/images/angryboy.mp4` --- second NO reaction: playfully
angry boy.

Girl character: - `public/images/girlsmile.mp4` --- default
happy/smiling girl loop. - `public/images/girlshock.mp4` --- shocked
girl reaction when NO is approached.

Finale: - `public/images/garba.mp4` --- boy and girl dancing Garba
together.

The source assets currently appear in
`Desktop/Projects/navratri/images/`. Expected web paths are
`/images/devimaa.png`, `/images/happynavaratri.png`,
`/images/happyboy.mp4`, `/images/sadboy.mp4`, `/images/angryboy.mp4`,
`/images/girlsmile.mp4`, `/images/girlshock.mp4`, and
`/images/garba.mp4`.

If an asset path is missing, do not replace it with unrelated stock
imagery. Report the missing path and implement a graceful
placeholder/fallback. Do not add external images or APIs.

## PRODUCT GOAL

Create a charming, premium, cinematic, romantic Navratri experience. It
should feel like a little interactive story, with the characters coming
alive through short video loops. Avoid a generic landing-page template.
Keep it delightful, elegant, polished, responsive, and fast.

No backend or database is needed. All behavior can run client-side.

## VISUAL IDENTITY

-   Opening background: warm off-white `#F8F0E4`.
-   Proposal background: deep crimson `#8E2938`.
-   Garba finale background: the same deep crimson `#8E2938`.
-   Golden light accent for transitions only: `#D6B16B`.
-   The website has two main scene backgrounds: off-white and crimson.
    Gold is an animated light/transition, not a permanent third section
    background.
-   Use an elegant, expressive serif for the main romantic question and
    a clean sans-serif for buttons and supporting UI.
-   Use gentle motion, subtle festive particles, soft golden light, and
    smooth fades. Do not overuse gradients, glass cards, borders, neon,
    or clutter.
-   Character videos must appear integrated into the scene, not inside
    visible video-player rectangles.
-   Inspect the actual MP4 backgrounds. The crimson background behind
    the characters must match the site visually. CSS cannot remove a
    background baked into an MP4. If the MP4 has a different color or
    gradient, either adjust the section background to match or use a
    suitable background-removal/editing approach; do not pretend a
    mismatch has been solved.
-   Preserve the provided character designs and video content. Do not
    generate new characters.

## FULL STORY FLOW

### SCENE 0 --- LOADING / GOLDEN REVEAL

-   Create a brief, elegant loading/reveal experience.
-   Use a warm, calm starting surface, a subtle gold light sweep, and a
    smooth reveal into the opening.
-   Do not force an artificial long loading delay.
-   Load opening images first; do not wait for every large MP4 to
    download before showing the opening.
-   Respect `prefers-reduced-motion`.

### SCENE 1 --- DEVI + HAPPY NAVRATRI

-   Background: `#F8F0E4`.
-   Reveal `devimaa.png` prominently with a gentle fade/scale animation.
-   Reveal `happynavaratri.png` underneath using a subtle fade-up.
-   Add restrained gold particles or festive light motes for a playful
    Navratri vibe.
-   Keep the visual devotional, warm, and elegant.
-   Add a subtle scroll cue to guide the visitor to the next scene.
-   On mobile, images must scale with `object-fit: contain`, never crop
    the main illustration, and not overflow the viewport.

### SCENE 2 --- PROPOSAL

-   Background: `#8E2938`.
-   Desktop layout: happy boy on the left, proposal question/buttons in
    the center, smiling girl on the right.
-   Main text must read exactly: `Mere sath Garba khelne aaogi na?`
-   Boy uses `/images/happyboy.mp4`, muted and looping.
-   Girl uses `/images/girlsmile.mp4`, muted and looping.
-   Buttons: `YES ❤️` and `NO 🙈`.
-   Use a refined, readable type treatment and strong visual hierarchy.
    Buttons should be attractive, animated subtly, and easy to click.
-   The video elements must have no native controls and no visible
    player chrome.
-   Use stable containers with fixed aspect ratios and
    `object-fit: contain`. Preserve full-body characters; do not crop
    faces, feet, dandiya sticks, or the girl's dupatta.
-   Keep the character placements and background consistent.

### SCENE 3 --- NO BUTTON PLAYFUL INTERACTION

Implement this as a clean, deterministic state machine, not scattered
booleans or overlapping timers.

Initial state: - Boy: `happyboy.mp4`, looping. - Girl: `girlsmile.mp4`,
looping. - NO button is visible and can be approached. - YES button is
visible.

First NO attempt: - The NO button dodges a small distance away from the
pointer/tap, staying within the safe bounds of the proposal area. - The
YES button scales up slightly. - Boy switches to `/images/sadboy.mp4`
and plays once. - Girl switches to `/images/girlshock.mp4` and plays
once. - When reaction clips end, return both characters to their default
looping videos. - Keep the NO attempt count so the next attempt triggers
the next reaction.

Second NO attempt: - NO dodges again by a small distance. - YES grows
slightly, with a sensible scale cap. - Boy switches to
`/images/angryboy.mp4` and plays once. - Girl switches to
`/images/girlshock.mp4` and plays once. - When reactions finish, restore
`happyboy.mp4` and `girlsmile.mp4`.

Third and later NO attempts: - Continue the playful loop, alternating
sad and angry boy reactions on successive attempts; the girl uses
`girlshock.mp4` for each NO reaction. - Restore the happy/smiling loops
after the one-shot reaction videos end. - Keep the button movement
playful and bounded, never off-screen, never over YES, and never so
aggressive that the page becomes unusable.

Interaction details: - Desktop: support pointer hover/proximity and
pointer activation. Avoid an event storm where moving the button
retriggers reactions continuously. Use a small cooldown/guard while a
reaction is playing. - Mobile/tablet: hover does not exist, so tapping
NO must trigger the same dodge and reaction behavior. - Keep YES
accessible, visible, keyboard-focusable, and easy to activate at all
times. - The NO action should remain accessible from keyboard too; do
not create an impossible-to-focus control. - Once YES is chosen, disable
all NO behavior immediately. - Ensure state updates and media `ended`
events cannot race. If YES is clicked during a reaction, YES takes
priority.

### SCENE 4 --- YES ACCEPTED

When YES is activated: 1. Immediately mark the experience as accepted
and disable NO interactions. 2. Cancel pending reaction/reset updates.
3. Bring both characters to their happy states. 4. Animate the character
containers toward the center with smooth transforms; keep their media
framing stable. 5. Trigger a soft golden light sweep/glow. 6. Transition
smoothly to the Garba finale. 7. Respect reduced-motion settings with a
simpler fade alternative.

### SCENE 5 --- GARBA FINALE

-   Background stays `#8E2938`, matching the proposal scene.
-   Play `/images/garba.mp4` in a large, centered responsive video
    composition.
-   The couple should feel like they belong in the website, not inside a
    visible player box.
-   Preserve the video's aspect ratio and keep both characters visible;
    avoid cropping.
-   Golden light should fade after the transition, leaving the
    consistent crimson scene.
-   Autoplay muted for browser compatibility. If sound/music is desired,
    add a visible user-controlled sound toggle; never depend on
    autoplaying audio.
-   No native player controls in the designed presentation, but provide
    a graceful fallback if playback fails.
-   End on the joyful Garba scene, with an optional short closing
    Navratri line.

## RESPONSIVE DESIGN --- REQUIRED

Mobile responsiveness is a first-class requirement, not a later patch.

Desktop (\>=1024px): - Three-column proposal layout: boy \| text/buttons
\| girl. - Balanced characters and generous negative space.

Tablet (768--1023px): - Use a compact three-column layout only if it
remains legible. - Otherwise use a two-row layout with characters above
and proposal copy/buttons below.

Mobile (\<768px): - Design portrait-first. - Keep both characters
visible without making the question too cramped. Use smaller
side-by-side characters above the text if it fits, or stack them in a
balanced way. - Place the question and buttons in a clear,
thumb-friendly area. - No horizontal page scrolling. - NO must stay
within viewport bounds and never overlap YES. - Minimum button touch
target around 44×44 CSS pixels. - Use `100svh`/`100dvh` when helpful and
respect mobile safe-area insets. - Make typography responsive with
`clamp()`. - Use `playsInline`, `muted`, and inline video playback
settings for iOS/Safari. - On touch screens, use tap interactions, not
hover-only behavior. - Reduce decorative particles and heavy motion on
small/low-power devices. - Pause offscreen videos where appropriate to
conserve battery. - Test at 320px, 360px, 390px, 430px, tablet widths,
and desktop.

## VIDEO PLAYBACK REQUIREMENTS

Create reusable components for character videos. Default loops run
continuously; reaction clips play once and return to loops on the media
`ended` event. - `happyboy.mp4` loops in the initial proposal state. -
`girlsmile.mp4` loops in the initial proposal state. - `sadboy.mp4`
plays once for the first NO reaction. - `angryboy.mp4` plays once for
the second NO reaction and alternating later reactions. -
`girlshock.mp4` plays once for each NO reaction. - `garba.mp4` plays
during the finale. - All character clips use stable containers,
consistent sizing, no native controls, `playsInline`, and muted autoplay
where needed. - Use posters/fallback states to avoid black flashes. - Do
not preload every large file immediately. Load opening assets first;
prepare reaction clips near proposal visibility; load Garba near
acceptance. - Handle rejected `video.play()` promises and media
errors. - If videos have baked-in backgrounds, visually verify that they
match `#8E2938`. Do not assume CSS will remove them.

## ARCHITECTURE AND CODE QUALITY

-   Inspect the current stack before editing.
-   If the project is empty, React + TypeScript + Vite is an acceptable
    default.
-   Keep code organized into reusable components and a single explicit
    proposal interaction state machine.
-   Suggested components: `IntroLoader`, `GoldenLight`,
    `OpeningSection`, `ProposalSection`, `VideoCharacter`,
    `ChoiceButtons`, `GarbaFinale`.
-   Suggested hook: `useProposalSequence` for reaction count, active
    emotions, acceptance state, event guards, and cleanup.
-   Keep CSS tokens for the two background colors and gold accent.
-   Use transforms and opacity for animations rather than frequent
    layout changes.
-   Clean up event listeners and pending timers.
-   Avoid unnecessary dependencies. Use existing motion libraries if
    installed; otherwise use CSS transitions/keyframes.
-   No backend, database, analytics, or external APIs are required.

## ACCESSIBILITY, PERFORMANCE, AND FALLBACKS

-   Use semantic buttons and accessible labels.
-   Maintain text contrast.
-   Respect `prefers-reduced-motion`.
-   Keep YES keyboard accessible.
-   Do not communicate state solely through animation.
-   Reserve media dimensions to avoid layout shift.
-   Avoid loading all large videos on first paint.
-   Provide graceful fallbacks if any image/video fails or autoplay is
    blocked.
-   Make audio user-controlled.
-   No console errors, missing asset requests, or uncontrolled React
    state updates.

## TESTING AND ACCEPTANCE CRITERIA

Before finishing: 1. Run the existing project's build/dev checks. 2.
Verify all eight assets load from the exact paths. 3. Test opening
reveal and scroll transition. 4. Verify both default character loops
play correctly. 5. Verify first NO reaction: sad boy + shocked girl. 6.
Verify second NO reaction: angry boy + shocked girl. 7. Verify third and
later NO reactions alternate correctly. 8. Verify reaction clips end and
both default loops resume. 9. Verify NO movement remains bounded and
does not overlap YES. 10. Verify YES can be clicked at any time and
permanently disables NO reactions. 11. Verify the characters move
inward, golden light appears, and `garba.mp4` plays. 12. Verify the
Garba background matches the proposal background. 13. Test mobile tap
interaction and multiple viewport widths. 14. Test reduced motion, media
failures, autoplay restrictions, and slow loading. 15. Fix all build
errors, missing asset paths, console errors, and responsive overflow.

## REQUIRED DELIVERABLES

-   Implement the working website in the repository.
-   Create/update `ARCHITECTURE.md` with the architecture, assets, scene
    flow, state machine, responsive strategy, and test plan.
-   Keep the implementation straightforward and maintainable.
-   At the end, summarize what was implemented, list any missing assets
    or remaining limitations, and provide the exact command to run the
    website locally.
-   Do not stop after presenting a plan. Implement the full experience
    and test it.