# Product Requirements Document (PRD)
## Project Name: pamlicious_bite E-Commerce Platform

---

## 1. Document Overview & Context
*   **Target Product:** A highly visual, modern, and interactive e-commerce web application for a premium pastry brand (**pamlicious_bite**).
*   **Target Audience:** Foodies, casual dessert lovers, and bulk event planners in Nigeria.
*   **Target Build Agent:** Front-End & Back-End Coding Agents / LLM Developers.
*   **Core Goal:** Maximize appetite appeal through rich micro-interactions, high-performance visual grids, an elegant side-cart, a frictionless checkout, and a robust vendor admin dashboard.

---

## 2. Technical Stack Recommendation (For Coding Agent)
*   **Frontend:** React.js / Next.js (for Server-Side Rendering & image optimization), Tailwind CSS (styling), Framer Motion (smooth animations).
*   **Backend/Database:** Node.js (Express) or Next.js App Router API endpoints, with PostgreSQL or MongoDB.
*   **State Management:** Zustand or Redux Toolkit for seamless shopping cart state.
*   **Payments:** Paystack API or Flutterwave API (Optimized for Nigeria).
*   **Media Storage:** Cloudinary or AWS S3 (Optimized for progressive WebP image loading).

---

## 3. Core System Architecture & Features

### 3.1 Client-Facing Storefront (Highly Interactive)

#### A. Homepage & Aesthetic Framework
*   **Hero Visuals:** Full-bleed, high-resolution header component featuring auto-playing ambient background video (muted, looping) of fresh pastries or a smooth cross-fading image slider.
*   **Color Scheme:** Premium pastry palette: Warm Pastel Pink (#FFF0F5), Rich Cream (#FFFDD0), Soft Charcoal for readable text (#2C2C2C), and Deep Crimson/Gold for Primary Interactive CTA buttons.
*   **Animations:** Implement subtle scroll-driven parallax effects. Page transitions must be fluid (300ms fade/slide transitions).

#### B. Dynamic Product Grid Page
*   **Image State Transformations:** 
    *   **Default State:** High-res photo of the pastry item.
    *   **Hover State:** Smooth transition to an alternate photo (e.g., cross-section view/crumb shot) + display of a clean floating overlay container.
*   **Contextual Status Badges:** Display absolute-positioned labels for specific item filters: `"Best Seller"`, `"Gluten-Free"`, `"Limited Stock"`.
*   **Instant Client-Side Filtering:** Clean tag-based navigation menu bar (Categories: *All, Cakes, Croissants, Savory, Box Deals*). Clicking a category filters items instantly via local state without full page updates.
*   **Quick-Add Action:** Hovering over a product card reveals an `[Add to Box +]` button. Clicking this triggers a localized particle splash animation and adds the item immediately to the mini-cart state.

#### C. Slide-Out Mini Cart (Interactive Drawer)
*   **UI Trigger:** Clicking the persistent Floating Cart Icon slides a drawer overlay out from the right edge of the viewport.
*   **Live AJAX Adjustments:**
    *   Include increment/decrement buttons (`+` / `-`) for item quantities.
    *   Cart subtotals must update reactively with smooth numeric rolling animations.
*   **Progressive Gamified Upsell Tracker:**
    *   A visual progress slider component indicating the margin remaining until free delivery thresholds are unlocked.
    *   *Logic:* If Subtotal < ₦15,000, display: `"Add ₦[15,000 - current_subtotal] more for Free Delivery!"` alongside a partially filled progress bar. At ≥ ₦15,000, color shifts to green displaying `"You've unlocked Free Delivery!  🎉"`.

#### D. Frictionless Checkout Flow
*   **Guest Checkout Mode:** Do not force registration. Require only Email, Phone, and Delivery Address.
*   **Fulfillment Scheduler Component:**
    *   An interactive calendar grid to select Delivery or In-store Pickup dates.
    *   *Validation Rule:* Disable past dates, current days after 2:00 PM, and Sundays.
    *   Drop-down time slot selection selector (*9:00 AM - 12:00 PM*, *12:00 PM - 4:00 PM*).
*   **Payment Gateway Interface:** Embedded Checkout widget via Paystack/Flutterwave supporting Debit Cards, USSD, and Bank Transfer flows.

---

### 3.2 Back-Office Admin Dashboard (Vendor Management)

#### A. Analytics Overview Screen (KPI Metrics)
*   **Data Cards:** Four high-level summary cards display real-time variables:
    1. Total Sales Today (₦)
    2. Total Active Pending Orders
    3. Low Stock Alerts (Pastries under 5 items left)
    4. Most Popular Pastry Variant of the Week
*   **Visual Charts:** Line chart representing monthly sales curves; Donut chart splitting sales by category.

#### B. Inventory & Product Management
*   **Dynamic Data Table:** Paginated matrix detailing all products, displaying: Thumbnail, Product Name, SKU, Category, Base Price (₦), Current Stock Count, and Status Switch (Active/Draft).
*   **CRUD Form Component (Add/Edit Pastry):**
    *   Text Inputs for Name, Price, and Description.
    *   Dropdown for Category Selector.
    *   Drag-and-Drop Image Uploader interface (auto-compressing files to WebP formats frontend side).
    *   Inventory Toggle: Numeric field for "Available Quantity". An explicit "Out of Stock" toggle switch that immediately flags a product card as disabled on the public frontend storefront when switched.

#### C. Order Processing & Operations Center
*   **Order Tracking Table:** Displays incoming orders by timestamps, showing: Order ID, Customer Name, Order Value (₦), Fulfillment Type (Delivery vs. Pickup), Fulfillment Date/Time Slot, and Payment Confirmation Status (Paid/Unpaid via gateway hooks).
*   **Interactive Status Pipeline Tool:** A color-coded dropdown selection element to mutate live delivery paths:
    *   `[Pending]` (Yellow) $ightarrow$ `[Baking/In Progress]` (Blue) $ightarrow$ `[Out for Delivery/Ready for Pickup]` (Purple) $ightarrow$ `[Delivered/Completed]` (Green).
    *   *System Event Trigger:* Switching to "Out for Delivery" triggers an automated transaction transactional email notification to the user's documented address.

---

## 4. Technical Rules & Acceptance Criteria for Coding Agent

### 4.1 System Performance Thresholds
*   **Image Compression Routine:** All asset components must render through optimization wrappers or layout engines. Heavy raw `.png` configurations must be dynamically formatted into compressed formats (`.webp`).
*   **Client Loading Latency:** Crucial hero pathways must optimize script components to establish interactive visual structures within a **max 2.0-second window** across mid-tier mobile networks.

### 4.2 Mobile Adaptation Metrics
*   **Component Engineering:** UI elements, cart selectors, layout structures, and transactional inputs must scale using responsive media queries across mobile screens. Keep touch-points within easy finger-reach.

### 4.3 Direct Mapping Table for Developer Validation

| System Segment | Action Context / User Flow | Required Acceptance Logic Verification |
| :--- | :--- | :--- |
| **Product Interface** | Filtering via category tag selectors. | Layout grid updates must populate dynamically without full-page document cycles. Empty states must render related item paths. |
| **Cart Micro-flows** | Adjusting individual element units. | Quantity counters must block sub-zero transitions. Drops to zero units must trigger a structural removal confirmation alert. |
| **Fulfillment Rules** | Selecting dates inside the scheduler component. | Validate constraints preventing historical selections. Block fully booked fulfillment periods automatically. |
| **Admin Operations** | Updating inventory state switches. | Switching active indicators to "false" must instantly block adding that specific entity inside active store checkouts. |

---
*This is for informational purposes only. AI responses may include mistakes.*
