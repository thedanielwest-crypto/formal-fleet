import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — Fleet Formal",
  description: "The terms that govern using Fleet Formal as a driver, student, parent, or school.",
};

const sectionClass = "mb-9";
const hClass = "font-serif text-[19px] mb-2.5";
const pClass = "text-[14px] text-[#454e60] leading-relaxed";
const ulClass = "text-[14px] text-[#454e60] leading-relaxed list-disc pl-5 flex flex-col gap-1.5";

export default function TermsPage() {
  return (
    <div>
      <Header />

      <section className="bg-[linear-gradient(180deg,rgba(13,27,42,0.90),rgba(13,27,42,0.82)_55%,rgba(22,41,62,0.95)),url('/photos/brand-hero.jpg')] bg-cover bg-center bg-no-repeat text-white px-6 md:px-14 pt-10 pb-9">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">Terms &amp; Conditions</h1>
        <p className="mt-3 text-slate-300 max-w-xl text-[14px]">
          Last updated 19 November 2026. Please read these terms carefully before using Fleet Formal.
        </p>
      </section>

      <div className="px-6 md:px-14 py-10 max-w-3xl">
        <div className="bg-amber-bg border border-amber/30 rounded-2xl px-6 py-5 mb-10 text-[13px] text-[#6b4a12] leading-relaxed">
          <strong>A note before this goes live:</strong> this draft was prepared to describe Fleet
          Formal&rsquo;s current pricing, commission, and verification model in plain language. It
          is not legal advice, and we strongly recommend a qualified Australian lawyer reviews and
          finalises this document — particularly the liability, insurance, and transport-licensing
          sections — before it is published as the binding terms for real bookings.
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>1. What Fleet Formal is</h2>
          <p className={pClass}>
            Fleet Formal is an online marketplace that connects independent vehicle owners
            (&ldquo;Owners&rdquo; or &ldquo;Drivers&rdquo;) with students, parents, guardians, and
            schools (&ldquo;Riders&rdquo;) who are looking for a vehicle and driver for formal
            night and other occasions. Fleet Formal does not own, lease, or operate any vehicle
            listed on the platform, and does not itself provide transport services. Each Owner is
            an independent party responsible for their own vehicle, licensing, insurance, and
            conduct.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>2. Pricing</h2>
          <p className={pClass}>
            Every booking on Fleet Formal is priced by the hour. The minimum rate for any listing
            is $350 per hour (AUD, inclusive of GST where applicable). Owners may set a higher
            hourly rate at the time they list their car. The final price for a booking is the
            agreed hourly rate multiplied by the agreed booking duration, as confirmed between the
            Rider (and their parent/guardian, where the Rider is a minor) and the Owner before the
            booking is finalised.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>3. Service fee</h2>
          <p className={pClass}>
            Fleet Formal retains a service fee of 25% of the total booking price. This fee is how
            Fleet Formal funds (a) a contribution back to the student&rsquo;s school or P&amp;C
            committee, and (b) the cost of running, maintaining, and verifying the platform. The
            remaining 75% of the booking price is paid to the Owner. Where Fleet Formal&rsquo;s
            marketing or public-facing pages describe this arrangement, they will refer to it only
            as &ldquo;a percentage of each booking,&rdquo; with the exact figure disclosed here and
            to the Owner directly at the time they list their vehicle, since Owners need the real
            number to consent to it.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>4. Verification &amp; listing status</h2>
          <p className={pClass}>Every listing on Fleet Formal carries one of three statuses:</p>
          <ul className={`${ulClass} mt-2`}>
            <li>
              <strong>Gold Verified</strong> — the Owner&rsquo;s identity, driver&rsquo;s licence,
              insurance, and Working With Children Check (Blue Card) have all been confirmed by
              Fleet Formal.
            </li>
            <li>
              <strong>Verified</strong> — the Owner&rsquo;s driver&rsquo;s licence and insurance
              have been confirmed; Blue Card verification may still be in progress.
            </li>
            <li>
              <strong>Verification Pending</strong> — the listing has not yet been confirmed by
              Fleet Formal and is not currently bookable. Some Pending listings showcase vehicles
              from our local car-club community who have not yet opted in or completed
              verification — these are shown as a preview of the fleet we hope to welcome, not as
              an offer to book.
            </li>
          </ul>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>5. Parent &amp; guardian confirmation</h2>
          <p className={pClass}>
            Where a Rider is under 18, no booking is finalised until a parent or guardian has
            confirmed it. Fleet Formal will not release pickup details or finalise payment
            arrangements for a booking involving a minor until this confirmation is received.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>6. Cancellations</h2>
          <p className={pClass}>
            Either party may cancel a confirmed booking by notifying the other party and Fleet
            Formal as soon as possible. Bookings cancelled within 48 hours of the scheduled event
            may be subject to a cancellation fee payable to the Owner, at the Owner&rsquo;s
            discretion, to cover lost opportunity cost. Fleet Formal&rsquo;s service fee is only
            charged on bookings that are completed.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>7. Conduct</h2>
          <p className={pClass}>
            Every Owner agrees to a respect-first code of conduct before their listing goes live.
            Disrespectful, unsafe, or dishonest behaviour by an Owner toward a Rider, or by a Rider
            toward an Owner, may result in suspension or permanent removal from Fleet Formal.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>8. Insurance &amp; liability</h2>
          <p className={pClass}>
            Owners are solely responsible for holding a current, valid driver&rsquo;s licence and
            an appropriate insurance policy covering their vehicle and any passengers carried for
            the type of trips offered on Fleet Formal. Fleet Formal acts only as a booking
            platform and is not a party to the transport arrangement itself; Fleet Formal does not
            accept liability for the acts or omissions of any Owner or Rider, for the roadworthiness
            of any vehicle, or for any loss, injury, or damage arising from a booking made through
            the platform, to the maximum extent permitted by law.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>9. Changes to these terms</h2>
          <p className={pClass}>
            Fleet Formal may update these terms from time to time. Material changes — including
            any change to the minimum hourly rate or service fee — will be posted on this page
            with an updated effective date.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>10. Governing law</h2>
          <p className={pClass}>
            These terms are governed by the laws of Queensland, Australia.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>11. Contact</h2>
          <p className={pClass}>
            Questions about these terms can be sent to the Fleet Formal team through the contact
            details on our{" "}
            <a href="/for-schools" className="underline font-semibold">For Schools</a> page, or via
            our{" "}
            <a href="/privacy" className="underline font-semibold">Privacy Policy</a> for data
            matters.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
