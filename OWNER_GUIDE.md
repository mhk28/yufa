# Yufa Collections Owner Guide

This guide is for day-to-day use of the Yufa Collections website.

## Admin Login

1. Go to `/admin/login`.
2. Enter the admin email and password.
3. After logging in, use the sidebar to manage products, showcase slides, orders, customers, and dashboard.

## Adding A Product

1. Go to `Admin > Products`.
2. Click `Add Product`.
3. Fill in the product name, description, category, fabric/type, design, pricing, and product details.
4. Upload product image(s).
5. Choose whether the product is published.
6. Tick `Show on homepage showcase` only if the product should appear in the homepage slideshow.
7. Save the product.

Important: a product only appears publicly if it is published.

## Homepage Showcase

Products can appear in the homepage showcase when both conditions are met:

1. The product is published.
2. `Show on homepage showcase` is enabled.

The showcase can also be managed from `Admin > Showcase`.

If a product is removed from showcase in the product page, it also stops showing in the showcase page. If the product is deleted, it is removed from the storefront and showcase together.

## Orders

1. Go to `Admin > Orders`.
2. Open an order to see customer details, order items, payment status, and order status.
3. Update the order status as the order moves through fulfilment.

Payment status is updated automatically when Stripe confirms payment through the webhook.

## Customers

Go to `Admin > Customers` to view customer accounts and order activity.

## Emails

Order emails are sent through Resend.

Emails are triggered when:

1. A Stripe payment is confirmed by the webhook.
2. A non-Stripe/manual order is created.

Customer emails go to the checkout email address. Admin notifications go to admin accounts in the database, with the business enquiry email used for replies.

## Payments

Stripe Checkout is the active payment route.

Customers pay through Stripe's secure hosted checkout page. Cards are entered on Stripe, not directly on the Yufa website.

PayNow and Apple Pay are not enabled as standalone payment methods yet. They can be added later after the business confirms the preferred payment flow.

## Media Uploads

Product images, gallery images, and showcase media are stored in Cloudinary.

If a product image does not appear, check:

1. The product has an uploaded image.
2. The product is published.
3. Cloudinary credentials are active in the backend environment.

## Recommended Routine

Before announcing a new product:

1. Add the product.
2. Upload clean portrait or square images.
3. Set the correct category and details.
4. Publish it.
5. Enable showcase only if it should appear on the homepage.
6. Check the public collections page on mobile.

