import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import StoreLayout from "../components/StoreLayout";
import {
  CATEGORY_OPTIONS,
  categoryMatches,
  getCanonicalCategoryName,
} from "../data/catalogueOptions";
import { categoryToSlug, fetchPublishedProducts } from "../utils/storefront";

function CollectionsStorePage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [assortmentFilter, setAssortmentFilter] = useState("all");
  const [designFilter, setDesignFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const activeCategory = CATEGORY_OPTIONS.find((option) => categoryToSlug(option.name) === category);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchPublishedProducts();
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    setAssortmentFilter("all");
    setDesignFilter("all");
  }, [category]);

  const baseProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((product) => categoryMatches(product, activeCategory));
  }, [activeCategory, products]);

  const assortmentOptions = useMemo(() => {
    const optionMap = new Map();

    baseProducts.forEach((product) => {
      if (!product.subcategory) return;

      const categoryName = getCanonicalCategoryName(product.category);
      const key = `${categoryName}::${product.subcategory}`;
      optionMap.set(key, {
        value: product.subcategory,
        label: activeCategory ? product.subcategory : `${categoryName} / ${product.subcategory}`,
      });
    });

    return [...optionMap.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [activeCategory, baseProducts]);

  const designOptions = useMemo(() => {
    const optionMap = new Map();

    baseProducts.forEach((product) => {
      if (!product.design) return;

      const categoryName = getCanonicalCategoryName(product.category);
      const context = [categoryName, product.subcategory].filter(Boolean).join(" / ");
      const key = `${context}::${product.design}`;
      optionMap.set(key, {
        value: product.design,
        label: activeCategory ? [product.subcategory, product.design].filter(Boolean).join(" / ") : `${context} / ${product.design}`,
      });
    });

    return [...optionMap.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [activeCategory, baseProducts]);

  const visibleProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return baseProducts
      .filter((product) => {
        const searchable = [
          product.name,
          product.description,
          product.category,
          product.subcategory,
          product.design,
          ...(product.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = !search || searchable.includes(search);
        const matchesAssortment =
          assortmentFilter === "all" || product.subcategory === assortmentFilter;
        const matchesDesign = designFilter === "all" || product.design === designFilter;

        return matchesSearch && matchesAssortment && matchesDesign;
      })
      .sort((a, b) => {
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortBy === "price-low") {
          return (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0);
        }
        if (sortBy === "price-high") {
          return (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [assortmentFilter, baseProducts, designFilter, searchTerm, sortBy]);

  const hasFilters =
    searchTerm.trim() || assortmentFilter !== "all" || designFilter !== "all" || sortBy !== "featured";

  const clearFilters = () => {
    setSearchTerm("");
    setAssortmentFilter("all");
    setDesignFilter("all");
    setSortBy("featured");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .collection-hero {
          padding: clamp(70px, 9vw, 112px) clamp(22px, 5vw, 72px) clamp(34px, 5vw, 58px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.16);
        }

        .collection-hero-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
          text-align: left;
        }

        .collection-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 16px;
        }

        .collection-title {
          max-width: 760px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(56px, 9vw, 112px);
          font-weight: 300;
          line-height: 0.9;
          color: #1a0a2e;
          margin: 0;
          letter-spacing: 0;
        }

        .collection-copy {
          max-width: 520px;
          margin: 22px 0 0;
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.8;
          color: rgba(45, 17, 85, 0.68);
        }

        .collection-search-input {
          width: min(380px, 100%);
          flex: 1 1 340px;
          min-height: 42px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.66);
          color: #1a0a2e;
          padding: 0 18px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .collection-search-input::placeholder {
          color: rgba(45, 17, 85, 0.38);
        }

        .collection-search-input:focus {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
        }

        .collection-controls {
          padding: 24px clamp(22px, 5vw, 72px) 0;
        }

        .collection-controls-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .collection-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
          align-items: center;
        }

        .collection-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .collection-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 16px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          border-radius: 999px;
          text-decoration: none;
          color: rgba(45, 17, 85, 0.62);
          background: rgba(255, 255, 255, 0.62);
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }

        .collection-chip.active,
        .collection-chip:hover {
          color: #2d1155;
          border-color: #c9a84c;
          background: #fff;
        }

        .discovery-panel {
          display: grid;
          grid-template-columns: repeat(3, minmax(160px, 1fr)) auto;
          gap: 10px;
          align-items: end;
          padding-top: 16px;
          border-top: 1px solid rgba(201, 168, 76, 0.16);
        }

        .discovery-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .discovery-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.52);
        }

        .discovery-select {
          width: 100%;
          height: 44px;
          border: 1px solid rgba(201, 168, 76, 0.22);
          background: #fdfcfb;
          color: #1a0a2e;
          padding: 0 14px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          outline: none;
        }

        .discovery-select:focus {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
        }

        .clear-filters {
          height: 44px;
          padding: 0 16px;
          border: 1px solid rgba(45, 17, 85, 0.18);
          background: transparent;
          color: #2d1155;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
        }

        .clear-filters:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        .products-store-section {
          padding: 28px clamp(22px, 5vw, 72px) clamp(74px, 10vw, 128px);
        }

        .collection-results-bar {
          width: min(1180px, 100%);
          margin: 0 auto 22px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          text-align: left;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          color: rgba(45, 17, 85, 0.66);
        }

        .collection-results-bar strong {
          color: #2d1155;
          font-weight: 500;
        }

        .collection-results-note {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9a84c;
        }

        .products-store-grid {
          width: min(1180px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: clamp(22px, 3vw, 34px);
        }

        .store-product-card {
          color: inherit;
          text-decoration: none;
          display: block;
        }

        .store-product-image-wrap {
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
        }

        .store-product-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          line-height: 1.1;
          color: #1a0a2e;
          margin: 0;
        }

        .collection-empty {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 72px 0;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-style: italic;
          color: rgba(45, 17, 85, 0.34);
          background: rgba(255, 255, 255, 0.56);
          border: 1px solid rgba(201, 168, 76, 0.14);
        }

        @media (max-width: 1040px) {
          .discovery-panel {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .collection-hero {
            padding: 56px 20px 38px;
          }

          .collection-title {
            font-size: clamp(48px, 15vw, 70px);
            line-height: 0.92;
          }

          .collection-copy {
            font-size: 16px;
            line-height: 1.7;
          }

          .collection-controls,
          .products-store-section {
            padding-left: 12px;
            padding-right: 12px;
          }

          .collection-filter {
            gap: 10px;
          }

          .collection-chip-row {
            gap: 8px;
          }

          .collection-chip {
            min-height: 36px;
            padding: 0 12px;
            font-size: 10px;
            letter-spacing: 0.08em;
          }

          .products-store-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px 12px;
          }

          .collection-results-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }

      `}</style>

      <StoreLayout>
        <section className="collection-hero">
          <div className="collection-hero-inner">
            <div>
              <p className="collection-eyebrow">
                {activeCategory ? activeCategory.name : "The Collection"}
              </p>
              <h1 className="collection-title">Crafted modest essentials</h1>
              <p className="collection-copy">
                A quiet edit of scarves, abayas, fragrance rituals, and everyday pieces selected with softness and intention.
              </p>
            </div>
          </div>
        </section>

        <section className="collection-controls">
          <div className="collection-controls-inner">
            <div className="collection-filter">
              <div className="collection-chip-row">
                <Link className={`collection-chip ${!activeCategory ? "active" : ""}`} to="/collections">
                  All
                </Link>
                {CATEGORY_OPTIONS.map((option) => (
                  <Link
                    className={`collection-chip ${activeCategory?.name === option.name ? "active" : ""}`}
                    key={option.name}
                    to={`/collections/${categoryToSlug(option.name)}`}
                  >
                    {option.name}
                  </Link>
                ))}
              </div>
              <input
                className="collection-search-input"
                type="search"
                placeholder="Search pieces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="discovery-panel">
              <label className="discovery-field">
                <span className="discovery-label">Fabric / Type</span>
                <select
                  className="discovery-select"
                  value={assortmentFilter}
                  onChange={(e) => setAssortmentFilter(e.target.value)}
                >
                  <option value="all">All fabrics and types</option>
                  {assortmentOptions.map((option) => (
                    <option key={option.label} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="discovery-field">
                <span className="discovery-label">Design Style</span>
                <select
                  className="discovery-select"
                  value={designFilter}
                  onChange={(e) => setDesignFilter(e.target.value)}
                >
                  <option value="all">Plain, printed, or all</option>
                  {designOptions.map((option) => (
                    <option key={option.label} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="discovery-field">
                <span className="discovery-label">Arrange</span>
                <select
                  className="discovery-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price low to high</option>
                  <option value="price-high">Price high to low</option>
                </select>
              </label>

              <button className="clear-filters" type="button" onClick={clearFilters} disabled={!hasFilters}>
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className="products-store-section">
          {loading ? (
            <p className="collection-empty">Loading the collection...</p>
          ) : visibleProducts.length === 0 ? (
            <p className="collection-empty">No published pieces in this collection yet.</p>
          ) : (
            <>
              <div className="collection-results-bar">
                <span>
                  Showing <strong>{visibleProducts.length}</strong> of <strong>{baseProducts.length}</strong> pieces
                </span>
                <span className="collection-results-note">
                  {activeCategory ? activeCategory.name : "All Collections"}
                </span>
              </div>
              <div className="products-store-grid">
                {visibleProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </section>
      </StoreLayout>
    </>
  );
}

export default CollectionsStorePage;
