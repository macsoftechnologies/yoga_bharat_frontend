import React, { useEffect } from "react";
import "../Home.css"; // reuse existing styles for navbar/footer

const sections = [
  {
    number: "01",
    title: "Definitions",
    content: [
      "Learner means any user who registers, browses, books, attends, purchases, or uses sessions/services through the Platform.",
      "Trainer means an independent yoga instructor, wellness coach, or service provider available through the Platform.",
      "Booking means any instant, scheduled, recurring, trial, package, or confirmed session request made through the Platform.",
      "Session means any yoga, meditation, wellness, consultation, educational, or related service booked through the Platform.",
      "Platform means the website, mobile app, software systems, dashboards, and services operated by Yoga Bharath.",
    ],
  },
  {
    number: "02",
    title: "Eligibility to Use as a Learner",
    content: [
      "You must be legally competent to enter into binding agreements under applicable law.",
      "Users below 18 years of age may participate only with consent, supervision, and responsibility of a parent or legal guardian.",
      "The Company may request age verification where necessary.",
      "The Company reserves the right to restrict access if eligibility requirements are not met.",
    ],
  },
  {
    number: "03",
    title: "Learner Account Responsibilities",
    content: [
      "You are responsible for maintaining accurate and secure account information. You agree to: provide true and current information, use your own valid mobile number/email, keep login credentials confidential, update profile changes promptly, maintain only one genuine account unless approved otherwise, and notify support of unauthorized use.",
      "You shall not: create fake accounts, impersonate another person, use another user's credentials, create multiple accounts for abuse, offers, or fraud, or share OTPs or passwords.",
      "The Company may suspend suspicious accounts without prior notice.",
    ],
  },
  {
    number: "04",
    title: "Information You Must Provide Accurately",
    content: [
      "To enable safe and efficient services, you may be required to provide: full name, mobile number, email, date of birth/age, gender (optional where applicable), location/city, emergency contact (if requested), health declarations relevant to participation, and booking preferences.",
      "False, misleading, or incomplete information may result in denied bookings, session issues, or account action.",
    ],
  },
  {
    number: "05",
    title: "Health & Fitness Responsibility",
    content: [
      "You acknowledge that yoga and wellness activities may involve physical movement, breathing techniques, stretching, balance, and exertion. You are solely responsible for determining whether participation is appropriate for you.",
      "You should consult a qualified healthcare professional before participating if you have: heart conditions, high/low blood pressure, surgery recovery, pregnancy, back pain, joint injuries, respiratory disorders, neurological issues, chronic illness, or any condition affecting exercise safety.",
      "You must disclose relevant health limitations that may affect participation. Failure to disclose material conditions is at your own risk.",
      "If you feel pain, dizziness, discomfort, breathing difficulty, or any unusual symptom, stop immediately and seek medical guidance.",
    ],
  },
  {
    number: "06",
    title: "Booking Policy for Learners",
    content: [
      "Learners may access: instant bookings, scheduled sessions, recurring sessions, trial sessions (if available), and packages (if available).",
      "You must ensure correctness of: date/time selected, time zone (if applicable), session type, contact details, language preferences, and platform/device readiness.",
      "Bookings are subject to: Trainer availability, successful payment, system confirmation, policy compliance, and operational feasibility.",
      "The Company does not guarantee availability of any specific Trainer or slot.",
    ],
  },
  {
    number: "07",
    title: "Payments by Learners",
    content: [
      "Learners must pay applicable charges before or as required for booking confirmation.",
      "Charges may include: session fee, taxes, convenience fee, and gateway fee (where applicable).",
      "Failed, delayed, or reversed payments may affect booking status.",
      "Misuse of payment systems, chargeback abuse, or fraudulent payment behavior may result in suspension.",
    ],
  },
  {
    number: "08",
    title: "Cancellation & Refund Responsibility",
    content: [
      "Learner cancellations and refunds are governed by the Refund & Cancellation Policy.",
      "Repeated last-minute cancellations, no-shows, or abuse of refund claims may lead to: reduced refund privileges, temporary booking restrictions, account review, or suspension.",
      "Learners should review cancellation timelines before booking.",
    ],
  },
  {
    number: "09",
    title: "Session Attendance Responsibility",
    content: [
      "You are responsible for joining or attending sessions on time. You must ensure: stable internet connection (for online sessions), charged device, updated app version, quiet and safe environment, proper camera/audio setup if needed, and sufficient session space.",
      "Late arrival may reduce usable session time and may not entitle compensation.",
    ],
  },
  {
    number: "10",
    title: "Conduct Toward Trainers",
    content: [
      "Learners must maintain professional, respectful, and lawful behavior toward Trainers.",
      "Prohibited conduct includes: harassment, abusive language, threats, sexual misconduct, discrimination, intimidation, repeated nuisance calls/messages, recording without permission where prohibited, and demanding services beyond booking scope.",
      "The Company may take strict action for misconduct.",
    ],
  },
  {
    number: "11",
    title: "Off-Platform Dealing Restriction",
    content: [
      "Learners shall not intentionally attempt to bypass the Platform to avoid fees, controls, records, or safety systems.",
      "Direct private arrangements with Trainers may void support protections and may result in account restrictions.",
      "The Company shall not be responsible for transactions conducted outside the Platform.",
    ],
  },
  {
    number: "12",
    title: "Privacy of Trainers",
    content: [
      "Learners shall respect Trainer privacy. You shall not misuse personal details, images, documents, social media details, or private addresses.",
      "Unauthorized sharing may invite legal action.",
    ],
  },
  {
    number: "13",
    title: "Recording / Screenshots Policy",
    content: [
      "Recording sessions, screenshots, or storing trainer content may be prohibited unless expressly permitted.",
      "Learners shall not publish Trainer images/videos without consent.",
      "Unauthorized recording may lead to account suspension and legal remedies.",
    ],
  },
  {
    number: "14",
    title: "Content & Communication Policy",
    content: [
      "Learners shall not upload, send, or share: illegal material, defamatory content, pornographic content, hate speech, spam, malware, fraudulent information, or intellectual property infringement.",
    ],
  },
  {
    number: "15",
    title: "Ratings & Reviews Policy",
    content: [
      "Learners may submit honest reviews based on genuine experience.",
      "Reviews must not contain: false allegations, abuse, personal attacks, extortion attempts, or competitor manipulation.",
      "The Company may moderate or remove reviews at its discretion.",
    ],
  },
  {
    number: "16",
    title: "Platform Use Restrictions",
    content: [
      "Learners shall not: hack systems, reverse engineer software, scrape data, manipulate pricing/offers, interfere with bookings, create bots/scripts, exploit bugs, or circumvent security systems.",
    ],
  },
  {
    number: "17",
    title: "Intellectual Property Respect",
    content: [
      "All logos, app design, content, training materials, software, and branding belong to the Company or licensors.",
      "Learners may not copy, reproduce, sell, redistribute, or misuse such assets.",
    ],
  },
  {
    number: "18",
    title: "Safety of Personal Environment",
    content: [
      "For home/online sessions, Learners are responsible for: adequate floor space, safe surroundings, non-slippery surface, removal of hazards, proper clothing, and safe use of props/equipment.",
      "The Company is not liable for injuries arising from unsafe surroundings.",
    ],
  },
  {
    number: "19",
    title: "Special Users (Pregnancy / Seniors / Medical Conditions)",
    content: [
      "Such users should seek prior medical approval and disclose relevant conditions before booking.",
      "General sessions may not suit all users.",
    ],
  },
  {
    number: "20",
    title: "Complaints & Disputes",
    content: [
      "If issues arise, Learners should promptly contact official support with: booking ID, date/time, description of issue, and screenshots/evidence if any.",
      "The Company may investigate using available logs and records.",
      "Abusive or false complaints may attract action.",
    ],
  },
  {
    number: "21",
    title: "Suspension / Termination of Learner Account",
    content: [
      "The Company may suspend, restrict, or terminate Learner access for reasons including: fraud, payment abuse, harassment, repeated cancellations, fake reviews, misuse of platform, policy breaches, illegal conduct, or threats to safety.",
      "Action may be immediate where required.",
    ],
  },
  {
    number: "22",
    title: "No Guarantee of Results",
    content: [
      "The Company and Trainers do not guarantee: weight loss, cure of disease, pain elimination, mental transformation, specific flexibility gains, or any guaranteed timeline of results.",
      "Results vary individually.",
    ],
  },
  {
    number: "23",
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, Yoga Bharath Holistic Services Private Limited shall not be liable for: personal dissatisfaction, Trainer style mismatch, connectivity issues, injuries from undisclosed conditions, unsafe home environment accidents, missed sessions caused by learner negligence, indirect losses, or consequential damages.",
      "Where liability cannot be excluded, it shall be limited as per applicable law and governing Terms.",
    ],
  },
  {
    number: "24",
    title: "Indemnity",
    content: [
      "Learners agree to indemnify and hold harmless the Company from claims, losses, damages, liabilities, or expenses arising from: misrepresentation of health status, violation of this Policy, harm caused to Trainers or third parties, illegal use of Platform, or payment abuse or fraud.",
    ],
  },
  {
    number: "25",
    title: "Changes to Policy",
    content: [
      "The Company may revise this Policy at any time.",
      "Updated versions become effective upon publication.",
      "Continued use of the Platform constitutes acceptance.",
    ],
  },
  {
    number: "26",
    title: "Governing Law",
    content: [
      "This Policy shall be governed by the laws of India.",
      "Subject to applicable law, courts at the designated jurisdiction shall have exclusive jurisdiction.",
    ],
  },
  {
    number: "27",
    title: "Learner Acknowledgement",
    content: [
      "By registering or booking through the Platform, you confirm that: you will use the Platform responsibly, you understand yoga/wellness involves personal responsibility, you accept booking and cancellation rules, you will treat Trainers respectfully, and you have read and agreed to this Policy.",
    ],
  },
  {
    number: "28",
    title: "Company Safe-Zone Clause",
    content: [
      "For abundant caution, Learners acknowledge that Yoga Bharath primarily operates as a technology-enabled facilitation platform connecting Learners and Trainers and shall not be deemed the personal guarantor of Trainer conduct, session outcomes, or undisclosed learner health risks beyond reasonable operational controls maintained by the Company.",
    ],
  },
];

const LearnerUsagePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const slider = document.querySelector(".nav-slider");
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        slider.style.width = `${link.offsetWidth - 30}px`;
        slider.style.left = `${link.offsetLeft + 15}px`;
        const navbarCollapse = document.getElementById("navbarNav");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
      });
    });
  }, []);

  return (
    <>
      <style>{`
        /* ── PAGE WRAPPER ── */
        .lup-page {
          background: #faf9f6;
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* ── HERO BANNER ── */
        .lup-hero {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 130px 0 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .lup-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(253,171,42,0.12) 0%, transparent 65%);
        }
        .lup-hero-badge {
          display: inline-block;
          background: rgba(253,171,42,0.15);
          border: 1px solid rgba(253,171,42,0.4);
          color: #fdab2a;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 20px;
          margin-bottom: 18px;
        }
        .lup-hero h1 {
          font-size: clamp(1.9rem, 4vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .lup-hero h1 span {
          color: #fdab2a;
        }
        .lup-hero-meta {
          color: rgba(255,255,255,0.55);
          font-size: 0.88rem;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .lup-hero-divider {
          width: 56px;
          height: 3px;
          background: linear-gradient(90deg, #fdab2a, #f07b1e);
          border-radius: 2px;
          margin: 20px auto 0;
        }

        /* ── LAYOUT ── */
        .lup-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .lup-layout { grid-template-columns: 1fr; }
          .lup-sidebar { display: none; }
        }

        /* ── SIDEBAR ── */
        .lup-sidebar {
          position: sticky;
          top: 90px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          padding: 24px 0;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        .lup-sidebar-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          padding: 0 20px 14px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 8px;
        }
        .lup-sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 20px;
          font-size: 0.82rem;
          color: #555;
          text-decoration: none;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          line-height: 1.35;
        }
        .lup-sidebar-link:hover {
          background: #fff8ee;
          color: #f07b1e;
          border-left-color: #fdab2a;
          text-decoration: none;
        }
        .lup-sidebar-num {
          font-size: 0.7rem;
          font-weight: 700;
          color: #fdab2a;
          min-width: 22px;
        }

        /* ── MAIN CONTENT ── */
        .lup-intro {
          background: #ffffff;
          border-radius: 14px;
          padding: 32px 36px;
          margin-bottom: 32px;
          border-left: 4px solid #fdab2a;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }
        .lup-intro p {
          color: #444;
          font-size: 0.95rem;
          line-height: 1.75;
          margin: 0 0 12px;
        }
        .lup-intro p:last-child { margin: 0; }
        .lup-applies-title {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #f07b1e;
          margin: 18px 0 10px;
        }
        .lup-applies-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .lup-applies-list li {
          background: #fff3e0;
          border: 1px solid #ffe0b2;
          color: #e65100;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 20px;
        }

        /* ── SECTION CARD ── */
        .lup-section {
          background: #ffffff;
          border-radius: 14px;
          padding: 28px 36px;
          margin-bottom: 20px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s;
          scroll-margin-top: 100px;
        }
        .lup-section:hover {
          box-shadow: 0 4px 24px rgba(253,171,42,0.12);
        }
        .lup-section-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }
        .lup-section-num {
          background: linear-gradient(135deg, #fdab2a, #f07b1e);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 6px;
          min-width: 38px;
          text-align: center;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .lup-section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          line-height: 1.3;
        }
        .lup-section-body {
          padding-left: 54px;
        }
        .lup-section-body p {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.75;
          margin: 0 0 10px;
        }
        .lup-section-body p:last-child { margin: 0; }

        /* ── CALLOUT ── */
        .lup-callout {
          background: #fff8ee;
          border: 1px solid #ffe0a0;
          border-radius: 10px;
          padding: 16px 20px;
          margin-top: 14px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .lup-callout-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .lup-callout p {
          margin: 0;
          font-size: 0.87rem;
          color: #7a4500;
          line-height: 1.6;
        }

        /* ── CONTACT SECTION ── */
        .lup-contact {
          background: linear-gradient(135deg, #1a1a2e, #0f3460);
          border-radius: 14px;
          padding: 36px;
          color: #fff;
          margin-bottom: 0;
        }
        .lup-contact h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fdab2a;
          margin: 0 0 8px;
        }
        .lup-contact p {
          color: rgba(255,255,255,0.7);
          font-size: 0.88rem;
          margin: 0 0 18px;
          line-height: 1.6;
        }
        .lup-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .lup-contact-item {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 16px;
        }
        .lup-contact-item label {
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #fdab2a;
          display: block;
          margin-bottom: 4px;
        }
        .lup-contact-item span,
        .lup-contact-item p {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.85);
          margin: 0;
        }
        .lup-contact-item a {
          color: #fdab2a;
          font-size: 0.82rem;
          text-decoration: none;
        }
        .lup-contact-item a:hover { text-decoration: underline; }

        @media (max-width: 600px) {
          .lup-intro, .lup-section { padding: 22px 20px; }
          .lup-section-body { padding-left: 0; }
          .lup-contact { padding: 24px 20px; }
        }
      `}</style>

      <div className="lup-page">
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

        {/* ── HERO BANNER ── */}
        <div className="lup-hero">
          <div className="container">
            <div className="lup-hero-badge">Legal Document</div>
            <h1>Learner Usage <span>Policy</span></h1>
            <p className="lup-hero-meta">
              Yoga Bharath Holistic Services Private Limited &nbsp;·&nbsp;
            </p>
            <div className="lup-hero-divider"></div>
          </div>
        </div>

        {/* ── BODY LAYOUT ── */}
        <div className="lup-layout">

          {/* SIDEBAR NAV */}
          <aside className="lup-sidebar">
            <div className="lup-sidebar-title">Sections</div>
            {sections.map((s) => (
              <a key={s.number} href={`#lup-section-${s.number}`} className="lup-sidebar-link">
                <span className="lup-sidebar-num">{s.number}</span>
                {s.title}
              </a>
            ))}
            <a href="#lup-contact" className="lup-sidebar-link">
              <span className="lup-sidebar-num">✉</span>
              Contact Details
            </a>
          </aside>

          {/* MAIN */}
          <main>
            {/* INTRO */}
            <div className="lup-intro">
              <p>
                This Learner Usage Policy ("Policy") is issued by{" "}
                <strong>Yoga Bharath Holistic Services Private Limited</strong>, a company incorporated
                under the Companies Act, 2013 ("Company", "Yoga Bharath", "we", "us", "our").
              </p>
              <p>
                This Policy governs the rights, responsibilities, conduct, booking usage, participation
                standards, account use, safety obligations, and general behavior of all Learners using
                the Yoga Bharath website, mobile applications, dashboards, communication systems, and
                related services (collectively, the "Platform").
              </p>
              <p>
                This Policy forms an integral part of the Terms of Service, Privacy Policy, Refund &amp;
                Cancellation Policy, Disclaimer Policy, and any other policies published by the Company
                from time to time.
              </p>
              <p className="lup-applies-title">This Policy applies to:</p>
              <ul className="lup-applies-list">
                {[
                  "Learners / Customers",
                  "Trial Users",
                  "Subscribers",
                  "Visitors",
                  "Any person booking or attending sessions",
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="lup-callout" style={{ marginTop: 18 }}>
                <span className="lup-callout-icon">⚠️</span>
                <p>
                  By registering as a Learner, making a booking, attending a session, browsing the
                  Platform, or otherwise using the Platform, you agree to this Policy. If you do not
                  agree, you must discontinue use of the Platform.
                </p>
              </div>
            </div>

            {/* SECTIONS */}
            {sections.map((s) => (
              <div key={s.number} id={`lup-section-${s.number}`} className="lup-section">
                <div className="lup-section-header">
                  <span className="lup-section-num">{s.number}</span>
                  <h2 className="lup-section-title">{s.title}</h2>
                </div>
                <div className="lup-section-body">
                  {s.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  {/* Special callouts for critical sections */}
                  {s.number === "05" && (
                    <div className="lup-callout">
                      <span className="lup-callout-icon">🚨</span>
                      <p>
                        If you experience pain, dizziness, chest discomfort, or any alarming symptom
                        during a session, stop immediately and consult a licensed healthcare professional.
                      </p>
                    </div>
                  )}
                  {s.number === "10" && (
                    <div className="lup-callout">
                      <span className="lup-callout-icon">⚖️</span>
                      <p>
                        Harassment, abuse, or misconduct toward Trainers may result in immediate account
                        suspension and may be reported to relevant authorities.
                      </p>
                    </div>
                  )}
                  {s.number === "19" && (
                    <div className="lup-callout">
                      <span className="lup-callout-icon">🤰</span>
                      <p>
                        Pregnant users or users with special medical conditions must obtain prior written
                        clearance from a qualified medical professional before participating in any session.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* CONTACT */}
            <div id="lup-contact" className="lup-section lup-contact">
              <h3>Contact Details</h3>
              <p>
                For questions, concerns, or clarifications regarding this Learner Usage Policy, please
                reach out to us through the following channels:
              </p>
              <div className="lup-contact-grid">
                <div className="lup-contact-item">
                  <label>Company</label>
                  <span>Macsof Technologies.</span>
                </div>
                <div className="lup-contact-item">
                  <label>Address</label>
                  <p>Door No 9-36-20, Flat No. 102,</p>
                  <p>Sivalayam Road, Pitapuram Colony,</p>
                  <p>Maddilapalem, Visakhapatnam - 530003</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Sivalayam+Road+Pitapuram+Colony+Maddilapalem+Visakhapatnam+530003"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </div>
                <div className="lup-contact-item">
                  <label>Email</label>
                  <span>Yogabharatms@gmail.com</span>
                </div>
                <div className="lup-contact-item">
                  <label>Phone</label>
                  <span>+91 81211 80099</span>
                </div>
                <div className="lup-contact-item">
                  <label>Website</label>
                  <span>
                    <a href="https://yoga-bharath.com/" target="_blank" rel="noopener noreferrer">
                      https://yoga-bharath.com/
                    </a>
                  </span>
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
    </>
  );
};

export default LearnerUsagePolicy;