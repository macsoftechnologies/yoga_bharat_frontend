import React, { useEffect } from "react";
import "../Home.css";
import "./Policies.css";

const sections = [
  {
    number: "01",
    title: "Our Commitment to Privacy",
    content: [
      "We value privacy and recognize the importance of protecting personal data. We endeavor to process information responsibly, lawfully, securely, and only for legitimate business purposes.",
      "We adopt commercially reasonable technical, contractual, administrative, and organizational safeguards to help protect information under our control.",
    ],
  },
  {
    number: "02",
    title: "Definitions",
    content: [
      "Personal Data / Personal Information means any information that identifies or can reasonably identify an individual.",
      "Sensitive Personal Data may include certain health-related declarations, identity documents, financial details, or other categories recognized under applicable law.",
      "Learner means a user who seeks, books, or attends sessions.",
      "Trainer means a user who offers services through the Platform.",
      "Processing includes collection, storage, use, sharing, analysis, deletion, transfer, and similar handling of data.",
    ],
  },
  {
    number: "03",
    title: "Categories of Data We Collect",
    content: [
      "We may collect information directly from you, automatically through technology, from transactions, from communications, and from third parties.",
    ],
    subsections: [
      {
        heading: "A. Identity & Contact Information",
        items: ["Full name", "Mobile number", "Email address", "Username", "Profile photograph (if uploaded)", "Date of birth / age (where required)"],
      },
      {
        heading: "B. Account Information",
        items: ["Login credentials (encrypted / hashed as applicable)", "OTP verification status", "Account ID", "Registration date & time", "Last login / activity timestamps"],
      },
      {
        heading: "C. Technical Data",
        items: ["Device type & identifiers", "Browser type & operating system", "IP address", "Approximate location", "App version", "Language preferences", "Network information"],
      },
      {
        heading: "D. Usage Data",
        items: ["Pages visited", "Buttons clicked", "Session duration", "Search behavior", "Feature usage", "Referral source", "Session recordings (media)"],
      },
      {
        heading: "E. Communication Data",
        items: ["Emails sent to support", "Chat messages through official systems", "Call logs or support notes (where permitted)", "Feedback / complaints"],
      },
    ],
  },
  {
    number: "04",
    title: "Data Collected from Learners",
    content: [
      "As Learners are booking users/customers, we may additionally collect:",
    ],
    subsections: [
      {
        heading: "A. Booking & Session Data",
        items: ["Requested session type", "Preferred trainer criteria", "Preferred date/time", "Session history & booking status", "Cancellation history & attendance records"],
      },
      {
        heading: "B. Wellness Preference Data",
        items: ["Yoga interests (beginner / advanced / meditation / fitness etc.)", "Goals selected (weight management, flexibility, stress relief etc.)", "Preferred language / trainer gender (if selected)"],
      },
      {
        heading: "C. Optional Health Declarations",
        items: ["Existing injuries", "Physical limitations", "Pregnancy declaration", "Health concerns relevant to safe participation"],
      },
      {
        heading: "D. Payment Data",
        items: ["Billing amount", "Transaction references", "Payment status", "Wallet / coupon usage (if any)"],
      },
      {
        heading: "E. Location Data",
        items: ["Address, country, state, city, pincode (if relevant)", "Device location permissions (if enabled)"],
      },
    ],
  },
  {
    number: "05",
    title: "Data Collected from Trainers",
    content: [
      "As Trainers are service providers, we may collect additional professional, verification, and payout-related data.",
    ],
    subsections: [
      {
        heading: "A. Professional Profile Data",
        items: ["Full name, trainer bio, qualifications", "Experience years & specializations", "Languages spoken, availability schedule", "Session rates (if applicable)"],
      },
      {
        heading: "B. KYC / Verification Data",
        items: ["Address proof", "Selfie / identity verification images", "Certifications / licenses / course completion records", "Bank verification documents"],
      },
      {
        heading: "C. Business & Payout Data",
        items: ["Bank account details", "UPI details", "GST details (if applicable)", "Invoice information", "Earnings records, commission deductions, payout history"],
      },
      {
        heading: "D. Performance Data",
        items: ["Session completion rate", "Ratings / reviews", "Response time", "Cancellation rate", "Complaints history & compliance status"],
      },
    ],
  },
  {
    number: "06",
    title: "Data from Third Parties",
    content: [
      "We may receive data from payment gateways, OTP/SMS providers, analytics tools, identity verification vendors, fraud prevention tools, marketing platforms, social login providers (if enabled), and lawful authorities or courts.",
    ],
  },
  {
    number: "07",
    title: "How We Use Information",
    content: [
      "We may use information for the following legitimate purposes: Platform Operations (create and manage accounts, authenticate users, enable bookings and sessions, provide customer support, match learners and trainers), Payment & Finance (process payments, detect duplicate or failed transactions, calculate trainer payouts, manage taxes and invoices), Safety & Compliance (verify identity, prevent fraud, detect suspicious behavior, investigate complaints, enforce Terms and policies), Communications (send OTPs, booking confirmations, reminders, notifications, service announcements), Analytics & Improvement (improve app performance, understand user behavior, optimize conversion flows, resolve bugs), and Marketing where permitted (promotional offers, newsletters, re-engagement campaigns).",
      "You may opt out of non-essential marketing communications where available.",
    ],
  },
  {
    number: "08",
    title: "Legal Basis for Processing",
    content: [
      "We may process data based on one or more of the following: your consent, performance of a contract, compliance with legal obligations, legitimate business interests, fraud prevention, and protection of rights and safety.",
    ],
  },
  {
    number: "09",
    title: "How We Share Information",
    content: [
      "We may share information only where reasonably necessary, including with service providers (cloud hosting, payment processors, SMS/email vendors, analytics providers, customer support systems), operational counterparties (Trainers receive learner booking-related information; Learners may receive trainer profile details), authorities where legally required (courts, police, regulators, government agencies), and during corporate transactions (merger, acquisition, restructuring, investment, or asset sale).",
      "We do not sell personal data to third-party advertisers as a business model unless explicitly disclosed and consented where required.",
    ],
  },
  {
    number: "10",
    title: "Data Retention",
    content: [
      "We retain data only as long as reasonably necessary for: account maintenance, service delivery, tax compliance, fraud prevention, legal claims, internal audit, and operational records. Retention periods may vary by category.",
      "Even after deletion requests, some records may be retained where legally required or necessary for legitimate interests.",
    ],
  },
  {
    number: "11",
    title: "Account Deletion Requests",
    content: [
      "Users may request account deletion by contacting our support team.",
      "Upon approved deletion request, active account access may be removed and some data may be anonymized. Certain financial, tax, dispute, fraud, and legal records may be retained. Deletion timelines may vary.",
    ],
  },
  {
    number: "12",
    title: "Data Security",
    content: [
      "We employ reasonable safeguards such as: access controls, role-based permissions, encryption in transit where applicable, password protection, secure servers/hosting controls, audit logging, and monitoring systems.",
      "However, no system is 100% secure. Users should also protect their credentials and devices.",
    ],
  },
  {
    number: "13",
    title: "Cross-Border Data Transfers",
    content: [
      "If services, vendors, or infrastructure operate outside India, your data may be processed in other jurisdictions with reasonable safeguards.",
      "By using the Platform, you consent to such transfers where lawful.",
    ],
  },
  {
    number: "14",
    title: "User Rights",
    content: [
      "Subject to applicable law, users may request: access to certain data, correction of inaccurate data, update of profile details, withdrawal of certain consents, deletion requests, and marketing opt-out.",
      "Requests may be subject to verification and lawful exceptions.",
    ],
  },
  {
    number: "15",
    title: "Children's Privacy",
    content: [
      "The Platform is not intended for unsupervised use by children below the age permitted by law. Parents/guardians are responsible where minors use the Platform.",
      "We may remove accounts violating age restrictions.",
    ],
  },
  {
    number: "16",
    title: "Health Data Notice",
    content: [
      "Any health or wellness information voluntarily shared is processed only for facilitating safer sessions, personalization, support, or compliance.",
      "We do not guarantee medical confidentiality equivalent to hospitals or clinics unless specifically stated. Users should avoid submitting unnecessary sensitive medical data.",
    ],
  },
  {
    number: "17",
    title: "Communication Monitoring",
    content: [
      "Where legally permissible, we may monitor or record support communications, internal messages, or dispute-related communications for quality, training, fraud prevention, and compliance purposes.",
    ],
  },
  {
    number: "18",
    title: "Cookie Policy",
    content: [
      "Cookies are small text files stored on your device when visiting websites or using certain digital services.",
    ],
    subsections: [
      {
        heading: "Types of Cookies We May Use",
        items: [
          "Essential Cookies — required for login, security, navigation, session continuity.",
          "Performance Cookies — understand traffic, usage trends, bugs, and performance.",
          "Functional Cookies — remember preferences such as language or location.",
          "Marketing Cookies — used for campaigns, retargeting, or ad measurement where lawful.",
        ],
      },
    ],
    callout: {
      icon: "🍪",
      text: "You may control cookies through browser settings. Disabling essential cookies may impact platform functionality.",
    },
  },
  {
    number: "19",
    title: "Intellectual Property Policy",
    content: [
      "All trademarks, logos, trade names, app designs, code, graphics, text, training materials, software, databases, and platform content are owned by or licensed to Yoga Bharath Holistic Services Private Limited unless otherwise stated.",
      "Users shall not copy content, scrape data, reproduce logos, reverse engineer software, commercially exploit platform content, or misrepresent association with Yoga Bharath.",
      "User-generated content remains subject to rights granted under Terms of Service. Unauthorized use may result in civil and/or criminal action.",
    ],
  },
  {
    number: "20",
    title: "Third-Party Links and Content",
    content: [
      "The Platform may contain links to third-party sites or integrations. We are not responsible for their privacy practices or content.",
      "Users should review their separate policies.",
    ],
  },
  {
    number: "21",
    title: "Breaches and Incident Response",
    content: [
      "In case of suspected data misuse, fraud, or security incidents, we may: suspend accounts, reset credentials, investigate logs, notify affected parties where required, and cooperate with lawful authorities.",
    ],
  },
  {
    number: "22",
    title: "Changes to This Policy",
    content: [
      "We may revise this Policy from time to time. Updated versions become effective upon publication unless otherwise stated.",
      "Continued use after updates indicates acceptance.",
    ],
  },
  {
    number: "23",
    title: "Governing Law",
    content: [
      "This Policy shall be governed by the laws of India, including applicable information technology, consumer protection, data protection, and contractual laws.",
      "Courts at the designated jurisdiction shall have exclusive jurisdiction, subject to applicable law.",
    ],
  },
  {
    number: "24",
    title: "Special Company Protection Clause",
    content: [
      "Users acknowledge that Yoga Bharath primarily operates a technology-enabled platform facilitating lawful interactions between Learners and Trainers. Data shared between parties necessary for bookings or services may be visible to relevant participants.",
      "The Company shall not be liable for misuse of information by another user beyond the Company's reasonable control, provided reasonable safeguards were implemented.",
    ],
  },
  {
    number: "25",
    title: "Consent",
    content: [
      "By clicking 'I Agree', registering, using the Platform, submitting forms, or continuing to use the Platform, you consent to the collection and processing of your information as described herein.",
    ],
  },
];

const PolicyPrivacyInfo = () => {
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

      {/* ── HERO BANNER ── */}
      <div className="pol-hero">
        <div className="container">
          <div className="pol-hero-badge">Legal Document</div>
          <h1>Privacy <span>Policy</span></h1>
          <p className="pol-hero-meta">
            Yoga Bharath Holistic Services Private Limited &nbsp;·&nbsp; Including Cookie Policy &amp; IP Notices
          </p>
          <div className="pol-hero-divider"></div>
        </div>
      </div>

      {/* ── BODY LAYOUT ── */}
      <div className="pol-layout">

        {/* SIDEBAR NAV */}
        <aside className="pol-sidebar">
          <div className="pol-sidebar-title">Sections</div>
          {sections.map((s) => (
            <a key={s.number} href={`#pol-section-${s.number}`} className="pol-sidebar-link">
              <span className="pol-sidebar-num">{s.number}</span>
              {s.title}
            </a>
          ))}
          <a href="#pol-contact" className="pol-sidebar-link">
            <span className="pol-sidebar-num">✉</span>
            Grievance Officer
          </a>
        </aside>

        {/* MAIN */}
        <main>
          {/* INTRO */}
          <div className="pol-intro">
            <p>
              This Privacy Policy ("Policy") describes how{" "}
              <strong>Yoga Bharath Holistic Services Private Limited</strong>, a company incorporated
              under the Companies Act, 2013 ("Company", "Yoga Bharath", "we", "us", "our"), collects,
              receives, stores, processes, uses, discloses, shares, protects, transfers, and otherwise
              handles personal data and related information when you access or use our website, mobile
              applications, dashboards, communication systems, and related services (collectively, the
              "Platform").
            </p>
            <p>
              This Policy also incorporates our <strong>Cookie Policy</strong> and{" "}
              <strong>Intellectual Property Notices</strong>.
            </p>
            <p className="pol-applies-title">This Policy applies to:</p>
            <ul className="pol-applies-list">
              {[
                "Visitors",
                "Learners / Customers",
                "Trainers / Service Providers",
                "Applicants",
                "Business Partners",
                "Support Contacts",
                "Website Users",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="pol-callout" style={{ marginTop: 18 }}>
              <span className="pol-callout-icon">⚠️</span>
              <p>
                By accessing, registering on, or using the Platform, you consent to the practices
                described in this Policy, subject to applicable law. If you do not agree with this
                Policy, please do not use the Platform.
              </p>
            </div>
          </div>

          {/* SECTIONS */}
          {sections.map((s) => (
            <div key={s.number} id={`pol-section-${s.number}`} className="pol-section">
              <div className="pol-section-header">
                <span className="pol-section-num">{s.number}</span>
                <h2 className="pol-section-title">{s.title}</h2>
              </div>
              <div className="pol-section-body">
                {s.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}

                {/* Sub-sections (lists under headings) */}
                {s.subsections &&
                  s.subsections.map((sub, si) => (
                    <div key={si}>
                      <p className="pol-sub-heading">{sub.heading}</p>
                      <ul className="pol-sub-list">
                        {sub.items.map((item, ii) => (
                          <li key={ii}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                {/* Optional callout */}
                {s.callout && (
                  <div className="pol-callout">
                    <span className="pol-callout-icon">{s.callout.icon}</span>
                    <p>{s.callout.text}</p>
                  </div>
                )}

                {/* Special callouts for critical sections */}
                {s.number === "04" && (
                  <div className="pol-callout">
                    <span className="pol-callout-icon">🏥</span>
                    <p>
                      We do not intend to provide medical diagnosis. Users should consult licensed
                      healthcare professionals where necessary.
                    </p>
                  </div>
                )}
                {s.number === "12" && (
                  <div className="pol-callout">
                    <span className="pol-callout-icon">🔒</span>
                    <p>
                      No system is 100% secure. Always protect your login credentials, OTPs, and
                      keep your device software up to date.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* GRIEVANCE OFFICER / CONTACT */}
          <div id="pol-contact" className="pol-section pol-contact">
            <h3>Contact / Grievance Officer</h3>
            <p>
              For privacy requests, complaints, corrections, data access, or concerns regarding this
              Policy, please reach out through the following channels:
            </p>
            <div className="pol-contact-grid">
              <div className="pol-contact-item">
                <label>Company</label>
                <span>Macsof Technologies.</span>
              </div>
              <div className="pol-contact-item">
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
              <div className="pol-contact-item">
                <label>Email</label>
                <span>Yogabharatms@gmail.com</span>
              </div>
              <div className="pol-contact-item">
                <label>Phone</label>
                <span>+91 81211 80099</span>
              </div>
              <div className="pol-contact-item">
                <label>Website</label>
                <a href="https://yoga-bharath.com/" target="_blank" rel="noopener noreferrer">
                  https://yoga-bharath.com/
                </a>
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
};

export default PolicyPrivacyInfo;