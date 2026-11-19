const test = require('node:test');
const assert = require('node:assert/strict');
const Product = require('../models/Product');
const resolve = require('../utils/checkoutItems');
const variant = { _id: 'blue-small', designCode: 'CS123', size: 'S', price: 25, stock: 3, image: '/blue.jpg' };
Product.findById = async () => ({ _id: 'dress', isPublished: true, name: 'Dress', image: '/main.jpg', variants: { length: 1, id: id => id === variant._id ? variant : null } });
test('checkout uses persisted design, image and price instead of browser values', async () => {
  const result = await resolve([{ productId: 'dress', variantKey: 'blue-small', price: 1, designCode: 'FAKE', quantity: 2 }]);
  assert.equal(result.subtotal, 50);
  assert.equal(result.items[0].designCode, 'CS123');
  assert.equal(result.items[0].image, '/blue.jpg');
  assert.match(result.items[0].variantLabel, /Design code: CS123/);
});
test('checkout rejects removed options and invalid quantities', async () => {
  await assert.rejects(resolve([{ productId: 'dress', variantKey: 'removed', quantity: 1 }]), /select an available/);
  await assert.rejects(resolve([{ productId: 'dress', variantKey: 'blue-small', quantity: 1.5 }]), /quantity/);
});
test('combined quantities cannot exceed design stock', async () => {
  await assert.rejects(resolve([{ productId: 'dress', variantKey: 'blue-small', quantity: 2 }, { productId: 'dress', variantKey: 'blue-small', quantity: 2 }]), /stock/);
});
