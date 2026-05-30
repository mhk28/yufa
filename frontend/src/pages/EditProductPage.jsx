import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { CATEGORY_OPTIONS } from "../data/catalogueOptions";
import { API_BASE_URL, getImageUrl } from "../utils/storefront";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [design, setDesign] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [isShowcased, setIsShowcased] = useState(false);
  const [showcaseTitle, setShowcaseTitle] = useState("");
  const [showcaseSubtitle, setShowcaseSubtitle] = useState("");
  const [showcaseOrder, setShowcaseOrder] = useState("");
  const [variants, setVariants] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const selectedCategory = CATEGORY_OPTIONS.find((option) => option.name === category);
  const selectedSubcategory = selectedCategory?.subcategories.find(
    (option) => option.name === subcategory
  );
  const imagePreviewSrc = preview || getImageUrl(existingImage);

  useEffect(() => { fetchProduct(); }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const fetchProduct = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await response.json();
      setName(data.name || "");
      setDescription(data.description || "");
      setCategory(data.category || "");
      setSubcategory(data.subcategory || "");
      setDesign(data.design || "");
      setBasePrice(data.basePrice ?? data.price ?? "");
      setIsShowcased(Boolean(data.isShowcased));
      setShowcaseTitle(data.showcaseTitle || "");
      setShowcaseSubtitle(data.showcaseSubtitle || "");
      setShowcaseOrder(data.showcaseOrder ?? "");
      setVariants(data.variants || []);
      setExistingImage(data.image || "");
    } catch (err) {
      setError("Failed to load product.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeNewImage = () => {
    if (preview) URL.revokeObjectURL(preview);

    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubcategory("");
    setDesign("");
  };

  const handleSubcategoryChange = (e) => {
    setSubcategory(e.target.value);
    setDesign("");
  };

  const updateVariant = (index, field, value) => {
    setVariants((currentVariants) =>
      currentVariants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const addVariant = () => {
    setVariants((currentVariants) => [
      ...currentVariants,
      { type: "", color: "", size: "", price: "", stock: "", sku: "" },
    ]);
  };

  const removeVariant = (index) => {
    setVariants((currentVariants) =>
      currentVariants.filter((_, variantIndex) => variantIndex !== index)
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      formData.append("design", design);
      formData.append("basePrice", basePrice);
      formData.append("isShowcased", isShowcased);
      formData.append("showcaseTitle", showcaseTitle);
      formData.append("showcaseSubtitle", showcaseSubtitle);
      formData.append("showcaseOrder", showcaseOrder);
      formData.append(
        "variants",
        JSON.stringify(
          variants
            .filter((variant) => variant.price)
            .map((variant) => ({
              type: variant.type || "",
              color: variant.color || "",
              size: variant.size || "",
              sku: variant.sku || "",
              price: Number(variant.price) || 0,
              stock: Number(variant.stock) || 0,
            }))
        )
      );

      if (image) {
        formData.append("images", image);
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to update product.");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap');

        .form-page-header {
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(201, 168, 76, 0.2);
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 2px;
}

.inline-back {
  border: none;
  background: transparent;
  padding: 0;
  font-family: 'Jost', sans-serif;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(45, 17, 85, 0.45);
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
display: flex;
align-items: center;
}

.inline-back:hover {
  color: #2d1155;
}

.breadcrumb-divider {
  color: rgba(45, 17, 85, 0.25);
  font-size: 10px;
}

        .form-page-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0;
          line-height: 1;
          display: flex;
          align-items: center;
        }

        .form-page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 400;
          color: #1a0a2e;
          line-height: 1;
          margin: 6px 0 8px;
          letter-spacing: 0.01em;
        }

        .form-page-subtitle {
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(45, 17, 85, 0.45);
  margin-top: 2px;
  line-height: 1.7;
  letter-spacing: 0.02em;
}

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: transparent;
          color: rgba(45, 17, 85, 0.5);
          border: 1px solid rgba(45, 17, 85, 0.15);
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-top: 4px;
        }

        .btn-back:hover {
          border-color: rgba(45, 17, 85, 0.3);
          color: #2d1155;
        }

        .form-card {
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: #fff;
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: 12px;
  padding: 48px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.form-page-wrapper {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

        .form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c9a84c, #2d1155, #c9a84c);
        }

        .product-form { display: flex; flex-direction: column; gap: 32px; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group.full { grid-column: 1 / -1; }

        .field-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.55);
          font-weight: 500;
        }

        .field-input, .field-textarea, .field-select {
          padding: 14px 18px;
          border: 1px solid rgba(201, 168, 76, 0.25);
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          color: #1a0a2e;
          background: #fdfcfb;
          outline: none;
          transition: all 0.2s ease;
          width: 100%;
        }

        .field-select {
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

        .field-textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.6;
        }

        .field-input:focus, .field-textarea:focus, .field-select:focus {
          border-color: #c9a84c;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
        }

        .field-input::placeholder, .field-textarea::placeholder {
          color: rgba(45, 17, 85, 0.2);
        }

        .form-skeleton {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .skeleton-row { display: flex; gap: 20px; }

        .skeleton-block {
          height: 52px;
          background: linear-gradient(90deg, #f0ebe8, #e8e2de, #f0ebe8);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-block.tall { height: 120px; }
        .skeleton-block.half { flex: 1; }
        .skeleton-block.full { width: 100%; }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .form-error {
          background: rgba(220, 50, 50, 0.06);
          border: 1px solid rgba(220, 50, 50, 0.2);
          border-radius: 6px;
          padding: 12px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: #c0392b;
        }

        .form-success {
          background: rgba(39, 174, 96, 0.08);
          border: 1px solid rgba(39, 174, 96, 0.25);
          border-radius: 6px;
          padding: 12px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: #27ae60;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-actions { display: flex; gap: 12px; padding-top: 8px; }

        .btn-submit {
          padding: 15px 40px;
          background: linear-gradient(135deg, #2d1155, #4a1d8a);
          color: #e8c96e;
          border: none;
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45, 17, 85, 0.25);
        }

        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-cancel {
          padding: 15px 24px;
          background: transparent;
          color: rgba(45, 17, 85, 0.5);
          border: 1px solid rgba(45, 17, 85, 0.15);
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          border-color: rgba(45, 17, 85, 0.3);
          color: rgba(45, 17, 85, 0.7);
        }

        .char-count {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          color: rgba(45, 17, 85, 0.3);
          text-align: right;
          margin-top: 4px;
        }

        .image-field {
          gap: 14px;
        }

        .image-upload-shell {
          display: grid;
          grid-template-columns: minmax(180px, 240px) 1fr;
          gap: 20px;
          align-items: stretch;
        }

        .image-preview-panel,
        .image-upload-panel {
          min-height: 280px;
          border: 1px solid rgba(201, 168, 76, 0.25);
          border-radius: 8px;
          background: #fdfcfb;
        }

        .image-preview-panel {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 5;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .preview-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: rgba(45, 17, 85, 0.28);
          background:
            linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(45, 17, 85, 0.03));
        }

        .preview-empty svg {
          color: rgba(201, 168, 76, 0.72);
        }

        .preview-empty span {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-style: italic;
        }

        .image-upload-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          padding: 28px;
          border-style: dashed;
          text-align: left;
        }

        .image-upload-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #1a0a2e;
          line-height: 1.15;
          text-align: left;
        }

        .image-upload-copy {
          max-width: 420px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(45, 17, 85, 0.48);
          text-align: left;
        }

        .file-input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .image-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .btn-file,
        .btn-remove-image {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 12px 18px;
          border-radius: 6px;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-file {
          background: #2d1155;
          border: 1px solid #2d1155;
          color: #e8c96e;
        }

        .btn-file:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45, 17, 85, 0.18);
        }

        .btn-remove-image {
          background: transparent;
          border: 1px solid rgba(45, 17, 85, 0.15);
          color: rgba(45, 17, 85, 0.5);
        }

        .btn-remove-image:hover {
          border-color: rgba(192, 57, 43, 0.3);
          color: #c0392b;
        }

        .selected-file {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: rgba(45, 17, 85, 0.42);
        }

        .variant-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 22px;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
          background: rgba(201, 168, 76, 0.035);
        }

        .variant-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .variant-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          color: #1a0a2e;
        }

        .btn-small {
          padding: 10px 14px;
          border: 1px solid rgba(45, 17, 85, 0.18);
          border-radius: 6px;
          background: transparent;
          color: #2d1155;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .variant-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr) auto;
          gap: 10px;
          align-items: end;
        }

        .showcase-toggle-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 18px;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
          background: rgba(201, 168, 76, 0.035);
          text-align: left;
        }

        .showcase-toggle-text {
          flex: 1;
          min-width: 0;
          text-align: left;
        }

        .showcase-checkbox {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          accent-color: #2d1155;
        }

        .showcase-toggle-title {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 23px;
          color: #1a0a2e;
          margin: 0 0 4px;
        }

        .showcase-toggle-copy {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          line-height: 1.7;
          color: rgba(45, 17, 85, 0.52);
          margin: 0;
        }

        @media (max-width: 720px) {
          .form-card {
            padding: 32px 24px;
          }

          .form-row,
          .image-upload-shell {
            grid-template-columns: 1fr;
          }

          .image-preview-panel {
            min-height: 320px;
          }

          .variant-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <AdminLayout>
        <div className="form-page-wrapper">
          <div className="form-page-header">
            <div>
              <div className="header-breadcrumb">
                <button
                  className="inline-back"
                  onClick={() =>
                    navigate("/admin/products")
                  }
                >
                  ← Back
                </button>

                <span className="breadcrumb-divider">
                  /
                </span>

                <p className="form-page-eyebrow">
                  Catalogue
                </p>
              </div>
              <h1 className="form-page-title">Edit Product</h1>
              {name && (
                <p className="form-page-subtitle">Refine and update your collection piece</p>
              )}
            </div>
          </div>

          <div className="form-card">
            {fetchLoading ? (
              <div className="form-skeleton">
                <div className="skeleton-row">
                  <div className="skeleton-block half" />
                  <div className="skeleton-block half" />
                </div>
                <div className="skeleton-block tall full" />
              </div>
            ) : (
              <form className="product-form" onSubmit={handleUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="field-label">Product Name</label>
                    <input
                      className="field-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Category</label>
                    <select
                      className="field-select"
                      value={category}
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedCategory?.subcategories.length > 0 && (
                  <div className="form-row">
                    <div className={`form-group ${selectedSubcategory?.designs.length > 0 ? "" : "full"}`}>
                      <label className="field-label">Assortment</label>
                      <select
                        className="field-select"
                        value={subcategory}
                        onChange={handleSubcategoryChange}
                      >
                        <option value="">Select assortment</option>
                        {selectedCategory.subcategories.map((option) => (
                          <option key={option.name} value={option.name}>
                            {option.format ? `${option.name} (${option.format})` : option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedSubcategory?.designs.length > 0 && (
                      <div className="form-group">
                        <label className="field-label">Design</label>
                        <select
                          className="field-select"
                          value={design}
                          onChange={(e) => setDesign(e.target.value)}
                        >
                          <option value="">Select design</option>
                          {selectedSubcategory.designs.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group full">
                    <label className="field-label">Base Price (SGD)</label>
                    <input
                      className="field-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group full">
                  <div className="variant-panel">
                    <div className="variant-header">
                      <p className="variant-title">Variants</p>
                      <button className="btn-small" type="button" onClick={addVariant}>
                        Add Variant
                      </button>
                    </div>

                    {variants.map((variant, index) => (
                      <div className="variant-row" key={variant._id || index}>
                        {["type", "color", "size", "price", "stock", "sku"].map((field) => (
                          <input
                            key={field}
                            className="field-input"
                            type={field === "price" || field === "stock" ? "number" : "text"}
                            min={field === "price" || field === "stock" ? "0" : undefined}
                            step={field === "price" ? "0.01" : undefined}
                            placeholder={field}
                            value={variant[field] || ""}
                            onChange={(e) => updateVariant(index, field, e.target.value)}
                          />
                        ))}
                        <button className="btn-small" type="button" onClick={() => removeVariant(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group full image-field">
                  <label className="field-label">Product Image</label>

                  <div className="image-upload-shell">
                    <div className="image-preview-panel">
                      {imagePreviewSrc ? (
                        <img
                          src={imagePreviewSrc}
                          alt="Product preview"
                          className="preview-image"
                        />
                      ) : (
                        <div className="preview-empty">
                          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                          <span>No image selected</span>
                        </div>
                      )}
                    </div>

                    <div className="image-upload-panel">
                      <div>
                        <p className="image-upload-title">Update product image</p>
                        <p className="image-upload-copy">
                          Replace the current image with a clear portrait or square photo for a consistent grid crop.
                        </p>
                      </div>

                      <div className="image-actions">
                        <label className="btn-file" htmlFor="edit-product-image">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          {imagePreviewSrc ? "Change Image" : "Upload Image"}
                        </label>

                        {image && (
                          <button
                            className="btn-remove-image"
                            type="button"
                            onClick={removeNewImage}
                          >
                            Undo
                          </button>
                        )}
                      </div>

                      {image && (
                        <p className="selected-file">{image.name}</p>
                      )}

                      <input
                        id="edit-product-image"
                        ref={fileInputRef}
                        className="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group full">
                  <label className="field-label">Description</label>
                  <textarea
                    className="field-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="char-count">{description.length} characters</p>
                </div>

                <div className="form-group full">
                  <label className="showcase-toggle-row">
                    <input
                      className="showcase-checkbox"
                      type="checkbox"
                      checked={isShowcased}
                      onChange={(e) => setIsShowcased(e.target.checked)}
                    />
                    <span className="showcase-toggle-text">
                      <span className="showcase-toggle-title">Show on homepage showcase</span>
                      <span className="showcase-toggle-copy">
                        This product appears in the homepage slideshow only while published and while it has an image.
                      </span>
                    </span>
                  </label>
                </div>

                {isShowcased && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="field-label">Showcase Title</label>
                      <input
                        className="field-input"
                        value={showcaseTitle}
                        placeholder="Defaults to product name"
                        onChange={(e) => setShowcaseTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="field-label">Showcase Order</label>
                      <input
                        className="field-input"
                        type="number"
                        value={showcaseOrder}
                        placeholder="e.g. 10"
                        onChange={(e) => setShowcaseOrder(e.target.value)}
                      />
                    </div>
                    <div className="form-group full">
                      <label className="field-label">Showcase Subtitle</label>
                      <input
                        className="field-input"
                        value={showcaseSubtitle}
                        placeholder="Defaults to product description"
                        onChange={(e) => setShowcaseSubtitle(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {error && <div className="form-error">{error}</div>}
                {success && (
                  <div className="form-success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Product updated! Redirecting…
                  </div>
                )}

                <div className="form-actions">
                  <button className="btn-submit" type="submit" disabled={loading || success}>
                    {loading ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    className="btn-cancel"
                    type="button"
                    onClick={() => navigate("/admin/products")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export default EditProductPage;
