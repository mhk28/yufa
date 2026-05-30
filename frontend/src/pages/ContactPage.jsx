import StoreLayout from "../components/StoreLayout";

function ContactPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .contact-page {
          padding: clamp(76px, 11vw, 138px) clamp(22px, 5vw, 72px);
        }

        .contact-inner {
          width: min(1080px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(34px, 7vw, 88px);
          align-items: start;
          text-align: left;
        }

        .contact-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 18px;
        }

        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(54px, 8vw, 96px);
          font-weight: 300;
          line-height: 0.92;
          color: #1a0a2e;
          margin: 0 0 28px;
        }

        .contact-copy {
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.95;
          color: rgba(45, 17, 85, 0.6);
          margin: 0;
        }

        .contact-card {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.18);
          padding: 34px;
        }

        .contact-list {
          display: grid;
          gap: 12px;
        }

        .contact-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.14);
          text-decoration: none;
        }

        .contact-row:first-child {
          border-top: none;
          padding-top: 0;
        }

        .contact-icon {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #c9a84c;
          background: rgba(201, 168, 76, 0.05);
          flex-shrink: 0;
        }

        .contact-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 7px;
        }

        .contact-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 25px;
          color: #1a0a2e;
          overflow-wrap: anywhere;
        }

        .contact-note {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(201, 168, 76, 0.14);
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          line-height: 1.8;
          color: rgba(45, 17, 85, 0.54);
        }

        @media (max-width: 760px) {
          .contact-page {
            padding: 58px 20px 74px;
          }

          .contact-inner {
            grid-template-columns: 1fr;
          }

          .contact-title {
            font-size: clamp(44px, 14vw, 66px);
          }

          .contact-card {
            padding: 26px 22px;
          }

          .contact-value {
            font-size: 22px;
          }
        }
      `}</style>

      <StoreLayout>
        <section className="contact-page">
          <div className="contact-inner">
            <div>
              <p className="contact-eyebrow">Contact</p>
              <h1 className="contact-title">For questions, orders, and collection notes.</h1>
              <p className="contact-copy">
                Reach Yufa directly for order questions, product details, sizing, and new collection enquiries.
                We keep the contact flow simple, warm, and close to the brand.
              </p>
            </div>

            <div className="contact-card">
              <div className="contact-list">
                <a className="contact-row" href="mailto:admin@yufacollections.com">
                  <span className="contact-icon">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </span>
                  <span>
                    <span className="contact-label">Email</span>
                    <span className="contact-value">admin@yufacollections.com</span>
                  </span>
                </a>

                <a className="contact-row" href="tel:+6588793249">
                  <span className="contact-icon">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                    </svg>
                  </span>
                  <span>
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">+65 8879 3249</span>
                  </span>
                </a>

                <a className="contact-row" href="https://www.instagram.com/yufa.collections/" target="_blank" rel="noreferrer">
                  <span className="contact-icon">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                    </svg>
                  </span>
                  <span>
                    <span className="contact-label">Instagram</span>
                    <span className="contact-value">@yufa.collections</span>
                  </span>
                </a>

                <a className="contact-row" href="https://www.tiktok.com/@yufa.collections?lang=en" target="_blank" rel="noreferrer">
                  <span className="contact-icon">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M15.5 3c.5 2.9 2.1 4.5 5 4.8v3.4a8.1 8.1 0 0 1-5-1.6v6.1c0 3.1-2.2 5.3-5.4 5.3A5.1 5.1 0 0 1 5 15.9c0-3 2.3-5.2 5.4-5.2.4 0 .7 0 1.1.1v3.5a3 3 0 0 0-1.1-.2c-1.1 0-1.9.7-1.9 1.8 0 1 .8 1.8 1.8 1.8s1.8-.7 1.8-2V3h3.4Z" />
                    </svg>
                  </span>
                  <span>
                    <span className="contact-label">TikTok</span>
                    <span className="contact-value">@yufa.collections</span>
                  </span>
                </a>

                <a className="contact-row" href="https://www.facebook.com/profile.php?id=100091649473975" target="_blank" rel="noreferrer">
                  <span className="contact-icon">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M14 8.5V7c0-.7.5-1 1.2-1H17V3h-2.6C11.8 3 10 4.6 10 7v1.5H7.8V12H10v9h4v-9h2.7l.5-3.5H14Z" />
                    </svg>
                  </span>
                  <span>
                    <span className="contact-label">Facebook</span>
                    <span className="contact-value">Yufa Collections</span>
                  </span>
                </a>
              </div>
              <p className="contact-note">
                For urgent order updates, phone or Instagram is usually the fastest route.
              </p>
            </div>
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default ContactPage;
