import { getImageUrl } from "../utils/storefront";
import "./VariantEditor.css";

const fields = [
  { name: "designCode", label: "Design code", placeholder: "e.g. CS123", required: true },
  { name: "size", label: "Size", placeholder: "e.g. Free size or M", optional: true },
  { name: "price", label: "Price · SGD", placeholder: "0.00", type: "number", min: "0.01", step: "0.01", required: true },
  { name: "stock", label: "Available stock", placeholder: "0", type: "number", min: "0", step: "1", required: true },
  { name: "sku", label: "Inventory SKU", placeholder: "Your internal reference", optional: true },
];

export default function VariantEditor({ variants, setVariants, images, basePrice }) {
  const update = (index, changes) => setVariants(rows => rows.map((row, i) => i === index ? { ...row, ...changes } : row));
  const addOption = () => setVariants(rows => [...rows, { designCode: "", size: "", price: basePrice || "", stock: 0, sku: "", image: "" }]);

  return <section className="design-editor" aria-label="Product design options">
    <header className="design-editor-heading">
      <div><span className="design-editor-eyebrow">The details that make it yours</span><h3>Design options</h3></div>
      <span className="design-editor-count">{variants.length} {variants.length === 1 ? "option" : "options"}</span>
    </header>
    <p className="design-editor-intro">One product, a collection of designs. Add a code and matching photo for each design shoppers can choose.</p>
    {variants.length === 0 && <div className="design-editor-empty">
      <span className="design-editor-empty-mark" aria-hidden="true">＋</span>
      <h4>A place for every design</h4>
      <p>Add your first code, such as CS123. For a product with no selectable designs, leave this section empty.</p>
    </div>}
    <div className="design-editor-list">
      {variants.map((row, index) => {
        const selectedImage = row.imageIndex !== undefined && row.imageIndex !== "" ? images[Number(row.imageIndex)]?.src : row.image ? getImageUrl(row.image) : "";
        return <fieldset className="design-editor-card" key={row._id || index}>
          <legend className="design-editor-sr">Design option {index + 1}</legend>
          <div className="design-editor-card-heading">
            <div className="design-editor-identity"><span className="design-editor-number">{String(index + 1).padStart(2, "0")}</span><div><h4>{row.designCode || "New design"}</h4><span>{row.size || "No size selected"}</span></div></div>
            <button type="button" className="design-editor-remove" aria-label={`Remove design ${row.designCode || index + 1}`} onClick={() => setVariants(rows => rows.filter((_, i) => i !== index))}>Remove <span aria-hidden="true">×</span></button>
          </div>
          <div className="design-editor-card-body">
            <div className="design-editor-photo">
              <div className="design-editor-preview">{selectedImage ? <img src={selectedImage} alt={`${row.designCode || "Design"} preview`} /> : <div><span aria-hidden="true">▧</span><p>Your design photo</p></div>}</div>
              <span className="design-editor-photo-caption">{selectedImage ? "Shown when this design is selected" : "Upload photos below, then assign one here"}</span>
            </div>
            <div className="design-editor-fields">
              {fields.map(field => <label className={`design-editor-field design-editor-field-${field.name}`} key={field.name}>
                <span>{field.label}{field.optional && <small>Optional</small>}</span>
                <input required={field.required} type={field.type || "text"} min={field.min} step={field.step} placeholder={field.placeholder} value={row[field.name] ?? ""} onWheel={field.type === "number" ? event => event.currentTarget.blur() : undefined} onChange={event => update(index, { [field.name]: event.target.value })} />
              </label>)}
              <label className="design-editor-field design-editor-field-photo"><span>Design photo</span>
                <select required={!row.image} value={row.imageIndex ?? ""} onChange={event => update(index, { imageIndex: event.target.value, image: "" })}>
                  <option value="">{row.image ? "Keep current photo" : "Select a product photo"}</option>
                  {images.map((_, i) => <option key={i} value={i}>Photo {i + 1}</option>)}
                </select>
              </label>
              {images.length > 0 && <div className="design-editor-photo-picker" role="group" aria-label={`Photo for design ${row.designCode || index + 1}`}>
                {images.map((photo, i) => <button type="button" key={i} aria-label={`Choose photo ${i + 1}`} aria-pressed={selectedImage === photo.src} onClick={() => update(index, { imageIndex: i, image: "" })}><img src={photo.src} alt="" /><span>{i + 1}</span></button>)}
              </div>}
            </div>
          </div>
        </fieldset>;
      })}
    </div>
    <footer className="design-editor-footer">
      <button type="button" className="design-editor-add" onClick={addOption}><span aria-hidden="true">＋</span> Add design option</button>
      <p>Different sizes? Add a row for each code and size.<br />Stock of zero displays as sold out.</p>
    </footer>
  </section>;
}
