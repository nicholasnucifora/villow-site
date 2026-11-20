export const returnCopy = {
  published: 'Your contribution is confirmed, and the details you chose to share are now public. Thank you for helping Villow grow.',
  review: 'Your contribution is confirmed — thank you for helping Villow grow. Your message is waiting for a quick review before it appears. We appreciate your support.',
  hidden: 'Your contribution is confirmed — thank you for helping Villow grow. Your message isn’t currently shown publicly, and your supporter benefits stay with you.',
  private: 'Your contribution is confirmed — thank you for helping Villow grow. Your details will stay private.',
};

export function mountCheckoutReturn(root, { payment, token, request, reloadFeed }) {
  const get = selector => root.querySelector(selector);
  const notice = get('[data-checkout-return]'), title = get('[data-checkout-return-title]'), copy = get('[data-checkout-return-copy]');
  const retry = get('[data-checkout-return-retry]');
  let active = false, tries = 0, timer;
  const manual = 'If you chose to share a message, it will appear here once manually reviewed. It won’t appear immediately after checkout.';
  const automatic = 'Messages you choose to share usually appear after payment is confirmed. Some wait for a quick review before they appear.';
  if (payment === 'returned' || payment === 'cancelled') {
    notice.hidden = false;
    title.textContent = payment === 'returned' ? 'Thanks for supporting Villow.' : 'Checkout closed.';
    copy.textContent = payment === 'returned' ? (token ? 'Confirming your contribution…' : manual) : 'You can try again whenever you like.';
  }
  async function check() {
    if (active || !token) return;
    clearTimeout(timer); active = true; retry.hidden = true; tries++;
    try {
      const result = await request('checkout-status', { token });
      if (result.payment === 'paid' && Object.hasOwn(returnCopy, result.sharing)) {
        copy.textContent = returnCopy[result.sharing];
        if (result.sharing === 'published') await reloadFeed();
      } else if (result.payment === 'processing' && tries < 6) {
        copy.textContent = 'Your payment is still being confirmed. This page will check again shortly. Thank you for your support.';
        timer = setTimeout(check, Math.min(tries * 2000, 8000));
      } else {
        copy.textContent = 'Your confirmation isn’t ready yet. Please check again in a little while. There’s no need to make another payment.';
        retry.hidden = false;
      }
    } catch (error) {
      copy.textContent = error.status === 400
        ? 'This confirmation link has expired. You can still check your Stripe receipt. Any shared message follows your privacy choices and our review process.'
        : 'We couldn’t check your confirmation just now. Please try again. There’s no need to make another payment.';
      retry.hidden = error.status === 400;
    } finally { active = false; }
  }
  retry.addEventListener('click', () => { tries = 0; void check(); });
  window.addEventListener('pagehide', () => clearTimeout(timer));
  return { unavailable() {
    if (payment !== 'returned' || !token) return;
    copy.textContent = 'We couldn’t check your confirmation just now. Please try again. There’s no need to make another payment.';
    retry.hidden = false;
  }, configure(config) {
    const auto = config.messageReview === 'automatic';
    for (const note of root.querySelectorAll('[data-review-note]')) note.textContent = auto
      ? 'Public messages usually appear straight away. Some wait for a quick review.' : 'Public messages appear after review.';
    const privacy = get('[data-review-privacy]');
    if (privacy) privacy.textContent = auto
      ? 'An automatic language check holds some messages for review before publication. Other shared messages appear immediately and may be reviewed or hidden later. A moderator may mask individual words while keeping the rest of your message.'
      : 'Messages are manually reviewed before they appear publicly.';
    if (payment === 'returned') {
      if (token) void check(); else copy.textContent = auto ? automatic : manual;
    }
  } };
}
