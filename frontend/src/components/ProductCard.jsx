import { Link } from "react-router-dom";
import { getProductCollectionLabel } from "../data/catalogueOptions";
import { getImageUrl, getProductPriceLabel } from "../utils/storefront";

function ProductCard({ product }) {
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

        @media (max-width: 720px) {
          .store-product-image-wrap {
            aspect-ratio: 1 / 1.16;
          }

          .quick-view-cue {
            display: none;
          }

          .store-product-info {
            padding-top: 9px;
          }

          .store-product-category {
            font-size: 8px;
            line-height: 1.25;
            letter-spacing: 0.08em;
            margin-bottom: 5px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .store-product-name {
            font-size: clamp(15px, 4vw, 17px);
            line-height: 1.08;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .store-product-price {
            margin-top: 6px;
            font-size: 11px;
            line-height: 1.25;
            color: rgba(45, 17, 85, 0.72);
          }
        }

        @media (max-width: 340px) {
          .store-product-name {
            font-size: 15px;
          }

          .store-product-price {
            font-size: 10px;
          }
        }
      `}</style>

      <Link className="store-product-card" to={`/product/${product._id}`}>
        <div className="store-product-image-wrap">
          {product.image ? (
            <img className="store-product-image" src={getImageUrl(product.image)} alt={product.name} />
          ) : (
          <div className="store-product-placeholder">Yufa</div>
          )}
          <span className="quick-view-cue">View Piece</span>
        </div>
        <div className="store-product-info">
          <p className="store-product-category">{getProductCollectionLabel(product) || "Collection"}</p>
          <h3 className="store-product-name">{product.name}</h3>
          <p className="store-product-price">{getProductPriceLabel(product)}</p>
        </div>
      </Link>
    </>
  );
}

export default ProductCard;
