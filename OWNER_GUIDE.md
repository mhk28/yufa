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

## Shipping

Checkout supports two launch-ready shipping options:

- Local delivery: $5
- Self-collection / Pickup: $0

Local delivery becomes free when the order subtotal is $100 or above.

The system stores the selected shipping method on the order and charges the delivery fee through Stripe. Actual delivery fulfilment is handled manually by the admin after reviewing the order details.

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

Customers pay through Stripe's secure hosted checkout page. Cards and wallet details are entered on Stripe, not directly on the Yufa website.

The checkout page displays the accepted methods, then sends customers to Stripe when they press `Pay Now`. Stripe will show the methods that are available for that customer, device, browser, and checkout amount.

Supported through Stripe when eligible:

- Visa / Mastercard
- PayNow
- Apple Pay
- Google Pay

These are not separate custom Yufa payment buttons. Stripe handles the payment screen and confirms successful payments through the webhook.

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
