import { getImageUrl } from "../utils/storefront";

export default function VariantEditor({ variants, setVariants, images, basePrice }) {
  const update = (index, field, value) => setVariants(rows => rows.map((row, i) => i === index ? { ...row, [field]: value } : row));
  return <section className="variant-panel">
    <div className="variant-header"><h3>Design codes & sizes</h3><button type="button" className="btn-small" onClick={() => setVariants(rows => [...rows, { designCode: "", size: "", price: basePrice || "", stock: 0, sku: "", image: "" }])}>Add design code / size</button></div>
    <p>Keep the cutting and pattern on the product. Add each selectable design code (for example CS123) here, with its price, stock and matching product photo. Add another row if the same code comes in different sizes. Stock of zero means sold out.</p>
    {variants.map((row, index) => {
      const selectedImage = row.imageIndex !== undefined && row.imageIndex !== "" ? images[Number(row.imageIndex)]?.src : row.image ? getImageUrl(row.image) : "";
      return <fieldset key={row._id || index} style={{ margin: "16px 0", padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <legend>Option {index + 1}{row.designCode ? ` · ${row.designCode}` : ""}</legend>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {["designCode", "size", "price", "stock", "sku"].map(field => <label key={field} style={{ display: "grid", gap: 6 }}>
            {({designCode: "Design code (e.g. CS123)", size: "Size (optional)", type: "Type (optional)", design: "Design (optional)", price: "Price (SGD)", stock: "Stock", sku: "SKU (optional)"})[field]}
            <input className="field-input" required={field === "designCode" || field === "price" || field === "stock"} type={field === "price" || field === "stock" ? "number" : "text"} min={field === "price" ? "0.01" : field === "stock" ? "0" : undefined} step={field === "price" ? "0.01" : field === "stock" ? "1" : undefined} value={row[field] ?? ""} onChange={event => update(index, field, event.target.value)} />
          </label>)}
          <label>Design photo<select required={!row.image} className="field-input" value={row.imageIndex ?? ""} onChange={event => { update(index, "imageIndex", event.target.value); update(index, "image", ""); }}><option value="">{row.image ? "Current design photo" : "Choose a matching photo"}</option>{images.map((image, i) => <option key={i} value={i}>Photo {i + 1}</option>)}</select></label>
          {selectedImage && <img src={selectedImage} alt={`${row.designCode || "Option"} preview`} style={{ width: 90, height: 90, objectFit: "cover" }} />}
        </div>
        <button type="button" className="btn-small" onClick={() => setVariants(rows => rows.filter((_, i) => i !== index))}>Remove option</button>
      </fieldset>;
    })}
  </section>;
}
