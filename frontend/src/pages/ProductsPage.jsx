import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  CATEGORY_OPTIONS,
  categoryMatches,
  getProductCollectionLabel,
} from "../data/catalogueOptions";
import { API_BASE_URL, getImageUrl } from "../utils/storefront";

function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [showcasingId, setShowcasingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeImageByProduct, setActiveImageByProduct] = useState({});

  useEffect(() => { fetchProducts(); }, []);

  const getProductGallery = (product) =>
    [...new Set([product.image, product.showcaseImage, ...(product.images || [])].filter(Boolean))];

  const changeProductImage = (product, direction) => {
    const gallery = getProductGallery(product);
    if (gallery.length <= 1) return;

    setActiveImageByProduct((current) => {
      const currentIndex = current[product._id] || 0;
      const nextIndex = (currentIndex + direction + gallery.length) % gallery.length;
      return { ...current, [product._id]: nextIndex };
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this product from the collection?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (product) => {
    setTogglingId(product._id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ isPublished: !product.isPublished }),
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setTogglingId(null);
    }
  };

  const toggleShowcase = async (product) => {
    setShowcasingId(product._id);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ isShowcased: !product.isShowcased }),
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setShowcasingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products
      .filter((product) => {
        const searchableText = [
          product.name,
          product.description,
          getProductCollectionLabel(product),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = !search || searchableText.includes(search);
        const selectedCategory = CATEGORY_OPTIONS.find((option) => option.name === categoryFilter);
        const matchesCategory =
          categoryFilter === "all" ||
          (selectedCategory ? categoryMatches(product, selectedCategory) : product.category === categoryFilter);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "published" && product.isPublished) ||
          (statusFilter === "hidden" && !product.isPublished);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortBy === "category") {
          return getProductCollectionLabel(a).localeCompare(getProductCollectionLabel(b));
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [categoryFilter, products, searchTerm, sortBy, statusFilter]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');

        .products-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
        }

        .products-title-area {
          text-align: left;
        }

        .products-eyebrow {
  font-family: 'Jost', sans-serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c9a84c;
  margin-bottom:10px;
  line-height: 1;
}

        .products-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 400;
          color: #1a0a2e;
          line-height: 1;
          margin: 0 0 10px;
          margin-left: -1px;
        }

        .products-count {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.4);
          letter-spacing: 0.08em;
          margin-top: 8px;
        }

        .btn-add-product {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #2d1155, #4a1d8a);
          color: #e8c96e;
          border: none;
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          text-decoration: none;
        }

        .btn-add-product:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45, 17, 85, 0.25);
        }

        .products-toolbar {
          display: grid;
          grid-template-columns: minmax(240px, 1.4fr) repeat(3, minmax(160px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        .toolbar-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          text-align: left;
        }

        .toolbar-label {
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.5);
        }

        .toolbar-input,
        .toolbar-select {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border: 1px solid rgba(201, 168, 76, 0.22);
          border-radius: 6px;
          background: #fff;
          color: #1a0a2e;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          outline: none;
          transition: all 0.2s ease;
        }

        .toolbar-select {
          appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, rgba(45, 17, 85, 0.45) 50%),
            linear-gradient(135deg, rgba(45, 17, 85, 0.45) 50%, transparent 50%);
          background-position:
            calc(100% - 18px) 50%,
            calc(100% - 13px) 50%;
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }

        .toolbar-input:focus,
        .toolbar-select:focus {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
        }

        .results-note {
          margin-bottom: 18px;
          text-align: left;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.42);
          letter-spacing: 0.04em;
        }

        .products-loading {
          text-align: center;
          padding: 80px 0;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 20px;
          color: rgba(45, 17, 85, 0.4);
        }

        .products-empty {
          text-align: center;
          padding: 80px 0;
          border: 1px dashed rgba(201, 168, 76, 0.3);
          border-radius: 12px;
          background: rgba(201, 168, 76, 0.03);
        }

        .products-empty p {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 22px;
          color: rgba(45, 17, 85, 0.35);
          margin-bottom: 16px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .product-image-wrapper {
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #f3efeb;
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

        .product-gallery-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid rgba(232, 201, 110, 0.5);
          background: rgba(26, 10, 46, 0.72);
          color: #f8e8ac;
          font-family: 'Jost', sans-serif;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.2s ease, background 0.2s ease;
        }

        .product-gallery-button:hover {
          background: rgba(45, 17, 85, 0.92);
        }

        .product-gallery-button.prev {
          left: 10px;
        }

        .product-gallery-button.next {
          right: 10px;
        }

        .product-image-wrapper:hover .product-gallery-button,
        .product-image-wrapper:focus-within .product-gallery-button {
          opacity: 1;
        }

        .product-gallery-count {
          position: absolute;
          right: 10px;
          bottom: 10px;
          padding: 5px 8px;
          border-radius: 999px;
          background: rgba(26, 10, 46, 0.68);
          color: #f8e8ac;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        .product-card {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.15);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(45, 17, 85, 0.1);
          border-color: rgba(201, 168, 76, 0.35);
        }

        .product-card-top {
          height: 4px;
          background: linear-gradient(90deg, #2d1155, #c9a84c, #2d1155);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-card-top {
          opacity: 1;
        }

        .product-card-body {
          padding: 24px;
        }

        .product-card-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 14px;
        }

        .product-card-status.published {
          background: rgba(39, 174, 96, 0.1);
          color: #27ae60;
          border: 1px solid rgba(39, 174, 96, 0.2);
        }

        .product-card-status.hidden {
          background: rgba(45, 17, 85, 0.06);
          color: rgba(45, 17, 85, 0.45);
          border: 1px solid rgba(45, 17, 85, 0.1);
        }

        .product-card-status.showcase {
          margin-left: 8px;
          background: rgba(201, 168, 76, 0.1);
          color: #9c7a1e;
          border: 1px solid rgba(201, 168, 76, 0.22);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .product-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: #1a0a2e;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .product-card-category {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 12px;
        }

        .product-card-desc {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: rgba(45, 17, 85, 0.55);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-card-divider {
          height: 1px;
          background: rgba(201, 168, 76, 0.12);
          margin: 20px 0;
        }

        .product-card-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .btn-action {
          min-height: 38px;
          padding: 10px 12px;
          border: 1px solid;
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-edit {
          background: transparent;
          color: #2d1155;
          border-color: rgba(45, 17, 85, 0.25);
        }

        .btn-edit:hover {
          background: #2d1155;
          color: #e8c96e;
          border-color: #2d1155;
        }

        .btn-publish {
          background: transparent;
          color: #27ae60;
          border-color: rgba(39, 174, 96, 0.3);
        }

        .btn-publish:hover {
          background: #27ae60;
          color: #fff;
        }

        .btn-hide {
          background: transparent;
          color: rgba(45, 17, 85, 0.45);
          border-color: rgba(45, 17, 85, 0.15);
        }

        .btn-hide:hover {
          background: rgba(45, 17, 85, 0.08);
        }

        .btn-delete {
          background: transparent;
          color: #c0392b;
          border-color: rgba(192, 57, 43, 0.25);
        }

        .btn-delete:hover {
          background: #c0392b;
          color: #fff;
        }

        .btn-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 1080px) {
          .products-toolbar {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
          .products-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
            margin-bottom: 22px;
            padding-bottom: 18px;
          }

          .products-title {
            font-size: 31px;
          }

          .btn-add-product {
            width: 100%;
            justify-content: center;
            min-height: 42px;
            padding: 10px 14px;
          }

          .products-toolbar {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
          }

          .toolbar-field:first-child {
            grid-column: 1 / -1;
          }

          .toolbar-label {
            font-size: 8px;
            letter-spacing: 0.14em;
          }

          .toolbar-input,
          .toolbar-select {
            height: 39px;
            padding: 0 10px;
            font-size: 12px;
          }

          .results-note {
            margin-bottom: 12px;
            font-size: 11px;
          }

          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .product-card {
            border-radius: 8px;
          }

          .product-image-wrapper {
            aspect-ratio: 1 / 1.12;
          }

          .product-gallery-button {
            width: 28px;
            height: 28px;
            font-size: 15px;
            opacity: 1;
          }

          .product-gallery-button.prev {
            left: 6px;
          }

          .product-gallery-button.next {
            right: 6px;
          }

          .product-gallery-count {
            right: 7px;
            bottom: 7px;
            padding: 4px 7px;
            font-size: 8px;
          }

          .product-card-body {
            padding: 11px;
          }

          .product-card-status {
            gap: 4px;
            padding: 3px 6px;
            font-size: 7px;
            letter-spacing: 0.08em;
            margin: 0 4px 8px 0;
          }

          .product-card-status.showcase {
            margin-left: 0;
          }

          .status-dot {
            width: 5px;
            height: 5px;
          }

          .product-card-name {
            font-size: 18px;
            line-height: 1.05;
            margin-bottom: 5px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .product-card-category {
            font-size: 8px;
            letter-spacing: 0.08em;
            line-height: 1.25;
            margin-bottom: 7px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .product-card-desc {
            display: none;
          }

          .product-card-divider {
            margin: 10px 0;
          }

          .product-card-actions {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
          }

          .btn-action {
            min-height: 32px;
            padding: 7px 4px;
            font-size: 8px;
            letter-spacing: 0.04em;
            border-radius: 5px;
          }
        }

        @media (max-width: 350px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <AdminLayout>
        <div>
          <div className="products-header">
            <div className="products-title-area">
              <p className="products-eyebrow">Manage</p>
              <h1 className="products-title">Collections</h1>
              {!loading && (
                <p className="products-count">
                  {products.length} product{products.length !== 1 ? "s" : ""} in catalogue
                </p>
              )}
            </div>
            <button
              className="btn-add-product"
              onClick={() => navigate("/admin/add-product")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Product
            </button>
          </div>

          {!loading && products.length > 0 && (
            <>
              <div className="products-toolbar">
                <div className="toolbar-field">
                  <label className="toolbar-label">Search</label>
                  <input
                    className="toolbar-input"
                    type="search"
                    placeholder="Search products, categories, descriptions"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="toolbar-field">
                  <label className="toolbar-label">Category</label>
                  <select
                    className="toolbar-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="toolbar-field">
                  <label className="toolbar-label">Status</label>
                  <select
                    className="toolbar-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div className="toolbar-field">
                  <label className="toolbar-label">Sort</label>
                  <select
                    className="toolbar-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Name A-Z</option>
                    <option value="category">Category A-Z</option>
                  </select>
                </div>
              </div>

              <p className="results-note">
                Showing {filteredProducts.length} of {products.length} product
                {products.length !== 1 ? "s" : ""}
              </p>
            </>
          )}

          {loading ? (
            <div className="products-loading">Loading collection…</div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <p>Your collection is empty</p>
              <button className="btn-add-product" onClick={() => navigate("/admin/add-product")}>
                Add Your First Product
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="products-empty">
              <p>No products match your filters</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const gallery = getProductGallery(product);
                const activeIndex = Math.min(activeImageByProduct[product._id] || 0, gallery.length - 1);

                return (
                  <div key={product._id} className="product-card">
                    <div className="product-card-top" />
                    {gallery.length > 0 && (
                      <div className="product-image-wrapper">
                        <img
                          src={getImageUrl(gallery[activeIndex])}
                          alt={product.name}
                          className="product-image"
                        />
                        {gallery.length > 1 && (
                          <>
                            <button
                              className="product-gallery-button prev"
                              type="button"
                              onClick={() => changeProductImage(product, -1)}
                              aria-label={`Previous image for ${product.name}`}
                            >
                              &lt;
                            </button>
                            <button
                              className="product-gallery-button next"
                              type="button"
                              onClick={() => changeProductImage(product, 1)}
                              aria-label={`Next image for ${product.name}`}
                            >
                              &gt;
                            </button>
                            <span className="product-gallery-count">
                              {activeIndex + 1}/{gallery.length}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  <div className="product-card-body">
                    <span className={`product-card-status ${product.isPublished ? "published" : "hidden"}`}>
                      <span className="status-dot" />
                      {product.isPublished ? "Published" : "Hidden"}
                    </span>
                    {product.isShowcased && (
                      <span className="product-card-status showcase">
                        <span className="status-dot" />
                        Showcase
                      </span>
                    )}
                    <h2 className="product-card-name">{product.name}</h2>
                    {product.category && (
                      <p className="product-card-category">
                        {getProductCollectionLabel(product)}
                      </p>
                    )}
                    {product.description && (
                      <p className="product-card-desc">{product.description}</p>
                    )}
                    <div className="product-card-divider" />
                    <div className="product-card-actions">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn-action ${product.isPublished ? "btn-hide" : "btn-publish"}`}
                        onClick={() => togglePublish(product)}
                        disabled={togglingId === product._id}
                      >
                        {togglingId === product._id ? "…" : product.isPublished ? "Hide" : "Publish"}
                      </button>
                      <button
                        className="btn-action btn-hide"
                        onClick={() => toggleShowcase(product)}
                        disabled={showcasingId === product._id}
                      >
                        {showcasingId === product._id ? "..." : product.isShowcased ? "Unshowcase" : "Showcase"}
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        title="Delete product"
                      >
                        {deletingId === product._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}

export default ProductsPage;
