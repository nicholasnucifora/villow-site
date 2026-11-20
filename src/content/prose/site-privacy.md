**Local review revision:** 14 November 2026. This revision has not been published.

## Who is responsible

The website at villow.app and its support service are operated by Nicholas Francis Nucifora, an individual/sole trader (ABN 68 737 669 690), based in Queensland, Australia. Villow is a Fix the Web project. In this policy, “we” means that operator. Contact [support@villow.app](link:contact) with questions or requests about your information.

This policy covers browsing this website, contacting us, supporting the project and linking supporter benefits to Discord. The [browser extension](link:extensionPrivacy) and [Villow web app](link:appPrivacy) have separate policies. These website records are separate from the viewing records in your Villow installation.

## Browsing and device storage

We do not add advertising, visitor analytics or advertising trackers to this website. Its fonts, artwork and scripts are served with the site. Cloudflare hosts the website and support service and receives ordinary request details, including IP address, browser information and the requested address, to deliver and secure them. Its security services may set cookies when needed.

The Get involved page requests payment availability, published supporter messages and currency estimates from our support service on Cloudflare Workers, even if you do not make a payment. These requests send ordinary network information to that service. They do not send your Villow app's viewing records. Currency data is fetched by the server; your browser does not contact the exchange-rate provider directly.

Site controls can remember presentation preferences in your browser's storage. This is device storage, not an analytics profile. The optional Discord connection also uses a short-lived security cookie, explained below. External checkout and sign-in pages have their own cookies and policies.

## Contacting us

The contact form sends your email address, selected topic and message through our Cloudflare service to Resend, which delivers it to the project's support mailbox. We use it to respond, handle your request and keep relevant correspondence. Sending a message does not subscribe you to a mailing list or make it public. You can instead email us directly; your email provider and our receiving mail service then handle delivery.

The form's message body and plain email address are not stored in the support database. They are present in the delivered email and may be held in the mail and delivery providers' records. The form also sends a random request identifier to prevent duplicate delivery on retry. Avoid including passwords, payment credentials or other sensitive information that is unnecessary for your request.

## Payments and public supporter details

Supporting Villow is optional. Stripe runs checkout and payment management on its own pages.

- **Payment processing.** Stripe receives the payment and billing information you provide. Our support database does not store card numbers. As the merchant, we can access payment and customer information available in Stripe's dashboard, including information needed for receipts, refunds and disputes. Our service temporarily processes the checkout email sent by Stripe to match your contribution; it stores a protected fingerprint of it rather than the plain address.
- **Support records.** We keep payment and checkout references, amounts, currencies and dates; subscription references, status and paid-period information; your public-sharing choice and the version of the question you answered; and the protected email fingerprint. A fingerprint is a keyed one-way code. It is still linked to your records and is not anonymous data.
- **Optional publication.** Only an explicit “Yes” to the checkout sharing question allows publication. Leaving it blank means no. With permission, your display name and message may appear on Villow and other Fix the Web projects, alongside the date and whether support is one-time or monthly. A monthly contribution can be labelled current or previous. The amount and currency appear only if your sharing question included them. An automatic language check on our support service can hold a name or message for manual review; other shared details can appear immediately. We may hide entries after review or mask individual words while keeping the rest of the message. The original remains available privately for review until you remove your public details. We do not publish your email, card details or private payment references.
- **Removing public details.** Use “Sharing & privacy” on the [support page](/support) with your checkout email. Resend delivers a verification link, valid for 30 minutes. Confirming it clears your name and message from the support database, stops the contribution being displayed and records your choice so later payments do not republish it. Copies another person made while it was public may remain outside our control. Removal does not cancel monthly payments, remove supporter benefits or erase accounting records. Use “Manage monthly support” to cancel payments.

## Optional Discord connection

You can verify your checkout email and then choose to connect Discord to receive supporter benefits. Verification links expire after 30 minutes. The next step opens Discord's authorisation screen for access to identify your account and join the supporter server on your behalf. Connecting is optional; a payment alone does not connect Discord.

During this flow, our service reads your Discord account identifier and uses temporary access to join the server and manage supporter roles. We store the Discord user ID matched to your protected checkout-email fingerprint, connection dates and role-sync status. We do not store your Discord password, username, avatar or access token in the support database. The connection does not give our service access to your private Discord messages. As server administrators, we can see information and messages you make available in that server under Discord's normal permissions.

The service checks payment and subscription records to maintain the Supporter and Ongoing Supporter roles. The supporter community is shared with other Fix the Web projects, so eligible contributions associated with the same verified email can be considered together. This does not publish your email or payment records to other members.

To protect the authorisation redirect, the support service sets a secure, HTTP-only cookie called `__Host-ftw-discord` with a maximum age of ten minutes and stores a matching temporary verification record. The temporary Discord access token is used during the connection callback, is not saved in the database, and is submitted for revocation after use. If Discord cannot complete that revocation, you can also remove the authorisation in Discord's settings.

To disconnect, use “Connect Discord” again, verify your checkout email and choose “Disconnect”. We stop automatic benefit syncing for that connection and request removal of the managed supporter roles. If Discord is unavailable, the mapping stays marked for disconnection while removal is retried; it is deleted when removal succeeds or Discord reports that the membership no longer exists. You can choose to connect again after disconnection completes. Disconnecting does not cancel payments, leave the server, delete server messages or erase payment records. You can leave the server or manage Discord authorisations separately. The service does not automatically rejoin you after you leave.

## Protection and retention

Access to the support database and provider accounts is restricted through their access controls and server credentials. No system can guarantee perfect security. We do not sell these records or use them for advertising profiles.

To prevent abuse, the service stores request counters against protected fingerprints of IP addresses or email addresses. Depending on the action, a counter window is ten minutes or one hour. The application does not save the plain IP address in these counters; Cloudflare still receives it when handling the request.

- Private moderation sign-in uses a secure, HTTP-only cookie lasting up to eight hours on fixtheweb.org/admin/support. Session tokens are stored only as hashes. Checkout return tokens are also stored as hashes and expire after 24 hours; the browser keeps the token in its current history entry to check payment and sharing status.
- Expired counters, admin sessions, checkout return tokens, used or expired email-verification tokens, and expired Discord redirect records are removed by scheduled cleanup. Links stop working when expired even before cleanup runs.
- Stripe event identifiers used to prevent duplicate processing are removed after 90 days by scheduled cleanup.
- Payment and subscription records are retained for reconciliation, accounting, refunds and disputes. The service does not currently apply an automatic expiry to those records. Public text remains until removed or no longer needed; the email fingerprint recording withdrawal remains to prevent accidental republication. Contact us about review or deletion of these records.
- Discord connection records remain while linked, or while a requested role removal is awaiting completion, as described above.
- Correspondence remains in the support mailbox until deleted. We review what is needed for an enquiry, follow-up or dispute when handling a deletion request. We do not currently apply an automatic deletion schedule to correspondence.

Deletion from an active service is different from expiry of provider backups and logs. Cloudflare D1's recovery history can retain earlier database states for up to 30 days, depending on the plan. Mail, payment and other providers retain their own records under their applicable settings and obligations. A restored database must have completed removal requests reapplied before public display resumes.

## Providers and overseas handling

Our providers include [Cloudflare](https://www.cloudflare.com/privacypolicy/) for hosting, security and the support database, [Stripe](https://stripe.com/privacy) for payments, and [Resend](https://resend.com/legal/privacy-policy) for contact and verification email delivery. [Discord](https://discord.com/privacy) handles its authorisation flow, accounts and community activity. Their linked policies explain their own handling. These providers use international infrastructure and may process information outside Australia, including in the United States. The operator being based in Queensland does not mean all data is stored in Queensland.

We may also use or disclose relevant records where needed to meet a legal obligation or address fraud, a security incident or a legal claim. Public supporter details are shared only as described above. Following a link to GitHub, Reddit, a browser store or another website takes you to a service governed by its own policy.

## Your choices, requests and complaints

You may browse without sending a message, making a payment or connecting Discord. Each optional feature needs the information described above to work. You can ask us to explain what we hold, correct information, review retention, remove public details or address a privacy complaint. We may need proportionate verification before changing or disclosing records. We will explain if a request cannot be completed, including where records must be retained by law. This policy does not limit rights available under applicable law.

Email [support@villow.app](link:contact) or use the [contact page](/contact). If you are dissatisfied with our response, you can seek guidance from the [Office of the Australian Information Commissioner](https://www.oaic.gov.au/privacy/privacy-complaints) or another regulator with jurisdiction. The complaint routes available depend on which laws apply.

## Age and changes

Reading this website does not require an account or impose the connected app's 16+ minimum. Payments and Discord use remain subject to the relevant service's eligibility rules. If you believe a child has sent information that should be removed, contact us.

We update this policy when the website's handling changes. Material new uses will be explained and any required permission obtained before they begin. A policy update does not itself authorise a new use of your information.
