const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeVariants, getVariantLabel } = require("./designVariants");
const row = { _id: "persisted-option", designCode: " CS123 ", price: 25, stock: 3, imageIndex: 1 };
const photos = ["/main.jpg", "/cs123.jpg"];
test("design code saves with its assigned photo and stable option ID", () => {
  const [saved] = normalizeVariants(JSON.stringify([row]), photos);
  assert.equal(saved.designCode, "CS123");
  assert.equal(saved.image, "/cs123.jpg");
  assert.equal(saved._id, row._id);
  assert.equal(getVariantLabel(saved), "Design code: CS123");
});
test("duplicate codes ignore case and spaces, but different sizes are allowed", () => {
  assert.throws(() => normalizeVariants([row, { ...row, designCode: "cs123" }], photos), /Duplicate/);
  assert.equal(normalizeVariants([{ ...row, size: "S" }, { ...row, size: "M" }], photos).length, 2);
});
test("requires design codes, valid stock, prices and matching photos", () => {
  for (const invalid of [{ designCode: "" }, { stock: -1 }, { stock: 1.5 }, { price: 0 }, { imageIndex: 99 }, { imageIndex: -1 }, { imageIndex: "", image: "/removed.jpg" }]) {
    assert.throws(() => normalizeVariants([{ ...row, ...invalid }], photos));
  }
  assert.throws(() => normalizeVariants("invalid JSON", photos), /Invalid/);
});
test("existing photos and legacy codes survive editing", () => {
  const [saved] = normalizeVariants([{ ...row, designCode: undefined, sku: "CS456", imageIndex: undefined, image: photos[1] }], photos);
  assert.equal(saved.designCode, "CS456");
  assert.equal(saved.image, photos[1]);
});
test("browser and server produce the same design labels", async () => {
  const { pathToFileURL } = require("node:url");
  const path = require("node:path");
  const frontend = await import(pathToFileURL(path.resolve(__dirname, "../../frontend/src/utils/variants.js")));
  for (const variant of [{ designCode: "CS123", size: "M" }, { sku: "CS456" }, { color: "legacy" }, {}]) {
    assert.equal(frontend.getVariantLabel(variant), getVariantLabel(variant));
  }
});
