import Link from 'next/link';
import type { Metadata } from 'next';

import PageHead from '@/components/PageHead';
import LegalPage, { type LegalSection } from '@/components/LegalPage';
import { DEPOSIT_PERCENT } from '@/lib/packages';
import { CONTACT } from '@/lib/site';
import { breadcrumbJsonLd, jsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Event booking terms for Priscilla Events and Decor: the 50% deposit policy, cancellation and refund policy, force majeure, and the governing law of Kenya.',
  alternates: { canonical: '/legal/terms' },
  openGraph: {
    title: 'Terms of Service | Priscilla Events and Decor',
    description:
      'Booking terms, the 50% deposit policy, cancellation and refunds, force majeure and Kenyan governing law.',
    url: '/legal/terms',
  },
};

/** The brief's required sections: booking, 50% deposit, cancellation, force majeure, Kenyan law. */
const SECTIONS: LegalSection[] = [
  {
    id: 'the-agreement',
    title: 'The agreement',
    body: (
      <>
        <p>
          These terms apply to every booking of event decoration and styling services from Priscilla
          Events and Decor, a business registered in Kenya with its studio at{' '}
          {CONTACT.studio.display}.
        </p>
        <p>
          A binding agreement exists when all three of these things are true: we have issued you a
          written quotation, you have accepted it in writing (email or WhatsApp is fine), and we have
          received your deposit. Until all three are true, your date is not held and may be booked by
          another client.
        </p>
        <p>
          The quotation, your booking form, and these terms together form the whole agreement. Where
          they conflict, the quotation wins for scope and price, and these terms win for everything
          else.
        </p>
      </>
    ),
  },
  {
    id: 'event-booking-terms',
    title: 'Event Booking Terms',
    body: (
      <>
        <h3>Confirming a date</h3>
        <p>
          Dates are held provisionally for seven days from the date we issue a quotation. After
          seven days the date is released unless you have paid the deposit or we have agreed a
          specific longer hold in writing.
        </p>

        <h3>What we need from you</h3>
        <ul>
          <li>Accurate venue details, including the exact room or outdoor area being used.</li>
          <li>The confirmed event date and the times we may access the venue.</li>
          <li>An estimated guest count at the time of booking, and a confirmed count no later than 30 days before the event.</li>
          <li>Confirmation of any other suppliers we need to coordinate with, and their contact details.</li>
          <li>Written approval of the final design concept, colour palette and flower list.</li>
        </ul>

        <h3>Changes after booking</h3>
        <p>
          Design revisions are welcome up to 21 days before the event, subject to availability of
          flowers and stock. Changes made inside 21 days are possible but limited by what can be
          sourced and built in the time. If a change reduces the scope, the price is not
          automatically reduced, because flowers, materials and crew time may already be committed.
        </p>
        <p>
          Guest count increases after 30 days before the event may be declined or may carry a rush
          sourcing charge, which we will always quote before proceeding.
        </p>

        <h3>Site conditions and access</h3>
        <p>
          Please tell us before booking if the venue has restrictions on load in times, vehicle
          access, noise curfew, power supply, ceiling rigging, open flame, or the use of nails,
          screws, tape or adhesive. If we arrive and cannot build as planned because a restriction was
          not disclosed, and additional hours or equipment are needed, those are chargeable. If we
          cannot build at all, the cancellation terms below apply.
        </p>

        <h3>Weather</h3>
        <p>
          For outdoor events we agree a wet weather plan and a decision time in writing before the
          event. Covering, relocating or reinstalling due to weather inside 24 hours of the event is
          charged at our standard hourly crew rate, because it usually requires a second full build.
        </p>

        <h3>Our obligations</h3>
        <p>
          We will deliver the approved design to a professional standard, arrive with sufficient crew
          and equipment, treat your venue and your suppliers with respect, remove our own waste, and
          leave the venue in the condition we found it.
        </p>

        <h3>Our liability</h3>
        <p>
          Our total liability for any claim is limited to the total value of the booking. We are not
          liable for indirect or consequential loss, including loss of profit or loss of opportunity.
          Nothing in these terms limits liability for death, personal injury or fraud caused by us,
          where Kenyan law does not permit such a limit.
        </p>
      </>
    ),
  },
  {
    id: 'deposit-policy',
    title: 'Deposit Policy (50%)',
    body: (
      <>
        <p>
          <strong>A {DEPOSIT_PERCENT}% deposit confirms your booking.</strong> It is calculated on
          your final quotation, not on a package starting price. It is payable by M-Pesa, bank
          transfer or card, and you receive a receipt and a written confirmation listing your date,
          your scope and the balance due.
        </p>

        <h3>Why we take a deposit</h3>
        <p>
          The deposit secures flowers, materials, crew time and equipment for your date, and it takes
          your date off the market for anyone else. Kenyan wedding season dates are limited, and a
          held date is a real cost to us.
        </p>

        <h3>Paying the balance</h3>
        <p>
          The remaining {100 - DEPOSIT_PERCENT}% is due no later than 14 days before the event. If
          the balance is unpaid 7 days before the event, we may treat the booking as cancelled by
          you. For large events and venue transformations we may agree a staged payment schedule in
          writing, with an instalment due at 60 days and 30 days before the event.
        </p>

        <h3>Extra work on the day</h3>
        <p>
          Additional items requested on the day, such as extra centrepieces or additional lighting,
          are invoiced within seven days after the event and are due immediately on receipt.
        </p>

        <h3>Late payment</h3>
        <p>
          Overdue amounts may carry a late charge of 2% per month on the outstanding balance. We
          would much rather talk than charge you, so please tell us early if a payment is going to be
          late.
        </p>
      </>
    ),
  },
  {
    id: 'cancellation-refunds',
    title: 'Cancellation and Refund Policy',
    body: (
      <>
        <p>
          These are the terms that apply when you cancel, and they exist because by the time we reach
          your event date we have already spent money on your behalf.
        </p>
        <table>
          <caption style={{ textAlign: 'left', padding: '0 0 10px', fontSize: 'var(--fs-meta-lg)' }}>
            Charges on client cancellation, measured from the event date
          </caption>
          <thead>
            <tr>
              <th scope="col">When you cancel</th>
              <th scope="col">What you pay</th>
              <th scope="col">What you receive back</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>More than 60 days before</td>
              <td>10% of the total as an administration charge</td>
              <td>The remaining 90% of what you have paid</td>
            </tr>
            <tr>
              <td>31 to 60 days before</td>
              <td>The {DEPOSIT_PERCENT}% deposit, retained in full</td>
              <td>Any amount paid beyond the deposit</td>
            </tr>
            <tr>
              <td>15 to 30 days before</td>
              <td>75% of the total</td>
              <td>The remaining 25% of what you have paid</td>
            </tr>
            <tr>
              <td>14 days or less before, or on the day</td>
              <td>100% of the total</td>
              <td>Nothing</td>
            </tr>
          </tbody>
        </table>

        <h3>Moving your date instead of cancelling</h3>
        <p>
          Requests to move a date are treated more generously than cancellations, which is
          deliberate. One move is permitted at no charge if the request is made more than 30 days
          before the event, the new date is within twelve months, and we have availability. Flowers
          and materials already purchased for the original date may be non refundable, and we will
          tell you before we proceed.
        </p>
        <p>
          A second move, or a move requested inside 30 days, is treated as a cancellation followed by
          a new booking.
        </p>

        <h3>Cancellation by us</h3>
        <p>
          If we cancel for a reason within our control, you receive a full refund of everything you
          have paid to us within 14 days, and we will do what we reasonably can to help you find
          another studio. If the only reason we cannot perform is a force majeure event described
          below, the next section applies instead.
        </p>

        <h3>Flowers and perishables</h3>
        <p>
          Cut flowers, arrangements and conditioned stock cannot be returned, refunded or exchanged
          once purchased. On a cancellation inside 30 days, the flower portion of your quotation is
          non refundable in all cases. Our quotations always show the flower amount on its own line,
          so you can see exactly what that means before you decide.
        </p>

        <h3>Cancel or reduce scope for other reasons</h3>
        <p>
          A last minute reduction in guest count, a shortened event, or a decision not to use part of
          the approved scope is not a cancellation, and does not create a refund, because the work
          and materials were already committed.
        </p>
      </>
    ),
  },
  {
    id: 'force-majeure',
    title: 'Force Majeure',
    body: (
      <>
        <p>
          Neither party is in breach of these terms for failing to perform because of an event
          outside their reasonable control. Examples include extreme weather, flood, fire, earthquake,
          epidemic or pandemic, government or county restrictions, closure of the venue by
          authorities, national mourning, civil unrest, strike action, failure of a public utility,
          and failure of a supplier that could not reasonably have been avoided.
        </p>
        <p>
          <strong>What happens.</strong> If a force majeure event prevents the event, or prevents us
          from performing it safely, we will notify you as soon as we know, and we will work with you
          in good faith to reschedule within twelve months. If rescheduling is not possible:
        </p>
        <ul>
          <li>
            Anything we have already spent is deducted: flowers, materials, hired equipment, crew
            time and transport already incurred, shown to you with supplier receipts where you ask
            for them.
          </li>
          <li>
            Amounts not yet committed, including unspent crew time and unearned margin, are refunded
            within 21 days.
          </li>
          <li>
            If the force majeure event cancels the event itself rather than our work, and we have not
            spent anything, we refund all amounts paid apart from a 10% administration charge.
          </li>
        </ul>
        <p>
          <strong>Partial performance.</strong> If an event goes ahead in reduced form, or is cut
          short, we will do everything we can to complete the work, and only amounts genuinely
          unspent are refundable.
        </p>
        <p>
          <strong>Insurance.</strong> We strongly recommend event and wedding insurance. Force
          majeure events are exactly what it exists for, and it protects you far better than a
          decorator&apos;s cancellation policy can.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing Law (Kenya)',
    body: (
      <>
        <p>
          These terms are governed by the laws of the Republic of Kenya. The courts of Kenya have
          exclusive jurisdiction over any dispute arising from them.
        </p>
        <p>
          <strong>Talk to us first.</strong> If something goes wrong, contact{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and we will respond within seven
          days, and in most cases within 24 hours. We would always rather fix a problem than argue
          about one.
        </p>
        <p>
          <strong>If we cannot resolve it between us,</strong> the parties agree to attempt mediation
          through a recognised mediation centre in Nairobi before either party commences proceedings.
          If mediation fails, either party may proceed in the Kenyan courts.
        </p>
        <p>
          Where a dispute concerns personal data, you also have the right to complain to the Office
          of the Data Protection Commissioner as set out in our{' '}
          <Link href="/legal/privacy-policy">Privacy Policy</Link>.
        </p>

        <h3>Consumer protection</h3>
        <p>
          Nothing in these terms is intended to exclude or restrict a right you have under the
          Consumer Protection Act or any other Kenyan law that cannot be excluded by agreement. Where
          a term conflicts with such a right, the law wins and the rest of these terms stand.
        </p>

        <h3>Notices</h3>
        <p>
          Written notice may be given by email to the addresses you used on your booking form and to{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> for notices to us. Email is
          sufficient for both parties.
        </p>

        <h3>Severability and variation</h3>
        <p>
          If any part of these terms is found unenforceable, the remainder continues to apply. We may
          update these terms for future bookings, and the version that applies to your booking is the
          one issued with your quotation.
        </p>

        <p className="legal-note">
          These terms were last reviewed in March 2026 and apply to bookings made from that date. They
          are written in plain English and are not a substitute for legal advice. We recommend a
          Kenyan advocate reviews them before you rely on them commercially.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHead
        eyebrow="Legal"
        title="Terms of Service"
        intro="Booking terms, the 50% deposit policy, cancellation and refunds, force majeure, and the governing law of Kenya. Plain English, no traps."
        crumbs={[{ name: 'Terms of Service', href: '/legal/terms' }]}
      />

      <LegalPage
        eyebrow="Legal"
        title="Terms of Service"
        intro="These terms apply to every booking of decoration and styling services from Priscilla Events and Decor."
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
              { name: 'Terms of Service', path: '/legal/terms' },
            ]),
          ),
        }}
      />
    </>
  );
}
