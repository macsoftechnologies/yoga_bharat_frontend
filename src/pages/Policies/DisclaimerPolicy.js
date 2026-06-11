import React, { useEffect } from "react";
import "../Home.css"; // reuse existing styles for navbar/footer

const sections = [
  {
    number: "01",
    title: "General Nature of Services",
    content: [
      "Yoga Bharath is a technology-enabled platform that facilitates access to yoga, wellness, mindfulness, lifestyle, and related services offered by independent Trainers or made available through the Platform.",
      "Services may include, without limitation: Yoga sessions, Stretching sessions, Meditation sessions, Breathing practices, Relaxation sessions, Wellness guidance, Fitness-oriented yoga, Lifestyle sessions, and Informational wellness content.",
      "Such services are intended for general wellness, education, personal development, and lifestyle support purposes only, unless expressly stated otherwise.",
    ],
  },
  {
    number: "02",
    title: "Not Medical Advice",
    content: [
      "No content, session, communication, suggestion, routine, recommendation, video, article, or guidance provided on the Platform shall be construed as medical advice, clinical diagnosis, treatment recommendation, prescription advice, physiotherapy advice, emergency healthcare advice, mental health counselling by licensed professionals (unless expressly stated), or a substitute for consultation with a qualified doctor.",
      "Users must consult licensed medical professionals for any health concerns, symptoms, chronic conditions, injuries, pregnancy-related matters, or emergencies.",
      "If you experience chest pain, dizziness, breathing difficulty, severe discomfort, injury, or any alarming symptom, stop immediately and seek medical help.",
    ],
  },
  {
    number: "03",
    title: "Individual Results May Vary",
    content: [
      "Wellness outcomes differ from person to person depending on factors such as age, physical condition, prior injuries, medical history, consistency of practice, nutrition, lifestyle habits, effort levels, genetics, and external circumstances.",
      "The Company makes no guarantee regarding weight loss, pain relief, cure of disease, flexibility gain, stress reduction, fitness transformation, improved sleep, guaranteed progress, or any specific physical or mental result.",
    ],
  },
  {
    number: "04",
    title: "Voluntary Participation & Assumption of Risk",
    content: [
      "Participation in yoga, movement, breathing, stretching, or wellness activities involves inherent risks, including but not limited to: muscle strain, joint pain, falls, balance loss, fatigue, dizziness, discomfort, aggravation of existing conditions, and emotional discomfort during mindfulness practices.",
      "By participating, you voluntarily assume all risks, known or unknown, associated with such activities.",
      "Users are solely responsible for deciding whether they are fit to participate.",
    ],
  },
  {
    number: "05",
    title: "User Responsibility to Disclose Health Conditions",
    content: [
      "Users are responsible for accurately disclosing any relevant condition that may affect participation, including but not limited to: pregnancy, back pain, heart conditions, blood pressure concerns, surgery recovery, vertigo, arthritis, fractures, respiratory conditions, neurological conditions, and mobility limitations.",
      "Failure to disclose relevant conditions may affect session suitability and may limit the Company's or Trainer's ability to provide safe modifications.",
    ],
  },
  {
    number: "06",
    title: "No Emergency or Critical Care Service",
    content: [
      "The Platform is not an emergency response service.",
      "The Platform must not be used for urgent medical conditions, accidents, trauma, psychiatric emergencies, or life-threatening situations.",
      "In emergencies, contact local emergency services or licensed healthcare providers immediately.",
    ],
  },
  {
    number: "07",
    title: "Trainer Status Disclaimer",
    content: [
      "Unless expressly stated in writing, Trainers available through the Platform are independent service providers and are not employees, agents, partners, or representatives of the Company.",
      "Trainers are responsible for their conduct, session delivery, statements made by them, professional behavior, and accuracy of qualifications submitted by them.",
      "While the Company may conduct verification checks or document reviews, the Company does not guarantee skill level, professional excellence, certification validity beyond reasonable review, compatibility with every user, or session outcomes.",
    ],
  },
  {
    number: "08",
    title: "Online Session Limitations",
    content: [
      "For online or virtual sessions, quality may depend on internet speed, device quality, audio clarity, camera placement, lighting, user environment, and third-party communication tools.",
      "The Company does not guarantee uninterrupted audio/video quality.",
      "Incorrect camera angles or limited visibility may reduce a Trainer's ability to observe posture and provide corrections.",
    ],
  },
  {
    number: "09",
    title: "Home / Personal Environment Responsibility",
    content: [
      "Users are responsible for ensuring a safe practice environment, including adequate floor space, stable surface, proper ventilation, removal of obstacles, suitable clothing, and safe props/equipment.",
      "The Company shall not be responsible for injuries caused by unsafe premises, household hazards, pets, furniture, slippery floors, or third-party interference.",
    ],
  },
  {
    number: "10",
    title: "Content Disclaimer",
    content: [
      "Articles, blogs, tips, videos, schedules, FAQs, educational posts, and marketing materials are provided for general informational purposes only.",
      "Such content may be updated, changed, incomplete, simplified, or generalized.",
      "Users should not rely solely on content for medical, financial, legal, or professional decisions.",
    ],
  },
  {
    number: "11",
    title: "Third-Party Links / Services",
    content: [
      "The Platform may contain links or integrations relating to payment gateways, video conferencing tools, social media, and external content providers.",
      "The Company is not responsible for third-party systems, policies, outages, security, or performance.",
    ],
  },
  {
    number: "12",
    title: "Technical Disclaimer",
    content: [
      "The Platform may experience interruptions, delays, bugs, maintenance downtime, compatibility issues, or data sync delays.",
      "The Company does not warrant that the Platform will always be error-free, uninterrupted, virus-free, compatible with every device, or available in all regions at all times.",
      "Reasonable efforts may be made to maintain service continuity.",
    ],
  },
  {
    number: "13",
    title: "Payment Disclaimer",
    content: [
      "Payment processing may involve third-party payment service providers.",
      "Delays in refunds, reversals, settlements, or confirmations may depend on banks, gateways, or UPI networks.",
      "The Company is not responsible for banking delays beyond reasonable control.",
    ],
  },
  {
    number: "14",
    title: "Age & Dependent Users",
    content: [
      "Minors should use the Platform only under supervision and consent of a parent/legal guardian.",
      "Guardians are responsible for evaluating suitability of any activity for minors.",
    ],
  },
  {
    number: "15",
    title: "Pregnancy & Special Conditions",
    content: [
      "Pregnant users or users with special medical conditions should seek professional medical approval before participation.",
      "Specialized prenatal or therapeutic guidance may require specifically qualified professionals.",
      "The Company does not guarantee suitability of general sessions for such conditions.",
    ],
  },
  {
    number: "16",
    title: "Mental Wellness Limitation",
    content: [
      "Meditation, breathing exercises, mindfulness, or relaxation content may affect users differently.",
      "Such services are not substitutes for psychiatric care, counselling, therapy, or emergency mental health treatment.",
      "Users facing severe stress, depression, panic, self-harm thoughts, or psychological emergencies should contact licensed professionals immediately.",
    ],
  },
  {
    number: "17",
    title: "Testimonials & Reviews Disclaimer",
    content: [
      "Testimonials, ratings, before/after stories, or user feedback reflect individual experiences.",
      "They do not guarantee that other users will obtain similar outcomes.",
    ],
  },
  {
    number: "18",
    title: "No Guarantee of Availability",
    content: [
      "The Company does not guarantee availability of any specific Trainer, preferred time slot, instant response, geographic coverage, or continuous pricing structure.",
      "Features may change or be withdrawn without notice.",
    ],
  },
  {
    number: "19",
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted under applicable law, Yoga Bharath Holistic Services Private Limited, its promoters, directors, officers, employees, affiliates, licensors, vendors, and representatives shall not be liable for: injuries during sessions, health complications, allergic reactions, falls or accidents, existing condition aggravation, emotional distress, Trainer misconduct beyond reasonable control, user misconduct, technical failures, lost profits, indirect or consequential damages, missed opportunities, or dissatisfaction with outcomes.",
      "Where liability cannot be lawfully excluded, liability shall be limited to the extent permitted by law and subject to the Terms of Service.",
    ],
  },
  {
    number: "20",
    title: "Indemnity by Users",
    content: [
      "Users agree to indemnify and hold harmless the Company against claims, losses, damages, liabilities, costs, or expenses arising from: misrepresentation of health status, unsafe practice conduct, violation of instructions, misuse of Platform, breach of policies, or harm caused to third parties by user actions.",
    ],
  },
  {
    number: "21",
    title: "Regulatory / Jurisdictional Limitation",
    content: [
      "Services may not be suitable or lawful in every jurisdiction. Users are responsible for ensuring local compliance where they access the Platform.",
    ],
  },
  {
    number: "22",
    title: "Changes to This Disclaimer",
    content: [
      "The Company may revise this Disclaimer at any time.",
      "Updated versions become effective upon publication unless otherwise stated.",
      "Continued use after changes constitutes acceptance.",
    ],
  },
  {
    number: "23",
    title: "Governing Law",
    content: [
      "This Disclaimer shall be governed by the laws of India.",
      "Subject to applicable law, courts located at the designated jurisdiction shall have exclusive jurisdiction.",
    ],
  },
  {
    number: "24",
    title: "User Acknowledgement",
    content: [
      "By using the Platform, booking a session, viewing content, or participating in any activity, you acknowledge and agree that: you participate voluntarily, you are responsible for your own health decisions, Yoga Bharath does not provide guaranteed results, Yoga Bharath is not a substitute for medical care, risks may exist in physical activity, and liability is limited as permitted by law.",
    ],
  },
  {
    number: "25",
    title: "Company Safe-Zone Clause",
    content: [
      "For abundant caution, users acknowledge that Yoga Bharath primarily functions as a facilitator of wellness-related services through technology infrastructure and shall not be deemed the treating medical authority, emergency responder, insurer, guarantor of outcomes, or absolute guarantor of Trainer conduct beyond reasonable compliance controls maintained by the Company.",
    ],
  },
];

const DisclaimerPolicy = () => {
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
        .dp-page {
          background: #faf9f6;
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* ── HERO BANNER ── */
        .dp-hero {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          padding: 130px 0 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .dp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(253,171,42,0.12) 0%, transparent 65%);
        }
        .dp-hero-badge {
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
        .dp-hero h1 {
          font-size: clamp(1.9rem, 4vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .dp-hero h1 span {
          color: #fdab2a;
        }
        .dp-hero-meta {
          color: rgba(255,255,255,0.55);
          font-size: 0.88rem;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .dp-hero-divider {
          width: 56px;
          height: 3px;
          background: linear-gradient(90deg, #fdab2a, #f07b1e);
          border-radius: 2px;
          margin: 20px auto 0;
        }

        /* ── LAYOUT ── */
        .dp-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .dp-layout { grid-template-columns: 1fr; }
          .dp-sidebar { display: none; }
        }

        /* ── SIDEBAR ── */
        .dp-sidebar {
          position: sticky;
          top: 90px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
          padding: 24px 0;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        .dp-sidebar-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          padding: 0 20px 14px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 8px;
        }
        .dp-sidebar-link {
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
        .dp-sidebar-link:hover {
          background: #fff8ee;
          color: #f07b1e;
          border-left-color: #fdab2a;
          text-decoration: none;
        }
        .dp-sidebar-num {
          font-size: 0.7rem;
          font-weight: 700;
          color: #fdab2a;
          min-width: 22px;
        }

        /* ── MAIN CONTENT ── */
        .dp-intro {
          background: #ffffff;
          border-radius: 14px;
          padding: 32px 36px;
          margin-bottom: 32px;
          border-left: 4px solid #fdab2a;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }
        .dp-intro p {
          color: #444;
          font-size: 0.95rem;
          line-height: 1.75;
          margin: 0 0 12px;
        }
        .dp-intro p:last-child { margin: 0; }
        .dp-applies-title {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #f07b1e;
          margin: 18px 0 10px;
        }
        .dp-applies-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .dp-applies-list li {
          background: #fff3e0;
          border: 1px solid #ffe0b2;
          color: #e65100;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 20px;
        }

        /* ── SECTION CARD ── */
        .dp-section {
          background: #ffffff;
          border-radius: 14px;
          padding: 28px 36px;
          margin-bottom: 20px;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          transition: box-shadow 0.2s;
          scroll-margin-top: 100px;
        }
        .dp-section:hover {
          box-shadow: 0 4px 24px rgba(253,171,42,0.12);
        }
        .dp-section-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }
        .dp-section-num {
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
        .dp-section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          line-height: 1.3;
        }
        .dp-section-body {
          padding-left: 54px;
        }
        .dp-section-body p {
          font-size: 0.9rem;
          color: #555;
          line-height: 1.75;
          margin: 0 0 10px;
        }
        .dp-section-body p:last-child { margin: 0; }

        /* ── IMPORTANT CALLOUT ── */
        .dp-callout {
          background: #fff8ee;
          border: 1px solid #ffe0a0;
          border-radius: 10px;
          padding: 16px 20px;
          margin-top: 14px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .dp-callout-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .dp-callout p {
          margin: 0;
          font-size: 0.87rem;
          color: #7a4500;
          line-height: 1.6;
        }

        /* ── CONTACT SECTION ── */
        .dp-contact {
          background: linear-gradient(135deg, #1a1a2e, #0f3460);
          border-radius: 14px;
          padding: 36px;
          color: #fff;
          margin-bottom: 0;
        }
        .dp-contact h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fdab2a;
          margin: 0 0 8px;
        }
        .dp-contact p {
          color: rgba(255,255,255,0.7);
          font-size: 0.88rem;
          margin: 0 0 18px;
          line-height: 1.6;
        }
        .dp-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .dp-contact-item {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 16px;
        }
        .dp-contact-item label {
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #fdab2a;
          display: block;
          margin-bottom: 4px;
        }
        .dp-contact-item span {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.85);
        }

        @media (max-width: 600px) {
          .dp-intro, .dp-section { padding: 22px 20px; }
          .dp-section-body { padding-left: 0; }
          .dp-contact { padding: 24px 20px; }
        }
      `}</style>

      <div className="dp-page">
        {/* ── NAVBAR (reused from Home) ── */}
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
        <div className="dp-hero">
          <div className="container">
            <div className="dp-hero-badge">Legal Document</div>
            <h1>Disclaimer <span>Policy</span></h1>
            <p className="dp-hero-meta">
              Yoga Bharath Holistic Services Private Limited &nbsp;·&nbsp;
            </p>
            <div className="dp-hero-divider"></div>
          </div>
        </div>

        {/* ── BODY LAYOUT ── */}
        <div className="dp-layout">

          {/* SIDEBAR NAV */}
          <aside className="dp-sidebar">
            <div className="dp-sidebar-title">Sections</div>
            {sections.map((s) => (
              <a key={s.number} href={`#dp-section-${s.number}`} className="dp-sidebar-link">
                <span className="dp-sidebar-num">{s.number}</span>
                {s.title}
              </a>
            ))}
            <a href="#dp-contact" className="dp-sidebar-link">
              <span className="dp-sidebar-num">✉</span>
              Contact Details
            </a>
          </aside>

          {/* MAIN */}
          <main>
            {/* INTRO */}
            <div className="dp-intro">
              <p>
                This Disclaimer Policy ("Disclaimer") forms an integral part of the Terms of Service,
                Privacy Policy, Refund &amp; Cancellation Policy, and all related policies of{" "}
                <strong>Yoga Bharath Holistic Services Private Limited</strong>, a company incorporated
                under the Companies Act, 2013 ("Company", "Yoga Bharath", "we", "us", "our").
              </p>
              <p>
                This Disclaimer applies to all users of the Yoga Bharath website, mobile applications,
                dashboards, communication systems, sessions, content, and services (collectively, the
                "Platform"), including:
              </p>
              <ul className="dp-applies-list">
                {["Learners / Customers","Trainers / Service Providers","Visitors","Trial Users","Subscribers","Any person accessing content or services"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="dp-callout" style={{ marginTop: 18 }}>
                <span className="dp-callout-icon">⚠️</span>
                <p>
                  By accessing, registering, browsing, booking, attending sessions, viewing content, or
                  using the Platform in any manner, you acknowledge that you have read, understood, and
                  accepted this Disclaimer. If you do not agree, you should discontinue use of the Platform.
                </p>
              </div>
            </div>

            {/* SECTIONS */}
            {sections.map((s) => (
              <div key={s.number} id={`dp-section-${s.number}`} className="dp-section">
                <div className="dp-section-header">
                  <span className="dp-section-num">{s.number}</span>
                  <h2 className="dp-section-title">{s.title}</h2>
                </div>
                <div className="dp-section-body">
                  {s.content.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  {/* Special callout for medical/emergency sections */}
                  {(s.number === "02" || s.number === "06" || s.number === "16") && (
                    <div className="dp-callout">
                      <span className="dp-callout-icon">🚨</span>
                      <p>
                        {s.number === "02" && "In case of any medical emergency, stop the session immediately and contact a licensed healthcare professional or emergency services."}
                        {s.number === "06" && "For emergencies, dial your local emergency number (112 in India) or go to the nearest hospital."}
                        {s.number === "16" && "If you are in psychological distress, contact iCall (India): 9152987821 or Vandrevala Foundation: 1860-2662-345."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* CONTACT */}
            <div id="dp-contact" className="dp-section dp-contact">
              <h3>Contact Details</h3>
              <p>
                For questions, concerns, or clarifications regarding this Disclaimer Policy, please
                reach out to us through the following channels:
              </p>
              <div className="dp-contact-grid">
                <div className="dp-contact-item">
                  <label>Company</label>
                  <span>Macsof Technologies.</span>
                </div>
                <div className="dp-contact-item">
                    <label>Address</label>

                    <p>Door No 9-36-20, Flat No. 102,</p>
                    <p>Sivalayam Road, Pitapuram Colony,</p>
                    <p>Maddilapalem, Visakhapatnam - 530003</p>

                    <a
                        href="https://www.google.com/maps/search/?api=1&query=Sivalayam+Road+Pitapuram+Colony+Maddilapalem+Visakhapatnam+530003"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        Get Directions
                    </a>
                    </div>
                <div className="dp-contact-item">
                  <label>Email</label>
                  <span>Yogabharatms@gmail.com</span>
                </div>
                <div className="dp-contact-item">
                  <label>Phone</label>
                  <span>+91 81211 80099</span>
                </div>
                <div className="dp-contact-item">
                  <label>Website</label>
                  <span> <a href="https://yoga-bharath.com/" target="_blank" rel="noopener noreferrer">https://yoga-bharath.com/</a></span>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* ── FOOTER (reused from Home) ── */}
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

export default DisclaimerPolicy;