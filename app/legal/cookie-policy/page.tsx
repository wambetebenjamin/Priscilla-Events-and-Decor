import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import LegalPage, { type LegalSection } from '@/components/LegalPage';
import { CONTACT, SITE } from '@/lib/site';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Every cookie and browser storage item used by the Priscilla Events and Decor website, what each one is for, how long it lasts, and how to change your choice at any time.',
  alternates: { canonical: '/legal/cookie-policy' },
  openGraph: {
    title: 'Cookie Policy | Priscilla Events and Decor',
    description:
      'A full breakdown of every cookie and storage item on this site, with the categories you can control.',
    url: '/legal/cookie-policy',
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: 'what-cookies-are',
    title: 'What cookies are',
    body: (
      <>
        <p>
          A cookie is a small text file a website asks your browser to store. A closely related
          technology is browser storage, usually localStorage, which holds a value in your browser
          without sending it to the server on every request.
        </p>
        <p>
          Both are used for similar reasons: remembering a choice you made, keeping a form secure, or
          measuring which pages are useful. Neither can read files on your device or look at other
          websites you have visited.
        </p>
      </>
    ),
  },
  {
    id: 'our-position',
    title: 'Our position, in plain terms',
    body: (
      <>
        <p>
          This website sets as little as it can get away with. There are no advertising trackers, no
          cross site tracking pixels, no session recording, and no social media tracking scripts
          embedded on any page.
        </p>
        <p>
          When you load a page, your browser downloads self hosted fonts and images from this site
          only. The exceptions, all of which are listed honestly below, are Google reCAPTCHA on our
          forms, and the services you reach by clicking a link such as Instagram, WhatsApp or Google
          Maps.
        </p>
      </>
    ),
  },
  {
    id: 'necessary',
    title: 'Necessary (always on)',
    body: (
      <>
        <p>
          These keep the site working and keep our forms secure. They cannot be switched off through
          the banner, because without them the site cannot function.
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Type</th>
              <th scope="col">Purpose</th>
              <th scope="col">Lasts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>priscilla.cookie.consent.v1</code>
              </td>
              <td>localStorage</td>
              <td>
                Stores your cookie choices and the date you made them, so the banner does not ask
                again and so we can evidence your consent under the Data Protection Act 2019.
              </td>
              <td>Until you clear your browser storage</td>
            </tr>
            <tr>
              <td>
                <code>_GRECAPTCHA</code>
              </td>
              <td>Cookie, set by Google</td>
              <td>
                Used by reCAPTCHA to determine whether a form submission comes from a person or an
                automated script. Set on any page containing a form.
              </td>
              <td>Up to 6 months</td>
            </tr>
            <tr>
              <td>Server request logs</td>
              <td>Server side</td>
              <td>
                Standard hosting logs recording which pages were requested. No cookie is set and
                the data is not used to identify individuals.
              </td>
              <td>Rolling, per hosting provider policy</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>A note on reCAPTCHA.</strong> reCAPTCHA is operated by Google and sends hardware and
          software information to Google, which is why we list it here rather than pretending it is
          invisible. It is on the site for security, not advertising. Google&apos;s handling of that
          information is governed by the Google Privacy Policy and Terms of Service.
        </p>
      </>
    ),
  },
  {
    id: 'functional',
    title: 'Functional (your choice)',
    body: (
      <>
        <p>
          Functional storage remembers preferences so you do not have to set them again. It is off
          until you turn it on in the banner&apos;s Manage Preferences panel.
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Purpose</th>
              <th scope="col">Lasts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Last viewed package</td>
              <td>
                Remembers which package you looked at, so a return visit opens where you left off
                rather than at the top of the page.
              </td>
              <td>90 days</td>
            </tr>
            <tr>
              <td>Style quiz progress</td>
              <td>
                Saves your style quiz answers in your own browser so a reload does not lose them.
                They are never sent to us. See the note below.
              </td>
              <td>Session only</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Important, about the style quiz.</strong> The quiz itself does not store anything,
          by design. Your answers are held in the page&apos;s memory while you use it and are gone
          when you close the tab. If functional storage is switched on we may additionally keep them
          in your browser so a reload does not lose your place, but that value stays on your device
          and is never transmitted to us.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: 'Analytics (your choice)',
    body: (
      <>
        <p>
          <strong>Default state: off.</strong> This site currently sets no analytics cookies at all.
          We read aggregate server request counts to understand which pages are popular, and those
          counts contain no personal identifiers.
        </p>
        <table>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Purpose</th>
              <th scope="col">Lasts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Analytics category</td>
              <td>
                Reserved. If we add a measurement tool, it will only load after you switch this
                category on, and this policy will be updated before it does. It will be configured
                to anonymise IP addresses and will not be used for advertising.
              </td>
              <td>Not yet set</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: 'marketing',
    title: 'Marketing (your choice)',
    body: (
      <>
        <p>
          <strong>Default state: off, and currently unused.</strong> We do not run advertising
          pixels on this website and we do not retarget visitors. There is no Facebook Pixel, no
          Google Ads tag, no TikTok pixel and no LinkedIn insight tag on any page.
        </p>
        <p>
          If we ever run a campaign that needs a marketing cookie, it will only load after you switch
          this category on, and this page will show exactly what is set, who sets it and for how
          long, before it goes live.
        </p>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Third party services you may reach',
    body: (
      <>
        <p>
          These do not run on our pages, but clicking a link takes you to them, and they set their
          own cookies under their own policies. We do not control them and we do not receive personal
          data back from them.
        </p>
        <ul>
          <li>
            <strong>WhatsApp</strong>, when you use any of our WhatsApp buttons. The message you send
            us is handled by Meta under the WhatsApp Privacy Policy.
          </li>
          <li>
            <strong>Google Maps</strong>, in the embedded map on the contact page. The embed is
            loaded from Google and may set cookies when it loads.
          </li>
          <li>
            <strong>Instagram, Facebook, TikTok, Pinterest and LinkedIn</strong>, through the social
            links in the footer. Nothing loads from these networks unless you click through.
          </li>
          <li>
            <strong>Google reCAPTCHA</strong>, described in the Necessary section above, because it
            does run on our form pages.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'managing-your-choice',
    title: 'Managing your choice',
    body: (
      <>
        <p>
          <strong>Changing your mind.</strong> Clear this site&apos;s browser storage, or open the
          banner again by clearing the consent item, and the banner will reappear so you can choose
          differently. Every optional category stays off until you turn it on.
        </p>
        <p>
          <strong>Browser controls.</strong> Every browser lets you block or delete cookies in its
          privacy settings. Blocking necessary storage will not break the site, but the cookie banner
          will ask again on each visit, and forms may re-run their security check more often.
        </p>
        <p>
          <strong>Do Not Track and Global Privacy Control.</strong> We honour these signals as an
          instruction not to load optional categories. If your browser sends one of them, we treat
          functional, analytics and marketing as refused regardless of the banner.
        </p>
        <p>
          <strong>Questions.</strong> Write to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{' '}
          or WhatsApp {CONTACT.phoneDisplay}. Our fuller explanation of how we handle personal data is
          in the <Link href="/legal/privacy-policy">Privacy Policy</Link>, and our booking terms are in
          the <Link href="/legal/terms">Terms of Service</Link>.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <>
        <p>
          We review this page whenever we add, remove or change anything that stores information in
          your browser. The &quot;last updated&quot; date below always reflects the current version.
        </p>
        <p className="legal-note">
          Reviewed by the {SITE.name} studio. Not legal advice. We recommend a Kenyan advocate
          reviews this policy alongside the{' '}
          <Link href="/legal/privacy-policy">Privacy Policy</Link> before you rely on it commercially.
        </p>
      </>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <PageHead
        eyebrow="Legal"
        title="Cookie Policy"
        intro="A full breakdown of every cookie and storage item on this site, what each one does, how long it lasts, and how to change your choice."
        crumbs={[{ name: 'Cookie Policy', href: '/legal/cookie-policy' }]}
      />

      <LegalPage
        eyebrow="Legal"
        title="Cookie Policy"
        intro="We set as little as we can get away with. Everything we do set, and everything we deliberately do not, is listed here."
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
              { name: 'Cookie Policy', path: '/legal/cookie-policy' },
            ]),
          ),
        }}
      />
    </>
  );
}
