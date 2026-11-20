const originalArt = /<div class="n-device-set" role="img" aria-label="A laptop, tablet and phone grouped together">[\s\S]*?(?=<div><h3 id="n-devices-heading">)/;

// 34 carries the selected figure itself, so there is nothing to swap. Add a
// preset here and to deviceArtStudies when there is a real alternative to
// compare; the rejected rounds are saved in _archive/device-art-2026-11-20/.
const illustrations = {};

export function renderDeviceArtHome(home, preset) {
 if (!originalArt.test(home) || !illustrations[preset]) throw new Error('The homepage device illustration or preset is missing.');
 return home.replace(originalArt, illustrations[preset])
  .replace('<title>Villow \u00b7 Homepage 34</title>', `<title>Villow \u00b7 Homepage ${preset}</title>`);
}
