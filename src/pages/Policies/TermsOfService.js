import React, { useEffect } from "react";
import "../Home.css";
import "./Policies.css";

const sections = [
  {
    number: "01",
    title: "Definitions",
    content: [
      "Platform means the Yoga Bharath website, mobile applications, software systems, dashboards, communication systems, and related services.",
      "User means any person accessing or using the Platform including Learners, Trainers, visitors, customers, and representatives.",
      "Learner means a User who seeks, books, purchases, or attends yoga, wellness, or related sessions through the Platform.",
      "Trainer means a yoga instructor, wellness coach, consultant, or service provider who registers to offer services through the Platform.",
      "Services means yoga classes, consultations, sessions, training, wellness guidance, and any other services made available through the Platform.",
      "Booking means any request, reservation, confirmation, scheduled session, or instant session made through the Platform.",
      "Content means text, images, videos, logos, graphics, reviews, documents, messages, audio, data, software, and all other materials available on the Platform."
    ]
  },
  {
    number: "02",
    title: "Eligibility",
    content: [
      "You represent that you are competent to contract under the Indian Contract Act, 1872.",
      "If you are below 18 years of age, you may use the Platform only under the supervision and consent of a parent or legal guardian.",
      "We reserve the right to refuse access, suspend accounts, or deny services to any person at our sole discretion."
    ]
  },
  {
    number: "03",
    title: "Nature of Platform",
    content: [
      "Yoga Bharath operates as a technology-enabled platform facilitating connections between Learners and Trainers.",
      "Unless specifically stated otherwise, Yoga Bharath is not the direct employer, principal, agent, partner, or representative of Trainers.",
      "Trainers are independent service providers and are solely responsible for the services they offer, their conduct, qualifications, certifications, and performance.",
      "The Company may verify certain information submitted by Trainers, but does not guarantee authenticity, competence, safety, legality, or suitability of any Trainer.",
      "The Company does not guarantee any specific results, fitness outcomes, health benefits, or uninterrupted service availability."
    ]
  },
  {
    number: "04",
    title: "Account Registration",
    content: [
      "To access certain features, Users may be required to create an account.",
      "You agree to provide true, accurate, complete, and updated information.",
      "You are solely responsible for maintaining account confidentiality, protecting login credentials, and all activities conducted through your account.",
      "You shall immediately notify us of unauthorized access or suspected misuse.",
      "We reserve the right to suspend, restrict, verify, or terminate any account containing false, misleading, duplicate, fraudulent, or incomplete information."
    ]
  },
  {
    number: "05",
    title: "Learner Terms",
    content: [
      "Learners may browse, request, book, schedule, or attend sessions subject to availability.",
      "Learners shall provide accurate booking information, arrive/join sessions on time, maintain respectful conduct, use the Platform lawfully, and disclose relevant health limitations where necessary.",
      "Learners shall not harass Trainers, use abusive language, misuse payment systems, share illegal or harmful content, or circumvent the Platform to avoid fees.",
      "The Company may restrict bookings, suspend accounts, or deny access in case of misconduct."
    ]
  },
  {
    number: "06",
    title: "Trainer Terms",
    content: [
      "Trainers may be required to submit KYC, qualifications, identity proof, certifications, photographs, bank details, and other documents.",
      "Approval of Trainer accounts shall remain solely at the discretion of the Company.",
      "Trainers represent and warrant that they are legally eligible to provide services, their qualifications and certifications are genuine, they shall comply with applicable laws and professional ethics, and they shall conduct sessions responsibly.",
      "Trainers shall not misrepresent skills or qualifications, engage in harassment or misconduct, solicit off-platform payments in violation of Company policies, share confidential user information, or use the Platform to conduct unlawful activities.",
      "The Company may suspend, terminate, delist, penalize, or investigate any Trainer account at any time.",
      "Separate Trainer Agreements, payout policies, and KYC policies may additionally apply."
    ]
  },
  {
    number: "07",
    title: "Bookings and Session Management",
    content: [
      "Bookings may be instant, scheduled, recurring, or subject to availability.",
      "Confirmation of a booking depends on Trainer acceptance, system availability, payment completion, or other operational factors.",
      "The Company may reschedule, cancel, reject, or modify bookings due to technical issues, non-availability, policy violations, safety concerns, fraud prevention, or operational reasons.",
      "Session duration, content, and delivery method may vary.",
      "The Company is not liable for delays caused by internet connectivity, device failures, user absence, force majeure, or third-party failures."
    ]
  },
  {
    number: "08",
    title: "Payments",
    content: [
      "Prices may be displayed on the Platform and are subject to change without notice.",
      "Payments may be processed through third-party payment gateways.",
      "By making payment, you authorize applicable charges, taxes, convenience fees, gateway charges, and statutory levies.",
      "The Company does not store complete payment card data unless specifically stated and lawfully permitted.",
      "In case of payment failure, duplicate deduction, or technical error, resolution may depend on banks/payment processors.",
      "Trainer payouts, if applicable, shall be governed by separate payout terms."
    ]
  },
  {
    number: "09",
    title: "Refunds and Cancellations",
    content: [
      "Refunds and cancellations shall be governed by the separately published Refund & Cancellation Policy, which forms part of these Terms.",
      "The Company reserves the right to approve, reject, partially process, delay, or reverse refunds subject to policy, investigations, abuse checks, or gateway timelines."
    ]
  },
  {
    number: "10",
    title: "Health, Fitness & Medical Disclaimer",
    content: [
      "Yoga, exercise, breathing techniques, meditation, and wellness activities may involve physical or mental exertion.",
      "Users participate entirely at their own risk.",
      "Users are strongly advised to consult qualified medical professionals before beginning any exercise or wellness program.",
      "The Platform and Trainers do not substitute medical diagnosis, emergency treatment, therapy, or licensed healthcare services unless expressly authorized.",
      "The Company shall not be liable for injuries, aggravation of medical conditions, emotional distress, or health outcomes arising from participation."
    ]
  },
  {
    number: "11",
    title: "User Content, Reviews & Communications",
    content: [
      "Users may submit ratings, reviews, comments, messages, feedback, or media.",
      "You grant the Company a worldwide, royalty-free, perpetual, transferable license to use, reproduce, publish, display, modify, and distribute such content for lawful business purposes.",
      "You represent that your content is lawful, does not violate third-party rights, and is not defamatory, obscene, hateful, misleading, or fraudulent.",
      "We may remove any content at our discretion without notice."
    ]
  },
  {
    number: "12",
    title: "Intellectual Property",
    content: [
      "All rights, title, and interest in the Platform, software, branding, trademarks, logos, designs, content, databases, and systems belong to Yoga Bharath or its licensors.",
      "No User acquires ownership rights by using the Platform.",
      "You shall not copy, scrape, reverse engineer, reproduce, distribute, resell, or exploit the Platform without prior written consent."
    ]
  },
  {
    number: "13",
    title: "Prohibited Activities",
    content: [
      "Users shall not violate any law, use fake identities, attempt hacking or unauthorized access, or interfere with platform security.",
      "Users shall not introduce malware, spam users, scrape data, create duplicate accounts, or manipulate reviews.",
      "Users shall not circumvent fees, use the Platform for illegal solicitation, or harass, threaten, or exploit others."
    ]
  },
  {
    number: "14",
    title: "Data Privacy",
    content: [
      "Collection and processing of personal data shall be governed by our Privacy Policy.",
      "By using the Platform, you consent to collection, storage, transfer, and processing of data in accordance with applicable laws.",
      "We may use OTP, verification, analytics, fraud checks, communication systems, and security tools."
    ]
  },
  {
    number: "15",
    title: "Third-Party Services",
    content: [
      "The Platform may integrate with payment gateways, live session recording tools, communication tools, cloud services, analytics tools, or external links.",
      "We are not responsible for third-party systems, downtime, terms, or acts/omissions."
    ]
  },
  {
    number: "16",
    title: "Suspension, Termination & Enforcement",
    content: [
      "We may suspend, block, restrict, investigate, or terminate any account or access without prior notice if we reasonably believe there is a policy breach, fraud, legal risk, safety concern, non-payment, misconduct, misrepresentation, or technical misuse.",
      "Upon termination, access may cease immediately, bookings may be cancelled, dues may be withheld subject to law and investigation, and data may be retained as legally required.",
      "Our remedies are cumulative and not exclusive."
    ]
  },
  {
    number: "17",
    title: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Yoga Bharath, its directors, officers, employees, affiliates, agents, and licensors shall not be liable for indirect damages, consequential losses, loss of profits, loss of goodwill, personal dissatisfaction, booking disputes, connectivity issues, user misconduct, trainer misconduct, injuries, health issues, or data loss beyond reasonable control.",
      "In any event, our aggregate liability shall not exceed the amount actually paid by the claimant to the Company in relation to the disputed transaction during the preceding three (3) months, or INR 5,000, whichever is lower, unless prohibited by law."
    ]
  },
  {
    number: "18",
    title: "Indemnity",
    content: [
      "You agree to indemnify, defend, and hold harmless Yoga Bharath Holistic Services Private Limited, its promoters, directors, officers, employees, affiliates, and representatives from any claims, actions, liabilities, penalties, losses, costs, or expenses arising out of your misuse of the Platform, breach of these Terms, violation of law, disputes with other Users, injury caused by your acts or omissions, or fraudulent conduct."
    ]
  },
  {
    number: "19",
    title: "Force Majeure",
    content: [
      "The Company shall not be liable for failure or delay caused by events beyond reasonable control including natural disasters, pandemic, strikes, internet outages, cyber incidents, war, riots, government restrictions, power failures, or similar causes."
    ]
  },
  {
    number: "20",
    title: "Modifications to Platform or Terms",
    content: [
      "We may update these Terms at any time.",
      "Revised Terms become effective upon publication unless otherwise stated.",
      "Continued use after updates constitutes acceptance.",
      "We may discontinue any feature or service without liability."
    ]
  },
  {
    number: "21",
    title: "Governing Law and Jurisdiction",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of India.",
      "Subject to applicable consumer law, courts located at the designated city and state in India shall have exclusive jurisdiction.",
      "The Company may seek injunctive or equitable relief in any competent court."
    ]
  },
  {
    number: "22",
    title: "Dispute Resolution",
    content: [
      "Users should first contact support for amicable resolution.",
      "If unresolved, the matter may be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.",
      "Seat and venue of arbitration shall be as designated by the Company.",
      "Proceedings shall be conducted in English."
    ]
  },
  {
    number: "23",
    title: "Electronic Consent",
    content: [
      "By clicking 'I Agree', registering, booking, paying, browsing, or using the Platform, you provide legally valid electronic consent and acceptance under the Information Technology Act, 2000 and other applicable laws."
    ]
  },
  {
    number: "24",
    title: "Severability",
    content: [
      "If any provision is held invalid or unenforceable, the remaining provisions shall remain in full force."
    ]
  },
  {
    number: "25",
    title: "Waiver",
    content: [
      "Failure to enforce any provision shall not constitute waiver of any rights."
    ]
  },
  {
    number: "26",
    title: "Entire Agreement",
    content: [
      "These Terms, together with all incorporated policies, constitute the entire agreement between you and the Company regarding the Platform and supersede prior understandings."
    ]
  },
  {
    number: "27",
    title: "Contact Details",
    content: [
      "For any queries, concerns, or support, users may reach Yoga Bharath Holistic Services Private Limited through the contact information provided on the Platform."
    ]
  },
  {
    number: "28",
    title: "Company Protective Clause",
    content: [
      "For abundant caution, Users acknowledge that Yoga Bharath Holistic Services Private Limited functions primarily as a facilitation technology platform unless expressly stated otherwise in writing, and shall not be deemed liable for acts, omissions, negligence, statements, promises, conduct, or independent obligations of Trainers, Learners, or third parties, except to the extent required under applicable non-waivable law.",
      "By using the Platform, you confirm that you have read, understood, and agreed to these Terms."
    ]
  }
];

function TermsOfService() {
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
            Terms of <span>Service</span>
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
              These Terms of Service constitute a legally binding agreement
              between you and Yoga Bharath Holistic Services Private Limited,
              governing your access to and use of the Platform, including all
              services, features, content, and related products offered through it.
            </p>

            <div className="pol-callout">
              <span className="pol-callout-icon">📋</span>
              <p>
                By accessing, registering, browsing, using, or continuing to
                use the Platform, you acknowledge that you have read,
                understood, and agreed to be bound by these Terms.
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

export default TermsOfService;