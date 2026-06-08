import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import StoreLayout from "../components/StoreLayout";
import { CATEGORY_OPTIONS } from "../data/catalogueOptions";
import {
  categoryToSlug,
  fetchPublishedProducts,
  fetchShowcaseSlides,
  getImageUrl,
} from "../utils/storefront";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchPublishedProducts();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const data = await fetchShowcaseSlides();
        setSlides(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };

    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const activeSlide = slides[activeSlideIndex];
    if (activeSlide?.mediaType === "video") return undefined;

    const timer = setTimeout(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 5200);

    return () => clearTimeout(timer);
  }, [activeSlideIndex, slides]);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const heroImage = products.find((product) => product.image)?.image;
  const activeSlide = slides[activeSlideIndex];
  const advanceSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlideIndex((currentIndex) => (currentIndex + 1) % slides.length);
  };
  const retreatSlide = () => {
    if (slides.length <= 1) return;
    setActiveSlideIndex((currentIndex) => (currentIndex - 1 + slides.length) % slides.length);
  };
  const handleTouchEnd = (event) => {
    if (touchStartX === null || slides.length <= 1) return;

    const distance = touchStartX - event.changedTouches[0].clientX;

    if (Math.abs(distance) > 42) {
      if (distance > 0) advanceSlide();
      else retreatSlide();
    }

    setTouchStartX(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .home-hero {
          min-height: calc(100vh - 76px);
          display: grid;
          grid-template-columns: 1.05fr 0.82fr;
          align-items: stretch;
          border-bottom: 1px solid rgba(201, 168, 76, 0.16);
        }

        .home-hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(58px, 8vw, 116px) clamp(24px, 6vw, 88px);
          text-align: left;
        }

        .home-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 18px;
        }

        .home-title {
          max-width: 760px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(62px, 10vw, 122px);
          font-weight: 300;
          line-height: 0.86;
          color: #1a0a2e;
          margin: 0;
        }

        .home-copy {
          max-width: 510px;
          margin: 30px 0 36px;
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.85;
          color: rgba(45, 17, 85, 0.68);
        }

        .home-cta {
          width: fit-content;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          padding: 0 24px;
          background: #2d1155;
          color: #e8c96e;
          text-decoration: none;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .home-hero-showcase {
          position: relative;
          min-height: 540px;
          background: #efe7df;
          overflow: hidden;
          touch-action: pan-y;
        }

        .home-hero-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          animation: showcaseFade 0.55s ease both;
        }

        .home-hero-overlay {
          position: absolute;
          inset: auto 28px 28px 28px;
          color: #fff;
          text-align: left;
          text-shadow: 0 2px 18px rgba(26, 10, 46, 0.32);
        }

        .home-hero-overlay-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 400;
          margin: 0 0 6px;
          color: #fff;
        }

        .home-hero-overlay-copy {
          max-width: 380px;
          margin: 0;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.78);
        }

        .home-hero-overlay-action {
          width: fit-content;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          margin-top: 18px;
          padding: 0 18px;
          border: 1px solid rgba(232, 201, 110, 0.72);
          background: rgba(26, 10, 46, 0.42);
          color: #f8e8ac;
          text-decoration: none;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .home-hero-overlay-action:hover {
          background: #f8e8ac;
          color: #2d1155;
          transform: translateY(-1px);
        }

        .showcase-dots {
          position: absolute;
          left: 28px;
          top: 28px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .showcase-dot {
          width: 28px;
          height: 2px;
          border: none;
          background: rgba(255, 255, 255, 0.4);
          padding: 0;
          cursor: pointer;
        }

        .showcase-dot.active {
          background: #e8c96e;
        }

        .showcase-arrow {
          position: absolute;
          top: 50%;
          z-index: 3;
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.48);
          border-radius: 50%;
          background: rgba(26, 10, 46, 0.26);
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .showcase-arrow:hover {
          background: rgba(45, 17, 85, 0.58);
          border-color: #e8c96e;
          transform: translateY(-50%) scale(1.04);
        }

        .showcase-arrow.prev {
          left: 18px;
        }

        .showcase-arrow.next {
          right: 18px;
        }

        @keyframes showcaseFade {
          from {
            opacity: 0;
            transform: scale(1.015);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .editorial-heading {
          margin-bottom: 34px;
          text-align: left;
        }

        .section-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 12px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 6vw, 70px);
          font-weight: 300;
          line-height: 0.98;
          color: #1a0a2e;
          margin: 0;
        }

        .featured-collections {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .collection-feature-card {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 26px;
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.18);
          text-decoration: none;
          color: #1a0a2e;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .collection-feature-card:hover {
          transform: translateY(-4px);
          border-color: #c9a84c;
        }

        .collection-feature-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          font-weight: 400;
          line-height: 1;
          margin: 0 0 10px;
        }

        .collection-feature-meta {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
        }

        .home-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .story-band {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: clamp(34px, 7vw, 88px);
          align-items: center;
          background: #1a0a2e;
          color: #fff;
        }

        .story-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 7vw, 82px);
          font-weight: 300;
          line-height: 0.95;
          margin: 0;
          color: #e8c96e;
        }

        .story-copy {
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 2;
          color: rgba(255, 255, 255, 0.72);
          margin: 0;
        }

        @media (max-width: 940px) {
          .home-hero,
          .story-band {
            grid-template-columns: 1fr;
          }

          .home-hero {
            min-height: auto;
          }

          .featured-collections,
          .home-products-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .home-hero-copy {
            padding: 56px 20px 42px;
          }

          .home-title {
            font-size: clamp(48px, 16vw, 68px);
            line-height: 0.9;
          }

          .home-copy {
            font-size: 16px;
            line-height: 1.75;
            margin: 24px 0 30px;
          }

          .featured-collections,
          .home-products-grid {
            grid-template-columns: 1fr;
          }

          .home-hero-showcase {
            min-height: 360px;
          }

          .home-hero-overlay {
            inset: auto 20px 22px 20px;
          }

          .home-hero-overlay-action {
            min-height: 40px;
            padding: 0 15px;
            font-size: 9px;
            letter-spacing: 0.14em;
          }

          .showcase-arrow {
            width: 40px;
            height: 40px;
            font-size: 22px;
          }

          .showcase-arrow.prev {
            left: 12px;
          }

          .showcase-arrow.next {
            right: 12px;
          }

          .collection-feature-card {
            min-height: 220px;
          }

          .story-band {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>

      <StoreLayout>
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-eyebrow">Modest Refinement</p>
            <h1 className="home-title">Quiet luxury for graceful days</h1>
            <p className="home-copy">
              Yufa Collections curates modest essentials with soft textures, elegant silhouettes, and a calm sense of occasion.
            </p>
            <Link className="home-cta" to="/collections">
              Explore Collections
            </Link>
          </div>
          <div
            className="home-hero-showcase"
            onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
            onTouchEnd={handleTouchEnd}
          >
            {slides.length > 1 && (
              <>
                <div className="showcase-dots">
                  {slides.map((slide, index) => (
                    <button
                      className={`showcase-dot ${index === activeSlideIndex ? "active" : ""}`}
                      type="button"
                      key={slide._id}
                      aria-label={`Show slide ${index + 1}`}
                      onClick={() => setActiveSlideIndex(index)}
                    />
                  ))}
                </div>
                <button className="showcase-arrow prev" type="button" aria-label="Previous showcase slide" onClick={retreatSlide}>
                  &lsaquo;
                </button>
                <button className="showcase-arrow next" type="button" aria-label="Next showcase slide" onClick={advanceSlide}>
                  &rsaquo;
                </button>
              </>
            )}

            {activeSlide?.mediaType === "video" ? (
              <video
                key={activeSlide._id}
                className="home-hero-media"
                src={getImageUrl(activeSlide.mediaUrl)}
                autoPlay
                muted
                playsInline
                onEnded={advanceSlide}
              />
            ) : activeSlide?.mediaUrl ? (
              <img
                key={activeSlide._id}
                className="home-hero-media"
                src={getImageUrl(activeSlide.mediaUrl)}
                alt={activeSlide.title || "Yufa showcase"}
              />
            ) : heroImage ? (
              <img className="home-hero-media" src={getImageUrl(heroImage)} alt="Yufa featured collection" />
            ) : null}

            {(activeSlide?.title || activeSlide?.subtitle || activeSlide?.productId) && (
              <div className="home-hero-overlay">
                {activeSlide.title && <h2 className="home-hero-overlay-title">{activeSlide.title}</h2>}
                {activeSlide.subtitle && <p className="home-hero-overlay-copy">{activeSlide.subtitle}</p>}
                {activeSlide.sourceType === "product" && activeSlide.productId && (
                  <Link className="home-hero-overlay-action" to={`/product/${activeSlide.productId}`}>
                    View Piece
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="store-section">
          <div className="store-container">
            <div className="editorial-heading">
              <p className="section-eyebrow">Featured Collections</p>
              <h2 className="section-title">A softer way to browse</h2>
            </div>
            <div className="featured-collections">
              {CATEGORY_OPTIONS.slice(0, 3).map((category) => (
                <Link
                  className="collection-feature-card"
                  key={category.name}
                  to={`/collections/${categoryToSlug(category.name)}`}
                >
                  <h3 className="collection-feature-name">{category.name}</h3>
                  <span className="collection-feature-meta">View Collection</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="store-section">
            <div className="store-container">
              <div className="editorial-heading">
                <p className="section-eyebrow">Published Pieces</p>
                <h2 className="section-title">Recently added</h2>
              </div>
              <div className="home-products-grid">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="store-section story-band">
          <h2 className="story-title">Made for presence, not noise.</h2>
          <p className="story-copy">
            The Yufa storefront is shaped around calm discovery: fewer distractions, more room for texture,
            modest beauty, and pieces that feel considered before they ever reach the cart.
          </p>
        </section>
      </StoreLayout>
    </>
  );
}

export default HomePage;
