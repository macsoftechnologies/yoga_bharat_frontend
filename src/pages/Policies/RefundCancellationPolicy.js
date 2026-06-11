import React, { useEffect } from "react";
import "../Home.css";
import "./Policies.css";

const sections = [
  {
    number: "01",
    title: "Purpose of This Policy",
    content: [
      "This Policy establishes a fair, transparent, operationally practical, and commercially sustainable framework for session cancellations, booking modifications, rescheduling requests, refund eligibility, no-show handling, technical failure handling, trainer cancellations, chargeback handling, and promotional credit treatment.",
      "The Company reserves the right to interpret and apply this Policy in good faith, subject to applicable law."
    ]
  },
  {
    number: "02",
    title: "Definitions",
    content: [
      "Learner means a user who books or attends sessions.",
      "Trainer means a service provider offering sessions through the Platform.",
      "Booking means any confirmed instant or scheduled session.",
      "Instant Booking means an on-demand booking requiring immediate trainer allocation.",
      "Scheduled Booking means a booking reserved for a future date/time.",
      "No-Show means failure to attend a confirmed session within the applicable grace period.",
      "Refund means return of eligible money to the original payment source, wallet, or platform credit."
    ]
  },
  {
    number: "03",
    title: "General Principles",
    content: [
      "Refunds are not automatic and remain subject to verification, fraud checks, payment gateway processes, and operational review.",
      "Convenience fees, gateway charges, taxes, and promotional discounts may be treated separately.",
      "Certain bookings, offers, packages, memberships, and promotional transactions may be non-refundable.",
      "Refunds may be processed to the original payment method, platform wallet, credit balance, or another lawful method."
    ]
  },
  {
    number: "04",
    title: "Session Types Covered",
    content: [
      "This Policy applies to instant sessions, scheduled sessions, recurring sessions, trial sessions, package bookings, subscription bookings, and promotional bookings."
    ]
  },
  {
    number: "05",
    title: "Learner Cancellation Policy",
    content: [
      "Instant bookings cancelled before trainer acceptance may qualify for a full refund or platform credit.",
      "Cancellations after trainer acceptance may attract cancellation charges or partial refunds.",
      "Scheduled bookings cancelled within permitted timelines may be eligible for full or partial refunds.",
      "Bookings cancelled after the session start time are generally non-refundable.",
      "Repeated cancellations may result in reduced refund privileges or account restrictions."
    ]
  },
  {
    number: "06",
    title: "Rescheduling Policy",
    content: [
      "Rescheduling requests are subject to trainer availability.",
      "Requests must be made before the applicable cutoff time.",
      "Frequent rescheduling may be restricted.",
      "Rescheduled bookings may become non-refundable depending on timing and repeated modifications."
    ]
  },
  {
    number: "07",
    title: "Trainer Cancellation Policy",
    content: [
      "If a trainer cancels, fails to join, or becomes unavailable, learners may receive a refund, rescheduling option, replacement trainer, or platform credit.",
      "Repeated trainer cancellations may lead to warnings, suspension, or delisting."
    ]
  },
  {
    number: "08",
    title: "Platform Cancellation Rights",
    content: [
      "The Company may cancel, delay, reschedule, or reject bookings due to technical issues, fraud concerns, payment failures, policy violations, safety concerns, regulatory requirements, force majeure events, trainer deactivation, or operational constraints."
    ]
  },
  {
    number: "09",
    title: "No-Show Policy",
    content: [
      "Learners who fail to join within the applicable grace period may be marked as no-shows and may lose refund eligibility.",
      "Trainer no-shows may qualify learners for refunds, credits, or rescheduling.",
      "Connectivity issues may be reviewed on a case-by-case basis."
    ]
  },
  {
    number: "10",
    title: "Session Quality & Service Issues",
    content: [
      "Serious complaints such as trainer absence, misconduct, inappropriate behavior, service mismatch, or trainer-caused technical failures may qualify for investigation and suitable remedies including refunds, credits, or replacement sessions."
    ]
  },
  {
    number: "11",
    title: "Technical Failure Policy",
    content: [
      "If payment is deducted but a booking is not confirmed, the amount may be automatically reversed or refunded after reconciliation.",
      "Platform-side technical failures may qualify for refunds, credits, or rescheduling.",
      "Refunds may be denied where failures are caused by user devices, weak internet connections, unsupported app versions, or user negligence."
    ]
  },
  {
    number: "12",
    title: "Package & Subscription Purchases",
    content: [
      "Used sessions are non-refundable.",
      "Unused sessions may be refundable only where expressly permitted.",
      "Promotional discounts may be recalculated for partial cancellations.",
      "Packages may carry expiry dates and usage limitations."
    ]
  },
  {
    number: "13",
    title: "Promotions, Coupons & Credits",
    content: [
      "Coupons generally have no cash value unless specifically stated.",
      "Promotional discounts may lapse upon cancellation.",
      "Credits may carry expiry periods.",
      "Fraudulent coupon use may result in account action."
    ]
  },
  {
    number: "14",
    title: "Refund Processing Timelines",
    content: [
      "UPI and wallet refunds generally take 3–7 business days.",
      "Card refunds generally take 5–14 business days.",
      "Net banking refunds generally take 5–10 business days.",
      "Platform credits may be issued immediately."
    ]
  },
  {
    number: "15",
    title: "How to Request a Refund",
    content: [
      "Users may contact support through in-app support, email, helpdesk, or customer care channels.",
      "Requests should include booking details, registered contact information, issue descriptions, and supporting evidence where applicable."
    ]
  },
  {
    number: "16",
    title: "Fraud, Abuse & Misuse Protection",
    content: [
      "The Company reserves the right to deny refunds where there is evidence of fraudulent claims, manipulated evidence, promotional abuse, intentional no-shows, chargeback abuse, or misuse of multiple accounts."
    ]
  },
  {
    number: "17",
    title: "Chargebacks & Payment Disputes",
    content: [
      "Users raising disputes through banks or card issuers may have booking benefits suspended while investigations are ongoing.",
      "Wrongful chargebacks may result in recovery actions."
    ]
  },
  {
    number: "18",
    title: "Force Majeure",
    content: [
      "The Company shall not be liable for cancellations or delays caused by events beyond reasonable control including natural disasters, government restrictions, internet outages, power failures, pandemics, wars, or cyber incidents."
    ]
  },
  {
    number: "19",
    title: "Limitation of Liability",
    content: [
      "Refund remedies under this Policy constitute the primary monetary remedy for cancelled or disputed bookings.",
      "The Company shall not be liable for indirect losses, missed opportunities, inconvenience, emotional distress, or consequential damages."
    ]
  },
  {
    number: "20",
    title: "Policy Updates & Governing Law",
    content: [
      "The Company may revise this Policy from time to time.",
      "This Policy shall be governed by the laws of India and subject to applicable jurisdiction."
    ]
  }
];

function RefundCancellationPolicy() {
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
            Refund & <span>Cancellation Policy</span>
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
              This Refund & Cancellation Policy describes the rules governing
              cancellations, rescheduling, refunds, credits, no-shows,
              technical failures, payment disputes, and related matters arising
              from the use of Yoga Bharath services.
            </p>

            <div className="pol-callout">
              <span className="pol-callout-icon">💳</span>
              <p>
                By making any booking, payment, or purchase through the
                Platform, you agree to this Refund & Cancellation Policy.
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

export default RefundCancellationPolicy;