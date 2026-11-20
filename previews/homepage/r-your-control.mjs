// Illustrative ways to use Villow, not customer quotations or fixed defaults.
const examples = [
  { title: 'A little discovery each day.', points: ['Keep YouTube’s recommendations.', 'Use the extension to stop at 30 minutes a day.'], skin: '#d6a17e', hair: '#38483e', shirt: '#8ea88b', trousers: '#485f58', style: 'short' },
  { title: 'Just the channels I choose.', points: ['Shape a feed around my subscriptions.', 'Tune each channel. No extension needed.'], skin: '#a77659', hair: '#34463e', shirt: '#d9b977', trousers: '#58695e', style: 'curly' },
  { title: 'A reason to catch up.', points: ['Share good videos with friends.', 'Watch together, even from afar.'], skin: '#ecc5a0', hair: '#8b6550', shirt: '#a5bfc2', trousers: '#50665b', style: 'long' },
  { title: 'A week that works for me.', points: ['Set shorter limits on workdays.', 'Leave more time for the weekend.'], skin: '#bd896c', hair: '#485049', shirt: '#b8b3ca', trousers: '#59685a', style: 'glasses' },
  { title: 'Evenings for something else.', points: ['Schedule time away from videos.', 'Add a reminder when it’s time for bed.'], skin: '#e4b795', hair: '#77634f', shirt: '#c7a08a', trousers: '#4d655b', style: 'bun' },
];

function person({ skin, hair, shirt, trousers, style }) {
  const backHair = style === 'long' ? `<path d="M38 54Q32 20 60 19Q91 18 86 58L91 98H32Z" fill="${hair}"/>` : '';
  const hairTop = {
    short: '<path d="M39 43Q30 17 56 19Q72 12 84 30L81 48L75 36Q54 42 46 32L44 47Z"/>',
    curly: '<path d="M38 48Q25 38 34 30Q28 17 42 15Q48 4 60 14Q75 6 81 19Q96 20 87 34Q94 44 82 50L77 33Q60 41 43 32Z"/>',
    long: '<path d="M36 44Q33 16 60 19Q87 18 85 46L78 43L73 31Q61 42 41 39Z"/>',
    glasses: '<path d="M38 45Q34 20 55 20Q67 14 81 24L83 43L76 35Q59 38 46 32L44 46Z"/>',
    bun: '<circle cx="62" cy="16" r="13"/><path d="M37 44Q31 20 57 20Q86 17 84 45L77 37Q56 40 44 33L44 46Z"/>',
  }[style];
  return `<svg class="r-control-person" viewBox="0 0 120 236" width="120" height="236" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="226" rx="43" ry="5" fill="#dce4d2"/>
    ${backHair}
    <path d="M40 145L38 215H54L62 161L68 215H84L81 145Z" fill="${trousers}"/>
    <path d="M38 211H54L55 223H30Q28 215 38 211ZM68 211H84L92 220Q94 223 89 224H68Z" fill="#344d43"/>
    <path d="M48 76H72Q86 77 91 93L87 150Q61 156 33 150L30 96Q32 81 48 76Z" fill="${shirt}"/>
    <path d="M51 65V79Q60 89 69 79V65" fill="${skin}"/>
    <path d="M40 37Q40 23 60 23Q80 23 80 40V52Q79 73 61 74Q42 73 40 53Z" fill="${skin}"/>
    <g fill="${hair}">${hairTop}</g>
    <path d="M34 96L24 135Q23 144 35 146L51 140M87 96L96 130Q98 137 90 140L72 136" stroke="${shirt}" stroke-width="17" stroke-linecap="round"/>
    <path d="M44 142L54 138M81 138L71 135" stroke="${skin}" stroke-width="10" stroke-linecap="round"/>
    <path d="M56 123L73 120L78 141L61 144Z" fill="#fffaf0"/>
    <path d="M62 128L69 126M64 133L71 131" stroke="#9aad92" stroke-width="2" stroke-linecap="round"/>
    <path d="M52 49V51M68 49V51" stroke="#3e4b40" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M56 61Q60 64 65 60" stroke="#805d4c" stroke-width="1.5" stroke-linecap="round"/>
    ${style === 'glasses' ? '<g stroke="#465c50" stroke-width="1.8"><rect x="44" y="44" width="14" height="12" rx="4"/><rect x="63" y="44" width="14" height="12" rx="4"/><path d="M58 48H63"/></g>' : ''}
  </svg>`;
}

export const yourControlSection = `<section class="r-control" id="your-control" aria-labelledby="r-control-title">
  <header class="r-control-copy">
    <h2 id="r-control-title">Make it yours.</h2>
    <p>Villow puts you in control of what you watch, when you watch and how much.</p>
    <p>Use the parts that suit you, and shape them around your life.</p>
  </header>
  <div class="r-control-stories" aria-label="Some ways to use Villow">
    <p class="r-control-eyebrow">A few ways to make it yours</p>
    <div class="r-control-stage">
      ${examples.map((example, index) => `<article class="r-control-example${index === 0 ? ' is-current' : ''}"${index ? ' aria-hidden="true" inert' : ''}>
        ${person(example)}
        <div class="r-control-bubble"><h3>${example.title}</h3><ul>${example.points.map(point => `<li>${point}</li>`).join('')}</ul></div>
      </article>`).join('')}
    </div>
    <button class="r-control-playback" type="button" hidden aria-label="Pause examples" title="Pause examples">
      <svg class="r-control-pause-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M7 5V15M13 5V15"/></svg>
      <svg class="r-control-play-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M7 4L15 10L7 16Z"/></svg>
      <svg class="r-control-next-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 10H16M11 5L16 10L11 15"/></svg>
    </button>
  </div>
</section>`;
