import { useEffect, useRef, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL, getImageUrl } from "../utils/storefront";

function ShowcasePage() {
  const fileRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [order, setOrder] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSlideId, setSavingSlideId] = useState("");
  const [error, setError] = useState("");

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/showcase/admin`, {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load showcase slides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setOrder("");
    setMedia(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("order", order);
      if (media) formData.append("media", media);

      const response = await fetch(`${API_BASE_URL}/showcase`, {
        method: "POST",
        headers: { Authorization: token },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save slide.");

      resetForm();
      fetchSlides();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSlide = async (id) => {
    if (!window.confirm("Delete this showcase slide?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/showcase/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      fetchSlides();
    } catch (err) {
      setError("Unable to delete slide.");
    }
  };

  const removeSlide = async (slide) => {
    if (slide.sourceType === "product") {
      if (!window.confirm("Remove this product from the homepage showcase?")) return;

      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/showcase/product/${slide.productId}`, {
          method: "DELETE",
          headers: { Authorization: token },
        });
        fetchSlides();
      } catch (err) {
        setError("Unable to remove product showcase.");
      }
      return;
    }

    deleteSlide(slide._id);
  };

  const updateSlideField = (slideId, field, value) => {
    setSlides((currentSlides) =>
      currentSlides.map((slide) =>
        slide._id === slideId ? { ...slide, [field]: value } : slide
      )
    );
  };

  const saveSlide = async (slide) => {
    setSavingSlideId(slide._id);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (slide.sourceType === "product") {
        const response = await fetch(`${API_BASE_URL}/showcase/product/${slide.productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            title: slide.title,
            subtitle: slide.subtitle,
            order: slide.order,
            isShowcased: true,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to save product showcase.");
      } else {
        const formData = new FormData();
        formData.append("title", slide.title || "");
        formData.append("subtitle", slide.subtitle || "");
        formData.append("order", slide.order || 0);
        formData.append("isActive", slide.isActive);

        const response = await fetch(`${API_BASE_URL}/showcase/${slide._id}`, {
          method: "PUT",
          headers: { Authorization: token },
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to save showcase slide.");
      }

      fetchSlides();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingSlideId("");
    }
  };

  return (
    <>
      <style>{`
        .showcase-header {
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(201, 168, 76, 0.2);
          text-align: left;
        }

        .showcase-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 10px;
        }

        .showcase-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          margin: 0 0 10px;
          color: #1a0a2e;
        }

        .showcase-copy {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          color: rgba(45, 17, 85, 0.48);
        }

        .showcase-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 20px;
          align-items: start;
        }

        .showcase-panel,
        .slide-card {
          background: #fff;
          border: 1px solid rgba(201, 168, 76, 0.16);
          border-radius: 8px;
        }

        .showcase-panel {
          padding: 24px;
          text-align: left;
        }

        .showcase-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .showcase-label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(45, 17, 85, 0.55);
        }

        .showcase-input {
          padding: 13px 14px;
          border: 1px solid rgba(201, 168, 76, 0.24);
          background: #fdfcfb;
          color: #1a0a2e;
          font-family: 'Jost', sans-serif;
          font-size: 14px;
        }

        .showcase-button {
          min-height: 46px;
          border: none;
          background: #2d1155;
          color: #e8c96e;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .showcase-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .showcase-error {
          padding: 12px 14px;
          border: 1px solid rgba(192, 57, 43, 0.18);
          background: rgba(192, 57, 43, 0.06);
          color: #c0392b;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
        }

        .slides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 16px;
        }

        .slide-card {
          overflow: hidden;
        }

        .slide-media {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          display: block;
          background: #efe7df;
        }

        .slide-body {
          padding: 16px;
          text-align: left;
        }

        .slide-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #1a0a2e;
          margin: 0 0 6px;
        }

        .slide-meta {
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          color: rgba(45, 17, 85, 0.5);
          margin-bottom: 14px;
        }

        .slide-source {
          display: inline-flex;
          margin-bottom: 10px;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(201, 168, 76, 0.1);
          color: #9c7a1e;
          font-family: 'Jost', sans-serif;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .slide-edit-grid {
          display: grid;
          gap: 8px;
          margin-bottom: 12px;
        }

        .slide-input {
          width: 100%;
          padding: 10px 11px;
          border: 1px solid rgba(201, 168, 76, 0.2);
          background: #fdfcfb;
          color: #1a0a2e;
          font-family: 'Jost', sans-serif;
          font-size: 12px;
        }

        .slide-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .slide-delete,
        .slide-save {
          padding: 9px 12px;
          background: transparent;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .slide-delete {
          border: 1px solid rgba(192, 57, 43, 0.25);
          color: #c0392b;
        }

        .slide-save {
          border: 1px solid rgba(45, 17, 85, 0.22);
          color: #2d1155;
        }

        @media (max-width: 980px) {
          .showcase-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .showcase-header {
            margin-bottom: 18px;
            padding-bottom: 18px;
          }

          .showcase-title {
            font-size: 32px;
          }

          .showcase-panel {
            padding: 16px;
          }

          .showcase-form {
            gap: 12px;
          }

          .showcase-input {
            min-height: 40px;
            padding: 10px 11px;
          }

          .slides-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .slide-media {
            aspect-ratio: 1 / 1.12;
          }

          .slide-body {
            padding: 11px;
          }

          .slide-title {
            font-size: 18px;
            line-height: 1.05;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .slide-meta,
          .slide-input {
            font-size: 10px;
          }

          .slide-source {
            font-size: 7px;
            letter-spacing: 0.08em;
          }

          .slide-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .slide-delete,
          .slide-save {
            min-height: 32px;
            padding: 7px 6px;
            font-size: 8px;
            letter-spacing: 0.08em;
          }
        }

        @media (max-width: 350px) {
          .slides-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <AdminLayout>
        <div>
          <div className="showcase-header">
            <p className="showcase-eyebrow">Storefront</p>
            <h1 className="showcase-title">Homepage Showcase</h1>
            <p className="showcase-copy">Upload images or videos for the hero slideshow. Videos autoplay and advance when finished.</p>
          </div>

          <div className="showcase-grid">
            <div className="showcase-panel">
              <form className="showcase-form" onSubmit={handleSubmit}>
                <label className="showcase-label">
                  Title
                  <input className="showcase-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label className="showcase-label">
                  Subtitle
                  <input className="showcase-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                </label>
                <label className="showcase-label">
                  Sort Order
                  <input className="showcase-input" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
                </label>
                <label className="showcase-label">
                  Image or Video
                  <input
                    ref={fileRef}
                    className="showcase-input"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                    required
                  />
                </label>
                {error && <div className="showcase-error">{error}</div>}
                <button className="showcase-button" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Add Showcase Slide"}
                </button>
              </form>
            </div>

            <div className="slides-grid">
              {loading ? (
                <p className="showcase-copy">Loading slides...</p>
              ) : (
                slides.map((slide) => (
                  <div className="slide-card" key={slide._id}>
                    {slide.mediaType === "video" && slide.mediaUrl ? (
                      <video className="slide-media" src={getImageUrl(slide.mediaUrl)} muted playsInline />
                    ) : slide.mediaUrl ? (
                      <img className="slide-media" src={getImageUrl(slide.mediaUrl)} alt={slide.title || "Showcase"} />
                    ) : (
                      <div className="slide-media" />
                    )}
                    <div className="slide-body">
                      <span className="slide-source">
                        {slide.sourceType === "product" ? "Product Showcase" : "Uploaded Slide"}
                      </span>
                      <h2 className="slide-title">{slide.title || "Untitled slide"}</h2>
                      <p className="slide-meta">
                        {slide.mediaType} | order {slide.order}
                        {slide.sourceType === "product" && !slide.isActive ? " | hidden until published" : ""}
                      </p>
                      <div className="slide-edit-grid">
                        <input
                          className="slide-input"
                          value={slide.title || ""}
                          placeholder="Title"
                          onChange={(e) => updateSlideField(slide._id, "title", e.target.value)}
                        />
                        <input
                          className="slide-input"
                          value={slide.subtitle || ""}
                          placeholder="Subtitle"
                          onChange={(e) => updateSlideField(slide._id, "subtitle", e.target.value)}
                        />
                        <input
                          className="slide-input"
                          type="number"
                          value={slide.order || 0}
                          placeholder="Sort order"
                          onChange={(e) => updateSlideField(slide._id, "order", e.target.value)}
                        />
                      </div>
                      <div className="slide-actions">
                        <button className="slide-save" type="button" onClick={() => saveSlide(slide)}>
                          {savingSlideId === slide._id ? "Saving..." : "Save"}
                        </button>
                        <button className="slide-delete" type="button" onClick={() => removeSlide(slide)}>
                          {slide.sourceType === "product" ? "Remove Showcase" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export default ShowcasePage;
