import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { CATEGORY_OPTIONS, categoryMatches } from "../data/catalogueOptions";
import { API_BASE_URL } from "../utils/storefront";

function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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

    fetchProducts();
  }, []);

  const categoryStats = useMemo(
    () =>
      CATEGORY_OPTIONS.map((category) => {
        const categoryProducts = products.filter((product) => categoryMatches(product, category));
        const publishedCount = categoryProducts.filter((product) => product.isPublished).length;

        return {
          ...category,
          totalCount: categoryProducts.length,
          publishedCount,
          hiddenCount: categoryProducts.length - publishedCount,
        };
      }),
    [products]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        .category-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
          text-align: left;
        }

        .category-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .category-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 400;
          line-height: 1;
          color: #1a0a2e;
          margin: 0 0 10px;
        }

        .category-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.45);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .category-card {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
          overflow: hidden;
        }

        .category-card-top {
          height: 3px;
          background: linear-gradient(90deg, #2d1155, #c9a84c, #e8c96e);
        }

        .category-card-body {
          padding: 24px;
          text-align: left;
        }

        .category-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 25px;
          font-weight: 500;
          color: #1a0a2e;
          line-height: 1.15;
          margin: 0 0 16px;
        }

        .category-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 22px;
        }

        .category-stat {
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 6px;
          padding: 12px;
          background: rgba(201, 168, 76, 0.035);
        }

        .category-stat-value {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          color: #2d1155;
          line-height: 1;
        }

        .category-stat-label {
          display: block;
          margin-top: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.42);
        }

        .collection-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .collection-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 0;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
        }

        .collection-name {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.72);
        }

        .collection-meta {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a84c;
          white-space: nowrap;
        }

        .category-empty {
          padding: 16px 0 0;
          border-top: 1px solid rgba(201, 168, 76, 0.12);
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 18px;
          color: rgba(45, 17, 85, 0.35);
        }
      `}</style>

      <AdminLayout>
        <div>
          <div className="category-header">
            <p className="category-eyebrow">Catalogue Structure</p>
            <h1 className="category-title">Collections</h1>
            <p className="category-subtitle">
              Luxury navigation groups for product browsing and admin organization.
            </p>
          </div>

          <div className="category-grid">
            {categoryStats.map((category) => (
              <div className="category-card" key={category.name}>
                <div className="category-card-top" />
                <div className="category-card-body">
                  <h2 className="category-name">{category.name}</h2>

                  <div className="category-stats">
                    <div className="category-stat">
                      <span className="category-stat-value">{loading ? "-" : category.totalCount}</span>
                      <span className="category-stat-label">Total</span>
                    </div>
                    <div className="category-stat">
                      <span className="category-stat-value">{loading ? "-" : category.publishedCount}</span>
                      <span className="category-stat-label">Live</span>
                    </div>
                    <div className="category-stat">
                      <span className="category-stat-value">{loading ? "-" : category.hiddenCount}</span>
                      <span className="category-stat-label">Hidden</span>
                    </div>
                  </div>

                  {category.subcategories.length > 0 ? (
                    <div className="collection-list">
                      {category.subcategories.map((collection) => {
                        const count = products.filter(
                          (product) =>
                            categoryMatches(product, category) &&
                            product.subcategory === collection.name
                        ).length;
                        return (
                          <div className="collection-row" key={collection.name}>
                            <span className="collection-name">
                              {collection.format ? `${collection.name} (${collection.format})` : collection.name}
                            </span>
                            <span className="collection-meta">
                              {collection.designs.length > 0 && `${collection.designs.join(" / ")} | `}
                              {count} item{count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="category-empty">Single collection group</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export default CategoriesPage;
