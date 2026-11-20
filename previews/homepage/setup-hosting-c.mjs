const external = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
const discord = 'https://discord.gg/kBXuDtHFsW';
const disclosure = (id, title, body) => `<details class="hc-disclosure" id="${id}"><summary>${title}</summary><div class="hc-disclosure-body">${body}</div></details>`;
const problem = (id, title, happening, check, steps, extra = '') => disclosure(id, title, `<h3>What’s happening?</h3><p>${happening}</p><h3>How to check</h3><p>${check}</p><h3>How to fix it</h3><ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol>${extra}<p class="hc-still">Still having problems? ${external(discord, 'Ask on Discord')}.</p>`);

export function setupHostingBodyC() {
 return `<div class="sp-width hc-page">
 <header class="hc-intro"><a class="hc-back" data-setup-return href="setup-instructions-b.html?path=web#create">← Back to setup</a><h1>Hosting your Villow.</h1><p>Villow is free to use. When you host a Villow for friends, it runs on services you control. Here’s how to manage your group, understand costs and get help.</p>
 <nav class="hc-jumps" aria-label="On this page"><a href="#how-it-works">How it works</a><a href="#managing">Managing Villow</a><a href="#costs">Costs</a><a href="#troubleshooting">Troubleshooting</a></nav></header>

 <section id="how-it-works" class="hc-section hc-how" aria-label="How hosting works">
 <div class="hc-services">
 <article><h2>YouTube</h2><p>Video information and updates.</p><span>Free within API quotas</span></article>
 <article><h2>Vercel</h2><p>Keeps your Villow online.</p><span>Free Hobby plan for eligible use</span></article>
 <article><h2>Supabase</h2><p>Stores your group’s data.</p><span>Free plan available</span></article>
 </div>
 ${disclosure('services-together', 'How do these services work together?', '<p>Your friends open the app hosted on Vercel. It gets video information from YouTube and saves your group’s accounts and activity in Supabase. Google handles Google sign-in; Supabase stores Villow’s account data.</p><p>You look after these service accounts. Everyday group management happens inside Villow; hosting usage and billing live in the provider dashboards.</p>')}
 </section>

 <section id="managing" class="hc-section" aria-labelledby="hc-managing-title"><h2 id="hc-managing-title">Managing your Villow</h2><p>You’re in control. Sign in as the host and open <strong>Admin</strong> for everyday management.</p>
 <div class="hc-management"><article><h3>Invite your friends</h3><p>Follow the invite steps and share your Villow link.</p></article><article><h3>Manage your group</h3><p>See who’s joined and revoke or restore access.</p></article><article><h3>Keep an eye on usage</h3><p>See how your group uses the YouTube API.</p></article></div>
 <div class="hc-manage-actions"><details class="hc-admin" id="open-admin"><summary>Open your Admin page <span aria-hidden="true">↗</span></summary><div class="hc-admin-body"><p>Use your own Villow’s address, then sign in with the host account.</p><form data-admin-form hidden><label for="villow-address">Your Villow address</label><div class="hc-admin-fields"><input id="villow-address" name="address" type="url" placeholder="https://your-villow.vercel.app" required autocomplete="url" aria-describedby="admin-address-note"><button class="sp-button" type="submit">Open Admin <span aria-hidden="true">↗</span></button></div><p id="admin-address-note">Opens in a new tab. Your address isn’t saved.</p><p data-admin-error role="alert" hidden></p></form><noscript><p>Open your Villow in a new tab, sign in as the host, then choose <strong>Admin</strong> in the navigation.</p></noscript></div></details><a class="hc-setup-link" href="setup-instructions-b.html?path=web#create">Not set up yet? Follow the setup guide.</a></div>
 </section>

 <section id="costs" class="hc-section" aria-labelledby="hc-costs-title"><h2 id="hc-costs-title">What does hosting cost?</h2><p><strong>Start for free. Upgrade only if you need to.</strong> Eligible personal, non-commercial groups can use the free plans, within each provider’s allowances.</p>
 <div class="hc-prices"><article><div><h3>Vercel</h3><p>Free Hobby plan</p></div><p class="hc-price">Pro from <strong>US$20<span>/month</span></strong></p>${external('https://vercel.com/pricing', 'View plans')}</article><article><div><h3>Supabase</h3><p>Free plan</p></div><p class="hc-price">Pro from <strong>US$25<span>/month</span></strong></p>${external('https://supabase.com/pricing', 'View plans')}</article></div>
 <p class="hc-small">Prices in US dollars; taxes and extra usage may apply. Extra projects or seats can add to the bill. ${external('https://vercel.com/docs/plans/hobby', 'Vercel Hobby')} is for personal, non-commercial use.</p>
 <aside class="hc-billing"><h3>Will I be charged automatically?</h3><p>Villow doesn’t charge for hosting. If you choose paid services, Vercel and Supabase bill you directly, including applicable usage charges. Check their billing settings and spending controls before upgrading.</p></aside>
 ${disclosure('free-limits', 'What happens when I reach a free limit?', `<ul class="hc-limits"><li><strong>YouTube:</strong> data requests can stop until the daily quota resets. Paying for hosting doesn’t increase it. <a href="#videos-not-updating">Check video updates</a>.</li><li><strong>Vercel:</strong> a Hobby usage limit can pause hosting. Follow the timing and recovery options in your provider notice. <a href="#wont-open">Get your Villow back online</a>.</li><li><strong>Supabase:</strong> the response depends on the allowance. Separately, free projects can pause after a week of inactivity. <a href="#cant-sign-in">Check your project’s status</a>.</li></ul><p>You may only need to upgrade one service. Before paying, review ${external('https://vercel.com/docs/spend-management', 'Vercel spending controls')} and ${external('https://supabase.com/docs/guides/platform/cost-control', 'Supabase cost controls')}; not every charge is covered by a spend cap.</p>`)}
 </section>

 <section id="troubleshooting" class="hc-section" aria-labelledby="hc-trouble-title"><h2 id="hc-trouble-title">Something not working?</h2><p>Start with what you’re experiencing. These checks work even when you can’t get to Admin.</p><div class="hc-accordions">
 ${problem('wont-open', 'My Villow won’t open', 'Your Villow won’t load, shows a deployment error or says it’s temporarily paused.', `Open your project and team <strong>Usage</strong> in the ${external('https://vercel.com/dashboard', 'Vercel dashboard')}. Check provider emails for a specific error or limit.`, [
 'Try the project’s Vercel address. If that opens but your custom domain doesn’t, check the project’s Domains settings.',
 'If the deployment failed, open its build logs and start with the reported error. Ask for help if you’re unsure what it means.',
 `If Hobby hosting is paused, follow Vercel’s notice. You can ask ${external('https://vercel.com/help', 'Vercel support')} about a one-time courtesy boost; eligibility and terms are up to Vercel. See its ${external('https://community.vercel.com/t/what-to-do-when-your-team-is-paused-or-blocked/45069', 'pause guidance')}.`,
 'Once restored, review usage before deciding whether to wait, reduce future activity or upgrade. Admin is unavailable while hosting is paused.'
 ], '<figure class="hc-paused"><img src="assets/hosting-help/vercel-paused-dark.png" width="570" height="300" loading="lazy" alt="Vercel’s error screen: This deployment is temporarily paused."><figcaption>This screen points to a hosting pause. Check Vercel’s notice for the reason.</figcaption></figure>')}
 ${problem('cant-sign-in', 'I can’t sign in', 'The app opens, but sign-in fails or you can’t access your account.', `Check project status and notices in the ${external('https://supabase.com/dashboard', 'Supabase dashboard')}. If Google shows the error, also check your project’s ${external('https://console.cloud.google.com/auth/overview', 'Google Auth settings')}.`, [
 'If Supabase says the project is paused, follow its restore instructions. An inactivity pause doesn’t automatically mean you need a paid plan.',
 'If you see a usage or database notice, follow the steps for that specific allowance. Don’t assume every sign-in error is a quota issue.',
 'If Google rejects sign-in, confirm you’re using the invited Google account. Check its Testing audience and that the configured redirect address matches the one required by your installation.',
 'Try signing in again after resolving the reported issue. If only one person is affected, the host can also check their access in Admin → People.'
 ])}
 ${problem('videos-not-updating', 'Videos aren’t updating', 'New videos or searches aren’t appearing. A shared YouTube allowance or a failed request could be the cause; already loaded videos may still play.', `In the ${external('https://console.cloud.google.com/apis/dashboard', 'Google Cloud API dashboard')}, select your project, then <strong>YouTube Data API v3 → Quotas &amp; System Limits</strong>. Admin → App API usage can help explain activity, but Google’s dashboard is authoritative.`, [
 'Open Home again: Villow fetches subscription videos when each person opens Home.',
 `If the quota is exhausted, wait until midnight Pacific Time, when ${external('https://developers.google.com/youtube/data/determine_quota_cost', 'daily YouTube quotas reset')}. Review group usage before then.`,
 'If quota remains, look for failed requests in the Vercel project’s runtime logs. Note the error and time for support.',
 'If recommendations or older video details are stale, also check the daily /api/sync job in Vercel’s Cron Jobs settings. That job handles maintenance, not fetching new subscription videos.'
 ], '<p>Paying Vercel or Supabase doesn’t increase YouTube quota. Revoking a member’s access won’t reset usage already counted.</p>')}
 ${problem('friends-cant-join', 'My friends can’t join', 'A friend has your link but can’t get into your Villow.', 'Open Admin → Invite friends and check which Google account your friend is using. If you can’t open Admin, use the provider checks above.', [
 `If your Google project is in Testing, open ${external('https://console.cloud.google.com/auth/audience', 'Google Auth platform → Audience')} and add their Google email under Test users.`,
 'Share the Villow link from Admin → Invite friends. Ask them to use the Google email associated with the YouTube account they want to sign in with.',
 'For someone who has joined before, check Admin → People. Restore their access if you intended to let them return.'
 ])}
 ${problem('something-else', 'Something else isn’t working', 'You’re seeing another error, or the checks above haven’t explained the problem.', `Check ${external('https://www.vercel-status.com/', 'Vercel status')} and ${external('https://status.supabase.com/', 'Supabase status')} for an outage, then note any error shown in Villow.`, [
 'Reload once and note whether the problem affects you, one friend or everyone.',
 'Write down what happened, when it happened and what you’ve already tried. Include the exact error message or a screenshot with private information removed.',
 'Ask the community for help. Never share passwords, API keys, access tokens or unredacted logs.'
 ])}
 </div></section>

 <section id="questions" class="hc-section" aria-labelledby="hc-questions-title"><h2 id="hc-questions-title">Common questions</h2><div class="hc-accordions">
 ${disclosure('updating', 'How do I update my Villow?', `<p>Keep track of Villow releases and follow the instructions for your installation. Don’t assume a new release updates your hosted app automatically: changes can involve both the app and its database.</p><p>Before updating, check the release instructions and make a recoverable backup. The supported owner update walkthrough is still being verified. ${external(discord, 'Ask on Discord')} for guidance for your version before redeploying or changing the database.</p>`)}
 ${disclosure('backups', 'How do I keep my group’s data safe?', `<p>As the host, you control the Supabase project and can access the data stored there. Let friends know this before they join, protect your hosting accounts and keep a recovery plan.</p><p>Check ${external('https://supabase.com/docs/guides/platform/backups', 'Supabase’s backup guidance')} for your plan. Free projects need regular exports kept outside the project. Database backups don’t include files in Supabase Storage. A Villow-specific restore walkthrough is still being verified; ask for help before relying on a backup.</p>`)}
 ${disclosure('stop-hosting', 'What happens if I stop hosting?', `<p>You can stop, but let your friends know first: they’ll lose access to this Villow when it goes offline. Uninstalling the setup app doesn’t close your hosted projects or cancel provider subscriptions.</p><p>Review your Vercel, Supabase and Google Cloud projects, connections and billing. Agree what to keep or delete before closing anything. Deleting the Supabase project permanently removes its data and provider-held backups, including this Villow’s account records; it doesn’t delete anyone’s Google account.</p><p>The full shutdown walkthrough is still being verified. ${external(discord, 'Ask for help planning a shutdown')} before deleting projects.</p>`)}
 </div></section>

 <section id="support" class="hc-support" aria-labelledby="hc-support-title"><div><h2 id="hc-support-title">Need a hand?</h2><p>Setting up, fixing a problem or just unsure? Ask the community.</p><p class="hc-small">Share the error and what you’ve tried. Keep passwords and API keys private.</p></div><a class="sp-button" href="${discord}" target="_blank" rel="noopener noreferrer">Ask for help on Discord <span aria-hidden="true">↗</span></a></section>
 </div>`;
}
