# Navratri Interactive Proposal Website --- Architecture & Flow

## 1. Product overview

A mobile-responsive, cinematic Navratri greeting and interactive Garba
proposal experience. The visitor sees a devotional opening, scrolls into
a playful proposal with two animated cartoon characters, interacts with
a mischievous NO button, and finally accepts with YES to trigger a
golden transition and a couple Garba video.

The experience is a static front-end website. No backend, database,
authentication, or API is required for the core interactions.

## 2. Visual system

-   Opening background: warm off-white `#F8F0E4`
-   Proposal and Garba background: deep crimson `#7F2432` (exact match sampled from video character backgrounds)
-   Golden transition accent: `#D6B16B`
-   Keep typography expressive but readable. Use a decorative serif for
    the main romantic question and a clean sans-serif for controls and
    supporting text.
-   Use restrained floating particles and soft light; avoid clutter,
    excessive gradients, excessive glass effects, or childish UI.
-   Maintain seamless video framing with feathered edge masks to make
    character videos blend directly into the page canvas.

## 3. Asset inventory

The source assets reside in the public asset directory:
`public/assest/` (containing `image/` and `video/` subdirectories).

  -----------------------------------------------------------------------
  Filename                        Type   Role & Web Path
  ------------------------------- ------ --------------------------------
  `devimaa.png`                   PNG    Devotional opening illustration
                                         `/assest/image/devimaa.png`

  `happynavtri.png`               PNG    Happy Navratri greeting below Devi
                                         `/assest/image/happynavtri.png`

  `boysmile.mp4`                  MP4    Boy's default happy loop
                                         `/assest/video/boysmile.mp4`

  `boysad.mp4`                    MP4    Boy's first NO reaction (sad)
                                         `/assest/video/boysad.mp4`

  `boyangry.mp4`                  MP4    Boy's second NO reaction (angry)
                                         `/assest/video/boyangry.mp4`

  `grilsmile.mp4`                 MP4    Girl's default smiling loop
                                         `/assest/video/grilsmile.mp4`

  `girlshock.mp4`                 MP4    Girl's shocked NO reaction
                                         `/assest/video/girlshock.mp4`

  `garbaboygirl.mp4`              MP4    Couple Garba finale celebration
                                         `/assest/video/garbaboygirl.mp4`
  -----------------------------------------------------------------------

Use exact lowercase filenames and paths as verified above. In code, they are referenced as:
- `/assest/image/devimaa.png`
- `/assest/image/happynavtri.png`
- `/assest/video/boysmile.mp4`
- `/assest/video/boysad.mp4`
- `/assest/video/boyangry.mp4`
- `/assest/video/grilsmile.mp4`
- `/assest/video/girlshock.mp4`
- `/assest/video/garbaboygirl.mp4`

If any asset cannot load, a graceful fallback placeholder is displayed and a development warning is logged.

## 4. High-level architecture

``` text
Browser
└── App
    ├── IntroLoader
    │   └── GoldenReveal
    ├── NavratriOpeningSection
    │   ├── DeviImage (devimaa.png)
    │   └── GreetingImage (happynavaratri.png)
    ├── ProposalSection
    │   ├── CharacterVideo (boy)
    │   │   ├── happyboy.mp4
    │   │   ├── sadboy.mp4
    │   │   └── angryboy.mp4
    │   ├── ProposalCopy
    │   ├── ChoiceButtons
    │   └── CharacterVideo (girl)
    │       ├── girlsmile.mp4
    │       └── girlshock.mp4
    ├── GoldenTransition
    └── GarbaFinale
        └── garba.mp4
```

### Suggested project structure

``` text
navratri/
├── public/
│   └── images/
│       ├── devimaa.png
│       ├── happynavaratri.png
│       ├── happyboy.mp4
│       ├── sadboy.mp4
│       ├── angryboy.mp4
│       ├── girlsmile.mp4
│       ├── girlshock.mp4
│       └── garba.mp4
├── src/
│   ├── components/
│   │   ├── IntroLoader
│   │   ├── GoldenLight
│   │   ├── VideoCharacter
│   │   ├── ChoiceButtons
│   │   └── MotionReducedFallback
│   ├── sections/
│   │   ├── OpeningSection
│   │   ├── ProposalSection
│   │   └── GarbaSection
│   ├── hooks/
│   │   └── useProposalSequence
│   ├── styles/
│   │   ├── tokens.css
│   │   └── responsive.css
│   ├── App
│   └── main
├── ARCHITECTURE.md
└── package.json
```

The names above are architectural recommendations, not a requirement to
overwrite an existing stack. First inspect the current repository and
preserve its framework, scripts, and conventions. If no project exists,
use React + TypeScript + Vite. Use CSS modules or a clear
global/component CSS structure. Use Framer Motion only if it is already
installed or can be added cleanly; CSS transitions are sufficient for
simple motion.

## 5. Full visitor journey

### Scene 0 --- Loading and golden reveal

1.  Show a minimal warm off-white or darkened intro state, avoiding a
    long artificial loading delay.
2.  Preload only the opening images needed immediately.
3.  Reveal a soft golden light sweep.
4.  Fade into the opening section.
5.  Do not make the user wait for every MP4 to download before seeing
    the first page.

### Scene 1 --- Devotional opening

-   Background: `#F8F0E4`.
-   Reveal `/images/devimaa.png` prominently with a subtle opacity/scale
    transition.
-   Reveal `/images/happynavaratri.png` below it using a gentle fade-up.
-   Add sparse festive particles or tiny gold motes. Keep effects light
    and respectful.
-   Show a subtle scroll cue.
-   The section should feel complete on mobile without forcing an
    awkward oversized image or unnecessary scrolling.

### Scene 2 --- Proposal section

-   Background: `#8E2938`.
-   Desktop composition: boy on the left, proposal text and controls in
    the center, girl on the right.
-   Main question: `Mere sath Garba khelne aaogi na?`
-   Default boy video: `/images/happyboy.mp4`, muted and looping.
-   Default girl video: `/images/girlsmile.mp4`, muted and looping.
-   Buttons: `YES ❤️` and `NO 🙈`.
-   The character videos must not show native controls, borders, player
    chrome, or separate card frames.
-   Keep each character in a stable container with a fixed aspect ratio
    and `object-fit: contain`. Do not crop off heads, feet, sticks,
    dupatta, or other important features.
-   The character media should blend into the crimson section. Verify
    the actual MP4 backgrounds visually; CSS cannot remove a baked-in
    background. If the clip's color differs, either match the section
    background to the media or edit/remove the video background before
    development.

### Scene 3 --- NO interaction and repeatable reactions

Use one explicit state machine instead of multiple unrelated booleans.

Suggested state: - `reactionCount`: number of NO attempts -
`boyEmotion`: `happy | sad | angry` - `girlEmotion`: `smile | shocked` -
`isAccepted`: boolean - `isTransitioning`: boolean

Behavior: 1. Initial state: `happyboy.mp4` and `girlsmile.mp4` loop. 2.
First NO hover/pointer attempt: move NO a small randomized-but-bounded
distance; increase YES scale slightly; set boy to `sadboy.mp4`; set girl
to `girlshock.mp4`. 3. Second NO attempt: move NO again; set boy to
`angryboy.mp4`; keep girl on `girlshock.mp4`. 4. Third and later NO
attempts: alternate sad and angry boy reactions (odd/even sequence after
the first two), with the girl shocked each time. 5. After the reaction
clips finish, restore the default looping videos: `happyboy.mp4` and
`girlsmile.mp4`. Return the state to its idle expression, but keep the
attempt counter so the next NO attempt can use the next reaction in the
sequence. 6. If the user chooses YES at any time, stop all NO behavior
and ignore subsequent hover/touch events.

Implementation detail: reaction MP4s should play once and fire `ended`
to restore the loop. The default clips loop continuously. Use a `key` or
controlled source change to ensure the new clip starts at the intended
time. Handle source changes with `loadeddata`/`canplay` where useful.
Prevent overlapping reaction timers and duplicate event handlers. Never
use arbitrary long timeouts as the only signal that a video ended; use
the media `ended` event and add a small defensive fallback if needed.

NO button behavior: - Desktop: trigger on `pointerenter` and/or pointer
proximity in a way that doesn't create repeated flicker as the button
moves. Throttle/debounce closely spaced events. - On pointer
activation/click, prevent accidental form submission and run the same
playful dodge/reaction logic. - Keep button movement within the proposal
section's visible bounds. - YES must remain easy to click, visible, and
keyboard-accessible. - Do not make the NO button aggressively escape
every time the cursor crosses it; limit each move to a small distance. -
Provide a keyboard-accessible NO action that triggers the same playful
response rather than making the button impossible to focus.

### Scene 4 --- YES accepted

When YES is activated: 1. Set `isAccepted = true` immediately. 2.
Disable and remove all NO event handlers/behavior. 3. Stop or pause the
current reaction media. 4. Set the character videos to their happy
states. 5. Animate the two character containers toward the center with
smooth transforms; don't change the actual media framing. 6. Trigger a
warm gold glow/light sweep over the crimson background. 7. Transition to
the Garba finale only after the visual transition is ready. 8. Respect
reduced-motion preferences and provide a direct fade transition when
motion is reduced.

### Scene 5 --- Garba finale

-   Background stays `#8E2938` to match the proposal section.
-   Play `/images/garba.mp4` in a large, centered responsive video
    container.
-   Autoplay should be muted because browsers commonly block autoplay
    with audio. If music is desired, provide a clear user-controlled
    sound toggle or tap-to-enable sound.
-   Do not display browser video controls in the designed presentation
    unless used as an accessible fallback.
-   Preserve the video's aspect ratio and avoid cropping the couple. The
    video should visually appear like the characters are part of the
    website rather than inside a box.
-   The golden light is a transition effect only; it should fade away
    after revealing the Garba clip.
-   Finish on the dance and optionally show a concise closing line.

## 6. Video component design

Create a reusable `VideoCharacter` component with props conceptually
like:

``` ts
type VideoCharacterProps = {
  src: string;
  loop: boolean;
  playKey: string;
  className?: string;
  poster?: string;
  onEnded?: () => void;
  ariaLabel: string;
};
```

Requirements: - `autoPlay`, `muted`, `playsInline`, and appropriate
`loop` behavior. - Use `preload="metadata"` for most clips; preload the
default loops when entering the proposal section. Avoid eagerly
downloading all large videos at initial page load. - For short reaction
clips, preload them before the user reaches the proposal section if
bandwidth permits. Otherwise prepare them when the section becomes
visible. - On source change, handle the new video cleanly and avoid a
black flash. If necessary, crossfade stacked video elements or show the
matching poster for the brief loading interval. - Respect
`prefers-reduced-motion`. - On mobile Safari, `playsInline` and muted
playback are important for inline autoplay. - Add a poster/fallback
frame for failed video loading. If a still poster is not available, show
a simple graceful placeholder that preserves the layout. - Avoid
rendering multiple copies of the same MP4 simultaneously unless
intentionally using a crossfade. Release/pause videos that are no longer
active when appropriate.

## 7. Mobile responsiveness

Mobile responsiveness is a core requirement, not a final polish task.

### Desktop (roughly 1024px and wider)

-   Three-column proposal layout: boy \| question/buttons \| girl.
-   Characters are prominent and balanced, with ample negative space.
-   Avoid fixed pixel positioning for the main layout.

### Tablet (roughly 768--1023px)

-   Use a compact three-column layout only if each character remains
    legible.
-   Otherwise shift to a two-row composition: characters at the top,
    text and buttons below.
-   Scale typography and video containers with `clamp()`.

### Mobile (under roughly 768px)

-   Use a vertically stacked proposal composition: boy and girl near the
    top, question below or between compact character placements, and
    buttons clearly visible below the text.
-   If horizontal space permits, show smaller characters side-by-side
    above the question. Otherwise stack them without obscuring the
    message.
-   Avoid a layout that requires horizontal scrolling.
-   Ensure the NO button stays inside the viewport and never overlaps
    YES.
-   Use a minimum comfortable touch target around 44×44 CSS pixels.
-   Use `100svh`/`100dvh` where appropriate, with safe-area padding for
    modern phones.
-   Support portrait first; landscape should still remain usable.
-   Keep text readable at small widths and avoid overly long lines.
-   Opening imagery should scale with viewport width and height, using
    `object-fit: contain`.
-   Do not depend on hover for core functionality. On touch devices, tap
    NO to trigger the reaction and move the button.
-   Reduce or disable particles and parallax on small devices or
    low-power conditions.
-   Use `prefers-reduced-motion: reduce` to replace sweeping transitions
    and floating animations with simple fades.
-   Avoid excessive simultaneous video decoding. If performance is poor,
    pause off-screen loops and resume when the proposal section becomes
    visible.
-   Test at 320px, 360px, 390px, 430px widths, tablet widths, and common
    desktop sizes.

## 8. Accessibility and usability

-   Use semantic buttons with clear accessible labels.
-   Ensure text contrast against both backgrounds.
-   Do not communicate reactions only through color or animation.
-   Keep YES reachable by keyboard and screen reader.
-   NO should remain operable with keyboard and touch.
-   Respect reduced motion.
-   If audio is added, default it to off and provide a visible control.
-   Keep important text as HTML, not embedded in images.
-   Provide fallback content for videos that fail or cannot autoplay.

## 9. Performance strategy

-   Opening images should load first; large videos should not block the
    first paint.
-   Use modern compression/encoding for MP4s when possible and avoid
    unnecessarily high bitrates.
-   Lazy-load the Garba video until acceptance is likely or the
    transition begins.
-   Preload short reaction clips around the time the proposal section is
    entered to avoid noticeable delay on NO.
-   Pause inactive clips.
-   Avoid downloading every large clip at page startup.
-   Use transform/opacity for animations instead of animating layout
    properties.
-   Use CSS `will-change` sparingly.
-   Prevent layout shifts by reserving stable media dimensions.
-   Test on a throttled network and a mid-range phone.

## 10. Error handling

-   If a video fails to load, keep the layout intact and display a
    poster/still fallback.
-   If autoplay is blocked, attempt muted inline playback and offer a
    tap-to-play fallback if required.
-   If the NO button interaction is triggered repeatedly, serialize the
    reaction sequence so video sources and states cannot race.
-   If YES is clicked during a reaction, YES takes priority: cancel
    pending reaction state updates and transition immediately.
-   Avoid console errors, missing asset 404s, React key warnings, and
    unhandled media play promises.

## 11. Suggested implementation order

1.  Inspect the existing project and retain its framework and package
    manager.
2.  Confirm all eight assets exist at the expected paths and inspect
    video dimensions/durations/backgrounds.
3.  Implement theme tokens and responsive layout.
4.  Build the opening section and golden reveal.
5.  Build the proposal layout with default loops.
6.  Implement the reaction state machine and NO button dodge.
7.  Implement YES acceptance and the golden transition.
8.  Add the Garba finale.
9.  Add mobile behavior, accessibility, and performance handling.
10. Run the app, fix all console/build errors, and test the full journey
    at desktop and mobile sizes.

## 12. Definition of done

-   All eight named assets are wired to the correct scenes.
-   The opening appears in off-white, followed by the crimson proposal.
-   The boy and girl default loops are aligned and stable.
-   First NO attempt shows sad boy + shocked girl.
-   Second NO attempt shows angry boy + shocked girl.
-   Further NO attempts alternate sad/angry boy reactions and restore
    default loops after each clip.
-   NO moves a small distance and remains within bounds; YES grows
    slightly but remains easy to click.
-   Mobile tap behavior works without hover.
-   YES permanently stops NO interactions and starts the acceptance
    transition.
-   Golden light leads into the Garba video.
-   Garba background matches the proposal background.
-   Responsive layouts work with no horizontal overflow.
-   Reduced-motion, media failures, autoplay restrictions, and slow
    loading have graceful fallbacks.
-   No missing asset paths, console errors, or visible player controls
    in the intended presentation.

The above content shows the entire, complete file contents of the requested file.
