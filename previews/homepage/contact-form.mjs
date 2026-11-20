export const contactTopics = [['general','A question or another idea'],['code','Code, testing or documentation'],['design','Design feedback or research'],['policy','Policy, MPs, senators or organisations'],['sharing','Creators, media or sharing Villow']];

export function contactForm(id='contact') {
 return `<form class="contact-form" data-contact-form aria-label="Send a message" method="post">
 <label for="${id}-email">Your email</label><input id="${id}-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com">
 <label for="${id}-topic">Topic</label><select id="${id}-topic" name="topic">${contactTopics.map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select>
 <label for="${id}-message">Your message</label><textarea id="${id}-message" name="message" rows="7" minlength="10" maxlength="3000" required placeholder="Share a question, an idea, or how you’d like to help."></textarea>
 <div class="contact-honeypot" aria-hidden="true"><label for="${id}-website">Leave this empty</label><input id="${id}-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
 <p class="contact-privacy">Sent privately to Villow through Resend so we can reply. No mailing-list signup. <a href="/site-privacy#contacting-us">How we handle your message</a>.</p>
 <div class="contact-submit"><button class="sp-button" type="submit" disabled>Send message</button><p data-contact-status role="status" aria-live="polite"></p></div>
 <noscript><p>Please enable JavaScript to use this form.</p></noscript></form>`;
}

export function contactPageBody() {
 return `<section class="contact-page sp-width" id="contact"><div class="contact-intro"><h1>Let’s talk.</h1><p>Questions, feedback, collaborations or a useful introduction—all are welcome. Write your message here and leave an email address for a reply.</p><p>Want to help with Villow? <a href="help-a.html#get-involved">Explore ways to get involved.</a></p></div>${contactForm('contact-page')}</section>`;
}
