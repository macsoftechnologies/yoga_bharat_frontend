import React, { useEffect } from "react";
import "../Home.css";
import "./Policies.css";

const sections = [
  {
    number: "01",
    title: "Definitions",
    content: [
      "Trainer means any yoga instructor, wellness coach, meditation guide, consultant, therapist (where permitted), or service provider offering services through the Platform.",
      "Learner means any user who books or attends sessions.",
      "Services means yoga classes, wellness sessions, consultations, guided practices, and any approved services offered through the Platform.",
      "Booking means any instant, scheduled, recurring, package, or confirmed session allocated through the Platform.",
      "Payout means monies payable to the Trainer after deductions, commissions, taxes, reversals, penalties, or adjustments.",
      "Confidential Information means non-public business, user, operational, pricing, technical, and commercial information."
    ]
  },
  {
    number: "02",
    title: "Nature of Relationship",
    content: [
      "The Trainer acknowledges and agrees that they are an independent service provider and not an employee, worker, consultant on payroll, agent, franchisee, joint venture partner, or legal representative of the Company unless expressly agreed in writing.",
      "Nothing in this Agreement creates an employment relationship, guaranteed income, partnership, agency authority, or right to bind the Company.",
      "The Trainer is solely responsible for their taxes, licenses, statutory filings, professional compliance, and obligations arising from income earned."
    ]
  },
  {
    number: "03",
    title: "Eligibility to Register",
    content: [
      "You represent and warrant that you are legally competent to contract under applicable law and possess required skills and knowledge to conduct offered services.",
      "You hold genuine qualifications and certifications where claimed, and are not prohibited by law from offering such services.",
      "All information submitted is true and complete, and you will comply with this Agreement and all applicable laws.",
      "The Company may reject any application without assigning reasons."
    ]
  },
  {
    number: "04",
    title: "Onboarding & KYC Requirements",
    content: [
      "To register, you may be required to submit your full legal name, mobile number, email address, date of birth, photograph or selfie, address proof, bank account or UPI details, certificates and qualifications, experience details, emergency contact, and tax or GST details where applicable.",
      "Submission of documents does not guarantee approval.",
      "The Company may request additional documents, video verification, re-verification, updated KYC, or clarification at any time.",
      "False, forged, expired, manipulated, or misleading documents may result in immediate rejection, suspension, legal reporting, and recovery actions."
    ]
  },
  {
    number: "05",
    title: "Approval & Account Activation",
    content: [
      "Trainer accounts remain subject to internal review and approval.",
      "The Company may activate, delay, restrict, suspend, deactivate, or permanently reject accounts at its sole discretion subject to law.",
      "Approval once granted may later be withdrawn."
    ]
  },
  {
    number: "06",
    title: "Trainer Profile Responsibility",
    content: [
      "You are responsible for ensuring the accuracy of your profile including name, photo, bio, languages, experience, certifications, availability schedule, service categories, and location.",
      "Misleading or exaggerated claims are strictly prohibited."
    ]
  },
  {
    number: "07",
    title: "Service Standards",
    content: [
      "You agree to provide services professionally, respectfully, punctually, safely, ethically, within declared competence, and in compliance with applicable laws.",
      "You shall not offer services beyond your training, expertise, or legal permissions."
    ]
  },
  {
    number: "08",
    title: "Health & Professional Limitations",
    content: [
      "You acknowledge that Platform services are generally wellness-oriented unless otherwise approved.",
      "You shall not claim guaranteed cures, misrepresent medical treatment capability, diagnose disease without lawful authority, prescribe medicines unlawfully, or discourage legitimate medical treatment irresponsibly.",
      "You must advise learners with medical concerns to consult qualified professionals where appropriate."
    ]
  },
  {
    number: "09",
    title: "Bookings & Acceptance",
    content: [
      "Bookings may be allocated instantly, manually, algorithmically, or by user selection.",
      "The Company does not guarantee minimum bookings or earnings.",
      "You are expected to accept and complete bookings responsibly.",
      "Repeated ignoring, rejecting, cancelling, delaying, or abandoning bookings may impact visibility, incentives, ranking, or account status.",
      "You must honor confirmed bookings except for genuine emergencies."
    ]
  },
  {
    number: "10",
    title: "Punctuality & Session Delivery",
    content: [
      "You shall join on time, maintain required connectivity, be prepared for the booked session, conduct the session responsibly, use appropriate communication, and respect the booked duration where applicable.",
      "Late joining, inattentiveness, or repeated disruptions may invite penalties."
    ]
  },
  {
    number: "11",
    title: "Online Session Requirements",
    content: [
      "For virtual sessions, you are responsible for maintaining a functional device, stable internet, proper lighting, clear audio, professional presentation, and a suitable environment.",
      "The Company is not liable for your personal equipment failures."
    ]
  },
  {
    number: "12",
    title: "Offline / In-Person Services",
    content: [
      "If in-person sessions are enabled, you are responsible for lawful travel, punctuality, and safety.",
      "You must maintain professional boundaries and comply with local laws and venue rules.",
      "The Company may impose separate offline terms."
    ]
  },
  {
    number: "13",
    title: "Trainer Conduct Code",
    content: [
      "You shall not engage in harassment, abuse, sexual misconduct, inappropriate comments, discrimination, threats, solicitation for illegal acts, or substance abuse during sessions.",
      "You shall not make misleading promises, engage in extortion, or display unprofessional behavior.",
      "Zero-tolerance misconduct may result in immediate termination."
    ]
  },
  {
    number: "14",
    title: "Learner Privacy & Data Use",
    content: [
      "Learner data is shared only for service facilitation.",
      "You shall not misuse learner data including calling unnecessarily, marketing unrelated services, sharing contact details, harassment, or storing sensitive data without consent.",
      "Data misuse may attract suspension, legal action, and damages claims."
    ]
  },
  {
    number: "15",
    title: "Off-Platform Solicitation Restriction",
    content: [
      "You shall not directly divert learners away from the Platform to avoid fees, commissions, controls, or records.",
      "Prohibited conduct includes asking learners to pay privately, requesting direct recurring arrangements outside the Platform, or sharing private contact to bypass the Platform intentionally.",
      "The Company may impose financial penalties, suspension, forfeiture of dues, or termination for circumvention."
    ]
  },
  {
    number: "16",
    title: "Payouts, Commission & Deductions",
    content: [
      "Trainer earnings may be subject to platform commission, gateway fees, taxes, TDS and statutory deductions, refund adjustments, penalties for proven misconduct, and chargeback reversals.",
      "Payout cycles may be daily, weekly, monthly, rolling, or otherwise notified.",
      "Minimum payout thresholds may apply.",
      "The Company may hold payouts where there are fraud concerns, disputes, incomplete KYC, legal notices, chargebacks, or security reviews.",
      "Internal earnings dashboard figures may be provisional until final settlement."
    ]
  },
  {
    number: "17",
    title: "Tax Responsibility",
    content: [
      "You are responsible for reporting and paying taxes applicable to your income unless deducted at source.",
      "You shall provide valid PAN and GST details where required.",
      "The Company may deduct taxes as required by law."
    ]
  },
  {
    number: "18",
    title: "Cancellations by Trainer",
    content: [
      "Trainers should avoid cancellation of confirmed sessions except for genuine reasons.",
      "Repeated cancellations may lead to reduced ranking, temporary booking pause, incentive loss, financial deductions where disclosed, suspension, or termination.",
      "Emergency cancellations should be promptly reported through official channels."
    ]
  },
  {
    number: "19",
    title: "Ratings, Reviews & Performance",
    content: [
      "Learners may submit ratings and reviews.",
      "The Company may consider metrics such as acceptance rate, completion rate, punctuality, complaint ratio, response time, ratings, and policy compliance.",
      "These metrics may affect visibility, incentives, promotions, or account status.",
      "The Company is not obligated to disclose all ranking logic."
    ]
  },
  {
    number: "20",
    title: "Content Rights & Trainer Materials",
    content: [
      "If you upload photos, bios, videos, certificates, or materials, you confirm you have rights to share them.",
      "You grant the Company a non-exclusive, royalty-free license to use such materials for profile display, marketing, verification, and Platform operations.",
      "The Company may edit formatting or remove content."
    ]
  },
  {
    number: "21",
    title: "Confidentiality",
    content: [
      "You shall keep confidential all non-public information relating to learners, pricing models, business systems, internal processes, technology, marketing plans, disputes, and security practices.",
      "Confidentiality obligations survive termination."
    ]
  },
  {
    number: "22",
    title: "Intellectual Property",
    content: [
      "All platform software, logos, systems, databases, trademarks, and content belong to the Company or its licensors.",
      "You shall not copy app systems, scrape data, use logos without permission, misrepresent affiliation, or reverse engineer systems."
    ]
  },
  {
    number: "23",
    title: "Equipment & Personal Costs",
    content: [
      "You are responsible for your own internet charges, devices, electricity, workspace, travel costs if any, insurance, and professional tools.",
      "Unless expressly agreed, the Company bears no such costs."
    ]
  },
  {
    number: "24",
    title: "Complaints, Investigations & Evidence",
    content: [
      "The Company may investigate complaints from learners, authorities, or third parties.",
      "You agree to cooperate and provide reasonable clarifications and evidence.",
      "Failure to cooperate may result in adverse decisions based on available records."
    ]
  },
  {
    number: "25",
    title: "Suspension / Termination Rights",
    content: [
      "The Company may suspend, restrict, delist, or terminate your account immediately for reasons including fake documents, fraud, learner safety concerns, harassment, repeated cancellations, chargeback collusion, poor conduct, off-platform diversion, data misuse, legal non-compliance, reputational risk, or material breach of this Agreement.",
      "No prior notice is required where urgent action is reasonably necessary."
    ]
  },
  {
    number: "26",
    title: "Effect of Termination",
    content: [
      "Upon termination, access may cease immediately, future bookings may be cancelled, pending payouts may be adjusted or withheld subject to law, and content may be removed.",
      "Certain records may be retained as legally required.",
      "Termination does not erase prior liabilities."
    ]
  },
  {
    number: "27",
    title: "No Guarantee of Demand or Income",
    content: [
      "The Company does not guarantee number of leads, session volume, specific earnings, ranking position, continuous demand, or geographic demand consistency.",
      "Market demand may fluctuate."
    ]
  },
  {
    number: "28",
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, the Company shall not be liable for loss of expected income, business interruption, reputational claims not caused by proven misconduct of the Company, internet failures, learner cancellations, or indirect or consequential losses.",
      "Where liability cannot be excluded, it shall be limited under applicable law and the governing Terms."
    ]
  },
  {
    number: "29",
    title: "Indemnity",
    content: [
      "You agree to indemnify and hold harmless the Company, its directors, officers, employees, and affiliates from claims, losses, penalties, damages, costs, or expenses arising from your services, misconduct, false qualification claims, injury caused by your negligence, tax non-compliance, privacy violations, breach of this Agreement, or third-party claims connected to your acts or omissions."
    ]
  },
  {
    number: "30",
    title: "Force Majeure",
    content: [
      "The Company shall not be liable for delays or failures caused by events beyond reasonable control including pandemic, outages, cyber incidents, disasters, strikes, war, or government restrictions."
    ]
  },
  {
    number: "31",
    title: "Modifications to Agreement",
    content: [
      "We may revise this Agreement from time to time.",
      "Updated versions become effective upon publication or notification.",
      "Continued use of the Platform constitutes acceptance."
    ]
  },
  {
    number: "32",
    title: "Governing Law & Jurisdiction",
    content: [
      "This Agreement shall be governed by the laws of India.",
      "Subject to applicable law, courts located at the designated city and state in India shall have jurisdiction.",
      "Arbitration clauses in the Terms of Service may additionally apply."
    ]
  },
  {
    number: "33",
    title: "Trainer Acknowledgement",
    content: [
      "By registering or continuing as a Trainer, you confirm that you are an independent service provider and your documents and claims are genuine.",
      "You accept payout deductions and policy controls, and will behave professionally at all times.",
      "You will not divert learners off-platform and have read and agreed to this Agreement."
    ]
  },
  {
    number: "34",
    title: "Company Safe-Zone Clause",
    content: [
      "For abundant caution, the Trainer acknowledges that Yoga Bharath primarily operates a technology-enabled marketplace and facilitation platform and shall not be deemed the Trainer's employer, guarantor of earnings, insurer, or supervisor of each individual session beyond reasonable platform controls maintained by the Company."
    ]
  }
];

function TrainerAgreement() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pol-page">

      {/* ── NAVBAR ── */}
      <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/Yoga-icon-02.png" alt="Yoga Bharat" className="brand-logo" />
            <span className="brand-yoga ms-2">Yoga</span>
            <span className="brand-bharat ms-1">Bharat</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center position-relative">
              <span className="nav-slider"></span>
              <li className="nav-item"><a className="nav-link" href="/#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/#about">About</a></li>
              <li className="nav-item"><a className="nav-link" href="/#classes">Classes</a></li>
              <li className="nav-item"><a className="nav-link" href="/#gallery">Gallery</a></li>
              <li className="nav-item"><a className="nav-link" href="/#blog">Blog</a></li>
              <li className="nav-item"><a className="nav-link" href="/#contact">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="pol-hero">
        <div className="container">
          <div className="pol-hero-badge">Legal Document</div>
          <h1>
            Trainer <span>Agreement</span>
          </h1>
          <p className="pol-hero-meta">
            Yoga Bharath Holistic Services Private Limited
          </p>
          <div className="pol-hero-divider"></div>
        </div>
      </div>

      <div className="pol-layout">

        {/* SIDEBAR */}
        <aside className="pol-sidebar">
          <div className="pol-sidebar-title">Sections</div>

          {sections.map((section) => (
            <a
              key={section.number}
              href={`#pol-section-${section.number}`}
              className="pol-sidebar-link"
            >
              <span className="pol-sidebar-num">
                {section.number}
              </span>
              {section.title}
            </a>
          ))}
        </aside>

        {/* MAIN CONTENT */}
        <main>

          <div className="pol-intro">
            <p>
              This Trainer Agreement governs your onboarding, use of the
              Platform, eligibility, KYC, service conduct, bookings, payouts,
              intellectual property, confidentiality, account enforcement, and
              all related matters as a Trainer on the Yoga Bharath Platform.
            </p>

            <div className="pol-callout">
              <span className="pol-callout-icon">🧘</span>
              <p>
                By registering, submitting documents, clicking "I Agree",
                accepting bookings, receiving payouts, or using the Platform as
                a Trainer, you confirm that you have read, understood, and
                agreed to this Agreement.
              </p>
            </div>
          </div>

          {sections.map((section) => (
            <div
              key={section.number}
              id={`pol-section-${section.number}`}
              className="pol-section"
            >
              <div className="pol-section-header">
                <span className="pol-section-num">
                  {section.number}
                </span>

                <h2 className="pol-section-title">
                  {section.title}
                </h2>
              </div>

              <div className="pol-section-body">
                {section.content.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </div>
          ))}

          {/* CONTACT */}
          <div className="pol-section pol-contact">
            <h3>Contact Information</h3>

            <div className="pol-contact-grid">

              <div className="pol-contact-item">
                <label>Company</label>
                <span>Yoga Bharath Holistic Services Private Limited</span>
              </div>

              <div className="pol-contact-item">
                <label>Email</label>
                <span>support@yoga-bharath.com</span>
              </div>

              <div className="pol-contact-item">
                <label>Phone</label>
                <span>+91 81211 80099</span>
              </div>

              <div className="pol-contact-item">
                <label>Website</label>
                <span>www.yoga-bharath.com</span>
              </div>

            </div>
          </div>

        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links-row">
            <a href="/disclaimer-policy" className="footer-policy-link">Disclaimer Policy</a>
            <span className="footer-divider">|</span>
            <a href="/learner-usage-policy" className="footer-policy-link">Learner Usage Policy</a>
            <span className="footer-divider">|</span>
            <a href="/privacy-policy-info" className="footer-policy-link">Privacy Policy</a>
            <span className="footer-divider">|</span>
            <a href="/refund-cancellation-policy" className="footer-policy-link">Refund &amp; Cancellation Policy</a>
            <span className="footer-divider">|</span>
            <a href="/terms-of-service" className="footer-policy-link">Terms of Service</a>
            <span className="footer-divider">|</span>
            <a href="/trainer-agreement" className="footer-policy-link">Trainer Agreement</a>
          </div>
          <div className="text-center reserved">
            <p className="rights">
              © 2025 Yoga Bharat. All rights reserved. | Design &amp; Developed by{" "}
              <a href="https://macsof.com/">macsof technologies.</a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default TrainerAgreement;