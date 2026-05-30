import StoreLayout from "../components/StoreLayout";

function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .story-page {
          padding: clamp(76px, 11vw, 146px) clamp(22px, 5vw, 72px);
        }

        .story-page-inner {
          width: min(920px, 100%);
          margin: 0 auto;
          text-align: left;
        }

        .story-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 18px;
        }

        .story-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(58px, 9vw, 112px);
          font-weight: 300;
          line-height: 0.9;
          color: #1a0a2e;
          margin: 0 0 34px;
        }

        .story-page-copy {
          columns: 2;
          column-gap: 54px;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 2;
          color: rgba(45, 17, 85, 0.62);
        }

        .story-page-copy p {
          margin: 0 0 22px;
        }

        @media (max-width: 740px) {
          .story-page {
            padding: 58px 20px 74px;
          }

          .story-page-title {
            font-size: clamp(46px, 14vw, 68px);
            line-height: 0.94;
          }

          .story-page-copy {
            columns: 1;
            font-size: 14px;
            line-height: 1.85;
          }
        }
      `}</style>

      <StoreLayout>
        <section className="story-page">
          <div className="story-page-inner">
            <p className="story-eyebrow">Brand Story</p>
            <h1 className="story-page-title">Modesty, softened into everyday elegance.</h1>
            <div className="story-page-copy">
              <p>
                Yufa Collections is built around the feeling of getting dressed with ease:
                pieces that feel graceful, refined, and quietly expressive.
              </p>
              <p>
                The collection brings together modest essentials, fragrance rituals, and meaningful
                everyday products with a slower, more intentional approach to browsing.
              </p>
              <p>
                This is not a marketplace crowded with noise. It is a calm edit for women who value
                softness, faith, texture, and timeless presence.
              </p>
            </div>
          </div>
        </section>
      </StoreLayout>
    </>
  );
}

export default AboutPage;
