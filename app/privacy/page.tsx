import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Fleet Formal",
  description: "How Fleet Formal collects, uses, and protects personal information.",
};

const sectionClass = "mb-9";
const hClass = "font-serif text-[19px] mb-2.5";
const pClass = "text-[14px] text-[#454e60] leading-relaxed";
const ulClass = "text-[14px] text-[#454e60] leading-relaxed list-disc pl-5 flex flex-col gap-1.5";

export default function PrivacyPage() {
  return (
    <div>
      <Header />

      <section className="page-hero text-white px-6 md:px-14 pt-14 pb-12 md:pt-20 md:pb-16">
        <h1 className="font-serif font-bold text-4xl max-w-2xl leading-tight">Privacy Policy</h1>
        <p className="mt-3 text-slate-300 max-w-xl text-[14px]">
          Last updated 19 November 2026. This explains what Fleet Formal collects and why.
        </p>
      </section>

      <div className="px-6 md:px-14 py-10 max-w-3xl">
        <div className="bg-amber-bg border border-amber/30 rounded-2xl px-6 py-5 mb-10 text-[13px] text-[#6b4a12] leading-relaxed">
          <strong>A note before this goes live:</strong> this draft describes, in plain language,
          the data Fleet Formal currently collects and how it is used. It is not legal advice —
          we recommend a qualified Australian lawyer reviews it against the Privacy Act 1988 (Cth)
          and any applicable Australian Privacy Principles before publishing it as binding policy,
          especially given some Riders are minors.
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>1. Information we collect</h2>
          <p className={pClass}>Depending on how you use Fleet Formal, we may collect:</p>
          <ul className={`${ulClass} mt-2`}>
            <li>
              <strong>Owners/Drivers:</strong> name, email, phone, suburb, vehicle details and
              photos, driver&rsquo;s licence, insurance certificate, and Blue Card (Working with
              Children Check) documentation.
            </li>
            <li>
              <strong>Riders and parents/guardians:</strong> name, email, phone, and the details
              needed to confirm a booking (pickup location, event date, parent/guardian
              confirmation).
            </li>
            <li>
              <strong>Schools &amp; P&amp;Cs:</strong> school name, contact name, email, phone, and
              event details posted to arrange rides for students.
            </li>
          </ul>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>2. Community preview listings</h2>
          <p className={pClass}>
            A small number of listings on Fleet Formal showcase vehicles and first names belonging
            to members of a local car-club community, sourced from a public car-meet roster, as a
            preview of cars we hope will eventually join the platform. These individuals have not
            yet submitted any personal information to Fleet Formal and have not consented to a
            bookable listing. We hold no contact details for them beyond what is already public,
            and we will remove or convert any such listing immediately if the person asks us to.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>3. How we use this information</h2>
          <ul className={ulClass}>
            <li>To verify an Owner&rsquo;s identity, licence, insurance, and Blue Card status.</li>
            <li>To display listings and process booking requests.</li>
            <li>To confirm bookings with a parent or guardian before they are finalised.</li>
            <li>To let schools and P&amp;Cs post events and reach verified drivers.</li>
            <li>To contact you about your account, a booking, or a safety matter.</li>
          </ul>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>4. Storage &amp; security</h2>
          <p className={pClass}>
            Account data, listing details, and uploaded documents are stored with Supabase, our
            database and file-storage provider, using access controls that restrict verification
            documents (licences, insurance, Blue Cards) to the Fleet Formal team.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>5. Sharing</h2>
          <p className={pClass}>
            We do not sell personal information. We share only what is necessary to arrange a
            booking — for example, an Owner&rsquo;s publicly listed details with a Rider, or event
            details between a school and verified drivers. We do not share licence, insurance, or
            Blue Card documents outside the Fleet Formal verification team.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>6. Data about minors</h2>
          <p className={pClass}>
            Many Riders are under 18. Bookings involving a minor require parent or guardian
            confirmation, and we aim to collect no more information from a student Rider than is
            needed to arrange and confirm their ride.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>7. Your rights</h2>
          <p className={pClass}>
            You can ask us to access, correct, or delete the personal information we hold about
            you, or to remove a community preview listing that names you, by contacting us through
            the details on our{" "}
            <a href="/for-schools" className="underline font-semibold">For Schools</a> page.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={hClass}>8. Changes to this policy</h2>
          <p className={pClass}>
            We may update this policy as Fleet Formal grows. Material changes will be posted here
            with an updated effective date.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
