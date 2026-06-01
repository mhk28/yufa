import { useState } from "react";
import { Link } from "react-router-dom";
import { getProductCollectionLabel } from "../data/catalogueOptions";
import { formatCurrency, getImageUrl, getProductOriginalPrice, getProductPriceLabel } from "../utils/storefront";

function ProductCard({ product }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const originalPrice = getProductOriginalPrice(product);
  const galleryImages = [...new Set([product.image, product.showcaseImage, ...(product.images || [])].filter(Boolean))];
  const activeImage = galleryImages[activeImageIndex] || product.image;
  const hasGallery = galleryImages.length > 1;

  const showPreviousImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    );
  };

  const showNextImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  const previewNextImage = () => {
    if (!hasGallery) return;
    setActiveImageIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <>
      <style>{`
        .store-product-card {
          color: inherit;
          text-decoration: none;
          display: block;
          min-width: 0;
          position: relative;
        }

        .store-product-image-wrap {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #efe7df;
        }

        .store-product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s ease;
        }

        .store-product-card:hover .store-product-image {
          transform: scale(1.045);
        }

        .store-product-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 62%, rgba(26, 10, 46, 0.32));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .store-product-card:hover .store-product-image-wrap::after {
          opacity: 1;
        }

        .quick-view-cue {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 14px;
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.92);
          color: #2d1155;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          z-index: 2;
        }

        .store-product-card:hover .quick-view-cue {
          opacity: 1;
          transform: translateY(0);
        }

        .product-card-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.58);
          border-radius: 50%;
          background: rgba(26, 10, 46, 0.42);
          color: #fff;
          cursor: pointer;
          z-index: 4;
          opacity: 0;
          transition: opacity 0.2s ease, background 0.2s ease;
        }

        .store-product-card:hover .product-card-arrow,
        .product-card-arrow:focus-visible {
          opacity: 1;
        }

        .product-card-arrow.prev {
          left: 10px;
        }

        .product-card-arrow.next {
          right: 10px;
        }

        .product-card-dots {
          position: absolute;
          left: 50%;
          bottom: 62px;
          transform: translateX(-50%);
          display: inline-flex;
          gap: 5px;
          z-index: 4;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .store-product-card:hover .product-card-dots {
          opacity: 1;
        }

        .product-card-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.62);
        }

        .product-card-dot.active {
          background: #e8c96e;
        }

        .store-product-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          color: rgba(45, 17, 85, 0.18);
        }

        .store-product-info {
          padding-top: 16px;
          text-align: left;
        }

        .store-product-category {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 8px;
          overflow-wrap: anywhere;
        }

        .store-product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(24px, 4vw, 26px);
          font-weight: 400;
          line-height: 1.1;
          color: #1a0a2e;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .store-product-price {
          margin: 9px 0 0;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.62);
        }

        .store-product-price.sale {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .store-sale-price {
          color: #2d1155;
          font-weight: 500;
        }

        .store-original-price {
          color: rgba(45, 17, 85, 0.38);
          text-decoration: line-through;
        }

        .store-sale-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 3;
          padding: 6px 9px;
          background: #2d1155;
          color: #e8c96e;
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        @media (max-width: 720px) {
          .store-product-image-wrap {
            aspect-ratio: 1 / 1.2;
          }

          .quick-view-cue {
            display: none;
          }

          .product-card-arrow,
          .store-product-card:hover .product-card-arrow {
            opacity: 1;
            width: 30px;
            height: 30px;
          }

          .product-card-dots,
          .store-product-card:hover .product-card-dots {
            opacity: 1;
            bottom: 10px;
          }

          .store-product-info {
            padding-top: 9px;
          }

          .store-product-category {
            font-size: 9px;
            line-height: 1.25;
            letter-spacing: 0.08em;
            margin-bottom: 5px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .store-product-name {
            font-size: clamp(18px, 5vw, 21px);
            line-height: 1.08;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .store-product-price {
            margin-top: 6px;
            font-size: 12px;
            line-height: 1.25;
            color: rgba(45, 17, 85, 0.72);
          }
        }

        @media (max-width: 340px) {
          .store-product-name {
            font-size: 17px;
          }

          .store-product-price {
            font-size: 11px;
          }
        }
      `}</style>

      <Link
        className="store-product-card"
        to={`/product/${product._id}`}
        onMouseEnter={previewNextImage}
      >
        <div className="store-product-image-wrap">
          {activeImage ? (
            <img className="store-product-image" src={getImageUrl(activeImage)} alt={product.name} />
          ) : (
          <div className="store-product-placeholder">Yufa</div>
          )}
          {product.isOnSale && originalPrice > 0 && <span className="store-sale-badge">Sale</span>}
          {hasGallery && (
            <>
              <button className="product-card-arrow prev" type="button" onClick={showPreviousImage} aria-label="Previous product image">
                ‹
              </button>
              <button className="product-card-arrow next" type="button" onClick={showNextImage} aria-label="Next product image">
                ›
              </button>
              <span className="product-card-dots" aria-hidden="true">
                {galleryImages.map((image, index) => (
                  <span
                    className={`product-card-dot ${activeImageIndex === index ? "active" : ""}`}
                    key={`${image}-${index}`}
                  />
                ))}
              </span>
            </>
          )}
          <span className="quick-view-cue">View Piece</span>
        </div>
        <div className="store-product-info">
          <p className="store-product-category">{getProductCollectionLabel(product) || "Collection"}</p>
          <h3 className="store-product-name">{product.name}</h3>
          {product.isOnSale && originalPrice > 0 ? (
            <p className="store-product-price sale">
              <span className="store-sale-price">{getProductPriceLabel(product)}</span>
              <span className="store-original-price">{formatCurrency(originalPrice)}</span>
            </p>
          ) : (
            <p className="store-product-price">{getProductPriceLabel(product)}</p>
          )}
        </div>
      </Link>
    </>
  );
}

export default ProductCard;
