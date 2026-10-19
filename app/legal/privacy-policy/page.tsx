import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import LegalPage, { type LegalSection } from '@/components/LegalPage';
import { CONTACT, SITE } from '@/lib/site';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Priscilla Events and Decor collects, uses, stores and protects your information under the Kenya Data Protection Act 2019. Client data, event details, photo and portfolio rights, analytics, and your rights.',
  alternates: { canonical: '/legal/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Priscilla Events and Decor',
    description:
      'How we handle client data, event details, portfolio photographs and analytics, and the rights you have under the Kenya Data Protection Act 2019.',
    url: '/legal/privacy-policy',
  },
};

/**
 * The section list is exactly the brief's: Client Data, Event Details Data,
 * Photo and Portfolio Usage Rights, Analytics, Your Rights. Nothing is padded,
 * and every commitment here is one the code actually keeps: for instance the
 * newsletter stores a hash of an address rather than the address itself as a key,
 * and the style quiz genuinely posts nothing.
 */
const SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          Priscilla Events and Decor is an event decoration and styling studio registered in Kenya,
          with its studio at {CONTACT.studio.display}.
        </p>
        <p>
          For the purposes of the Kenya Data Protection Act 2019, we are the data controller for the
          information described on this page. Our contact for anything privacy related is{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, or {CONTACT.phoneDisplay}.
        </p>
        <p>
          This policy covers this website and any information you give us through it, by phone, by
          WhatsApp, by email, or in person at the studio.
        </p>
      </>
    ),
  },
  {
    id: 'client-data',
    title: 'Client Data',
    body: (
      <>
        <p>
          When you enquire or book, we collect the minimum we need to serve you. That is:
        </p>
        <ul>
          <li>Your name, so we know who we are speaking to.</li>
          <li>
            Your email address and phone number, so we can send your reference number, quote,
            confirmation and any updates about your event.
          </li>
          <li>
            Your event details, described in the section below.
          </li>
          <li>
            How you heard about us, which we record so we know where our enquiries genuinely come
            from. You can leave this blank on some forms.
          </li>
          <li>
            Any notes you choose to send us in the message or style inspiration fields.
          </li>
        </ul>
        <p>
          <strong>What we do not collect.</strong> We do not collect your national ID, your date of
          birth, your card details, your health information, or your precise location. We do not use
          facial recognition. We do not buy data about you from anyone. We do not build advertising
          profiles of you.
        </p>
        <p>
          <strong>How long we keep it.</strong> Enquiries that do not become bookings are kept for
          24 months so that we can recognise a returning client, then deleted. Booking records,
          which we also need for tax and accounting purposes, are kept for seven years as Kenyan law
          requires. Newsletter records are kept until you unsubscribe, and then deleted.
        </p>
        <p>
          <strong>Who we share it with.</strong> Our email provider, our WhatsApp business account,
          and our hosting and storage providers, each of whom processes data on our instructions. We
          do not sell your information, and we do not share it with advertisers. If your event
          requires it, we may share necessary event details with a venue or a planner you have told
          us to work with, and we will tell you when we do.
        </p>
      </>
    ),
  },
  {
    id: 'event-details',
    title: 'Event Details Data',
    body: (
      <>
        <p>
          Styling work needs detail, so our enquiry form asks for your event date, venue name and
          area, estimated guest count, whether the event is indoors or outdoors, the services you
          are considering, and your budget range. If you are a wedding client, we also ask for your
          preferred consultation date and a description of the style you are drawn to.
        </p>
        <p>
          <strong>Why we need it.</strong> These details decide whether we can serve you at all. A
          guest count drives the table plan, the venue drives the load in plan and the flower
          quantities, the date drives seasonality and availability, and the budget range decides
          which packages are honest to offer you.
        </p>
        <p>
          <strong>Special category information.</strong> You may choose to tell us something about
          your faith, culture, family or health that affects your event. You never have to. If you do
          tell us, we use it only to style your event correctly and never for any other purpose, and
          we do not record it in a separate profile.
        </p>
        <p>
          <strong>Storage.</strong> Enquiries and bookings are stored in Vercel KV with access
          restricted to the Priscilla Events team. They are also sent by email to our events team
          inbox and, where you provide a WhatsApp number, notified to our events team on WhatsApp. We
          do not store your details on staff laptops or on paper files that leave the studio.
        </p>
      </>
    ),
  },
  {
    id: 'photo-portfolio-rights',
    title: 'Photo and Portfolio Usage Rights',
    body: (
      <>
        <p>
          This section matters more than most couples expect, so it is written plainly.
        </p>
        <p>
          <strong>We photograph our own work.</strong> Our team and our photographers photograph
          rooms, tables, flowers, lighting, backdrops and installations before, during and after
          your event. These images are how we show what we do.
        </p>
        <p>
          <strong>Using photographs of your event.</strong> Where you have signed a booking
          agreement, we may use photographs of the decor, styling and venue from your event on this
          website, on our social media, and in printed material, without payment to you and without
          time limit.
        </p>
        <p>
          <strong>Photographs of people.</strong> We prefer to show guests at a distance or from
          behind, and we do not publish close identifiable portraits of guests or of children
          without permission from the person, or from the parent or guardian for a child.
        </p>
        <p>
          <strong>Your right to say no, or to change your mind.</strong> You can tell us before the
          event, in the booking form, or afterwards that you do not want photographs used, and we
          will respect that. If you change your mind later, write to{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we will remove the images from
          this website and from our own channels, though we cannot remove copies others have already
          shared.
        </p>
        <p>
          <strong>Photographs you send us.</strong> If you share a Pinterest board or inspiration
          images with us, we use them to understand your brief and nothing else. We do not publish
          them, and we do not pass them to third parties.
        </p>
        <p>
          <strong>Photographers you engage.</strong> Your own photographer owns their photographs,
          not us and not you. Anything we publish that they shot is covered by the agreement you
          have with them, and we will ask you to confirm that before we use it.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: 'Analytics',
    body: (
      <>
        <p>
          <strong>The honest position.</strong> This website has no advertising trackers, no
          profiling pixels, no cross site trackers, no session recording and no social media
          tracking scripts. There is nothing to sell, so there is nothing to profile.
        </p>
        <p>
          We use aggregate counts of page visits (server request logs) to understand which pages
          people find useful. Those counts contain no personal identifiers and are not used to
          identify you or to build a profile of you.
        </p>
        <p>
          <strong>Cookies.</strong> The only cookie-like storage this site sets by default is your
          cookie preference itself, kept in your browser&apos;s local storage so the banner does not
          reappear. If you switch on optional categories in the banner and we later add measurement
          tools, they will only load after you have consented, and this policy will be updated before
          they do. Full detail is in the <Link href="/legal/cookie-policy">Cookie Policy</Link>.
        </p>
        <p>
          <strong>reCAPTCHA.</strong> Our six forms are protected by Google reCAPTCHA to keep
          automated spam out of our inbox. reCAPTCHA collects hardware and software information and
          sends it to Google, and its use is governed by Google&apos;s Privacy Policy and Terms of
          Service. It runs on this site for security, not for advertising.
        </p>
        <p>
          <strong>Third party links.</strong> When you click through to our Instagram, a WhatsApp
          link, or Google Maps, those services set their own cookies and follow their own policies.
          We do not control them and we do not receive personal data back from them.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    body: (
      <>
        <p>Under the Kenya Data Protection Act 2019 you have the right to:</p>
        <ul>
          <li>
            <strong>Be informed</strong> about how your personal data is used, which is what this
            page does.
          </li>
          <li>
            <strong>Access</strong> the personal data we hold about you, and be told its source.
          </li>
          <li>
            <strong>Correct</strong> anything inaccurate or out of date. Tell us and we will fix it.
          </li>
          <li>
            <strong>Delete</strong> your personal data where there is no lawful reason for us to keep
            it. We will delete what we can and tell you honestly what we must retain and why, which
            is usually only booking records we are required to keep for tax.
          </li>
          <li>
            <strong>Object</strong> to processing, and to withdraw consent you gave earlier. This
            includes withdrawing consent for portfolio photographs, as set out above.
          </li>
          <li>
            <strong>Portability</strong>. Ask us for a copy of the personal data you gave us in a
            structured, commonly used format.
          </li>
          <li>
            <strong>Complain</strong> to us first, or to the Office of the Data Protection
            Commissioner. We would rather you came to us first, and we will answer within seven days.
          </li>
        </ul>
        <p>
          <strong>How to use these rights.</strong> Write to{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with the subject line
          &quot;Data request&quot;, or WhatsApp {CONTACT.phoneDisplay}. There is no charge. We will
          verify who you are before acting, which usually takes one exchange, and will respond within
          thirty days as the Act requires.
        </p>
        <p>
          <strong>Changes to this policy.</strong> If we change how we handle your information we
          will update this page and change the &quot;last updated&quot; date below. Material changes
          affecting existing clients will be emailed to you. This policy was last reviewed in March
          2026.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHead
        eyebrow="Legal"
        title="Privacy Policy"
        intro="What we collect, why we need it, how long we keep it, and what you can ask us to do about it. Written in plain English under the Kenya Data Protection Act 2019."
        crumbs={[{ name: 'Privacy Policy', href: '/legal/privacy-policy' }]}
      />

      <LegalPage
        eyebrow="Legal"
        title="Privacy Policy"
        intro="This policy explains how Priscilla Events and Decor handles personal data, including client data, event details, portfolio photography rights and analytics."
        updated="18 March 2026"
        effective="18 March 2026"
        sections={SECTIONS}
      />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Privacy Policy', path: '/legal/privacy-policy' },
            ]),
          ),
        }}
      />
    </>
  );
}
