import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import { useCart } from "../context/CartContext";
import { getProductCollectionLabel } from "../data/catalogueOptions";
import {
  API_BASE_URL,
  formatCurrency,
  getImageUrl,
  getProductPrice,
  getProductPriceLabel,
} from "../utils/storefront";

function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const selectedVariant =
    selectedVariantIndex !== "" ? product?.variants?.[Number(selectedVariantIndex)] : null;
  const hasVariants = product?.variants?.length > 0;
  const activePrice = selectedVariant
    ? Number(selectedVariant.price) || 0
    : hasVariants
      ? getProductPrice(product)
      : getProductPrice(product);
  const canAddToCart = Boolean(activePrice) && (!hasVariants || selectedVariant);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const data = await response.json();
        setProduct(data?.isPublished ? data : null);
        setActiveImageIndex(0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const getVariantLabel = (variant) =>
    [variant.type, variant.design, variant.color, variant.size].filter(Boolean).join(" / ") ||
    variant.sku ||
    "Variant";

  const galleryImages = product
    ? [...new Set([product.showcaseImage, product.image, ...(product.images || [])].filter(Boolean))]
    : [];

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return;

    addItem({
      productId: product._id,
      variantKey: selectedVariant ? selectedVariant._id || String(selectedVariantIndex) : "",
      variantLabel: selectedVariant ? getVariantLabel(selectedVariant) : "Standard",
      name: product.name,
      image: product.image,
      price: activePrice,
      quantity: 1,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .product-detail-section {
          padding: clamp(36px, 6vw, 82px) clamp(22px, 5vw, 72px);
        }

        .product-detail-grid {
          width: min(1180px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(320px, 0.95fr) minmax(320px, 0.8fr);
          gap: clamp(36px, 7vw, 92px);
          align-items: start;
        }

        .detail-gallery {
          display: grid;
          gap: 14px;
        }

        .detail-image-frame {
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #efe7df;
        }

        .detail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .detail-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 54px;
          color: rgba(45, 17, 85, 0.16);
        }

        .detail-thumbs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(68px, 1fr));
          gap: 10px;
        }

        .detail-thumb {
          aspect-ratio: 1;
          border: 1px solid rgba(201, 168, 76, 0.22);
          background: #fdfcfb;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
        }

        .detail-thumb.active {
          border-color: #2d1155;
          box-shadow: 0 0 0 2px rgba(201, 168, 76, 0.22);
        }

        .detail-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .detail-content {
          text-align: left;
        }

        .detail-breadcrumb {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.42);
          text-decoration: none;
        }

        .detail-breadcrumb::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -7px;
          height: 1px;
          background: #c9a84c;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
        }

        .detail-breadcrumb:hover {
          color: #2d1155;
        }

        .detail-breadcrumb:hover::after {
          transform: scaleX(1);
        }

        .detail-info-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin: 0 0 22px;
        }

        .detail-info-item {
          padding: 12px;
          border: 1px solid rgba(201, 168, 76, 0.14);
          background: rgba(255, 255, 255, 0.56);
        }

        .detail-info-label {
          display: block;
          margin-bottom: 5px;
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a84c;
        }

        .detail-info-value {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.66);
        }

        .detail-category {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 12px;
        }

        .detail-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(44px, 7vw, 78px);
          font-weight: 300;
          line-height: 0.94;
          color: #1a0a2e;
          margin: 0 0 22px;
        }

        .detail-description {
          max-width: 520px;
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.75;
          color: rgba(45, 17, 85, 0.66);
          margin: 0 0 24px;
        }

        .detail-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          font-weight: 400;
          color: #2d1155;
          margin: 0 0 22px;
        }

        .variant-field {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }

        .variant-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.5);
        }

        .variant-select {
          width: 100%;
          max-width: 420px;
          padding: 14px 16px;
          border: 1px solid rgba(201, 168, 76, 0.26);
          background: #fdfcfb;
          color: #1a0a2e;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .detail-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid rgba(201, 168, 76, 0.18);
        }

        .detail-primary,
        .detail-secondary {
          min-height: 48px;
          padding: 0 24px;
          border-radius: 0;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .detail-primary {
          border: 1px solid #2d1155;
          background: #2d1155;
          color: #e8c96e;
          cursor: pointer;
        }

        .detail-primary:disabled {
          opacity: 0.48;
          cursor: not-allowed;
        }

        .detail-secondary {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          border: 1px solid rgba(45, 17, 85, 0.2);
          color: #2d1155;
          background: transparent;
        }

        .detail-empty {
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-style: italic;
          color: rgba(45, 17, 85, 0.38);
        }

        @media (max-width: 860px) {
          .product-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .product-detail-section {
            padding: 18px 12px 48px;
          }

          .product-detail-grid {
            gap: 22px;
          }

          .detail-gallery {
            gap: 10px;
          }

          .detail-image-frame {
            aspect-ratio: 1 / 1.14;
          }

          .detail-thumbs {
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 7px;
          }

          .detail-breadcrumb {
            margin-bottom: 16px;
            font-size: 9px;
            letter-spacing: 0.14em;
          }

          .detail-title {
            font-size: clamp(42px, 14vw, 62px);
            line-height: 0.94;
            margin-bottom: 16px;
          }

          .detail-description {
            font-size: 15px;
            line-height: 1.65;
            margin-bottom: 18px;
          }

          .detail-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .detail-info-strip {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 18px;
            padding-bottom: 2px;
            scrollbar-width: none;
          }

          .detail-info-strip::-webkit-scrollbar {
            display: none;
          }

          .detail-info-item {
            flex: 0 0 auto;
            min-width: 112px;
            padding: 9px 10px;
          }

          .detail-info-label {
            font-size: 8px;
            letter-spacing: 0.1em;
          }

          .detail-info-value {
            font-size: 11px;
            white-space: nowrap;
          }

          .detail-price {
            font-size: 30px;
            margin-bottom: 18px;
          }

          .detail-primary,
          .detail-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <StoreLayout>
        {loading ? (
          <div className="detail-empty">Loading product...</div>
        ) : !product ? (
          <div className="detail-empty">This piece is not currently available.</div>
        ) : (
          <section className="product-detail-section">
            <div className="product-detail-grid">
              <div className="detail-gallery">
                <div className="detail-image-frame">
                  {galleryImages.length > 0 ? (
                    <img
                      className="detail-image"
                      src={getImageUrl(galleryImages[activeImageIndex] || galleryImages[0])}
                      alt={product.name}
                    />
                  ) : (
                    <div className="detail-placeholder">Yufa</div>
                  )}
                </div>

                {galleryImages.length > 1 && (
                  <div className="detail-thumbs">
                    {galleryImages.map((image, index) => (
                      <button
                        className={`detail-thumb ${activeImageIndex === index ? "active" : ""}`}
                        type="button"
                        key={image}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={getImageUrl(image)} alt={`${product.name} ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="detail-content">
                <Link className="detail-breadcrumb" to="/collections">
                  <span>←</span> Back to collection
                </Link>
                <p className="detail-category">{getProductCollectionLabel(product) || "Collection"}</p>
                <h1 className="detail-title">{product.name}</h1>
                <div className="detail-info-strip">
                  <div className="detail-info-item">
                    <span className="detail-info-label">Category</span>
                    <span className="detail-info-value">{product.category || "Collection"}</span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-label">Type</span>
                    <span className="detail-info-value">{product.subcategory || "Standard"}</span>
                  </div>
                  <div className="detail-info-item">
                    <span className="detail-info-label">Design</span>
                    <span className="detail-info-value">{product.design || "Yufa edit"}</span>
                  </div>
                </div>
                <p className="detail-description">
                  {product.description || "A considered piece from the Yufa collection, selected for modest elegance and everyday refinement."}
                </p>
                <p className="detail-price">
                  {selectedVariant
                    ? formatCurrency(activePrice)
                    : getProductPriceLabel(product)}
                </p>

                {hasVariants && (
                  <div className="variant-field">
                    <label className="variant-label">Select Option</label>
                    <select
                      className="variant-select"
                      value={selectedVariantIndex}
                      onChange={(e) => setSelectedVariantIndex(e.target.value)}
                    >
                      <option value="">Choose a variant</option>
                      {product.variants.map((variant, index) => (
                        <option key={variant._id || index} value={index}>
                          {getVariantLabel(variant)} - {formatCurrency(variant.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="detail-actions">
                  <button
                    className="detail-primary"
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                  >
                    Add to Cart
                  </button>
                  <Link className="detail-secondary" to="/contact">
                    Enquire
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </StoreLayout>
    </>
  );
}

export default ProductDetailPage;
