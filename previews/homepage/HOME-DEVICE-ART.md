# Homepage: "One experience, across your devices."

## Selected, 20 November 2026

34 carries the figure directly: three devices as bold sage frames around a pale
screen, in 34's own two colours (`--dv-body: #769180`, `--dv-screen: #edf3eb`),
gathered into one group rather than a spaced row. Each device is cut out of the
one behind it by a rim of the page's own paper, so the three silhouettes stay
separate. `home-device-art.css` draws it as `.n-device-set`; there is no
device-art preset in the rail any more.

The phone is 18 x 34, chosen from six proportion studies. At 20 x 42 it stood
84% as tall as the tablet, where real hardware is nearer 59%, and read as an
oversized phone; 18 x 34 brings it to about two thirds. Its frame stays 4px,
the same weight as the laptop's and the tablet's - a thinner phone border was
tried and rejected, so the body alone carries the correction.

Rejected studies, all with the same laptop, tablet, overlap and 4px frame:
47 Shorter (20 x 36), 49 Squarer (22 x 38), 50 Slimmer (18 x 40), 51 True scale
(18 x 30, sized against the tablet the way real hardware is) and 52 Phone set
clear (20 x 42, no overlap, testing whether the overlap was the problem).
`qa/phone-proportions-2026-11-20.jpg` shows all seven together.

Nothing belongs inside the screens: no scene, no interface, no photograph, and
no colour beyond the two above.

## Rejected rounds

All saved pages are in `_archive/device-art-2026-11-20/`; `42`-`46` are in
`retiredHomeStudies`, and every route in `retiredDeviceArtStudies` resolves to
the homepage.

- **42 Landscape screens** - `assets/a-connected-devices.webp`, a raster
  illustration doing far too much next to one short paragraph, already used
  elsewhere on the site.
- **43 Same feed** - the real feed, photographic thumbnail and all, shrunk onto
  three screens. At this size it reads as noise.
- **A hillside continuing across the three screens** - added a second and third
  colour to a section that does not need one.
- **Outlined devices each showing a video card** - added interface detail.
- **Three bare cards with no hardware** - stopped reading as different devices.
- **44 Truer silhouettes** - the row at real device proportions on one baseline.
- **45 Bold outline** - the same devices as 2.5px strokes.

`home-device-art.mjs` and `deviceArtStudies` stay in place as the hook for a
future comparison: add a preset to both when there is a real alternative. The
CSS for `.n-mini-*` and `.device-feed-art` stays in `n-compact-story.css` so
the archived pages still render.

`qa/device-art-iterations-2026-11-20.jpg` shows 34's old figure beside the
three iterations that led here.

This is a local design change. 34 is still private until the owner asks to
publish.

## Chart labels

The "See your habits. Adjust on the spot." chart used a 100% / 50% / 0% y-axis
carried over from the app. Nothing on the page says what the percentage is of,
so the website copy now reads **More** at the top and **Less** at the bottom:
the direction is the only thing a visitor needs, and no magnitude is claimed.
The gridlines, the hour labels and the explanatory loop are unchanged, and
`watch-pattern-demo.css` (the app's own ported animation) is untouched - the
gutter is narrowed in `watch-pattern-section.css`, which owns homepage layout.
