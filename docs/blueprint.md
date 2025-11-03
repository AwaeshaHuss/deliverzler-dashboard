# **App Name**: Deliverzler Admin

## Core Features:

- Admin Authentication: Secure admin-only access using Firebase Auth with custom role-based claims, with persistent login sessions.
- Menu Management: CRUD operations for 'menu_categories' and 'menu_items' Firestore collections, including nested structures like options and addons. Admins should also be able to upload food photography.
- Orders Management: Real-time Firestore listener for 'orders' collection. Display full order details, update order status, and re-assign drivers.
- User Management: View all users from 'users' collection, show user addresses, and manage favorites, support tickets, and promo codes. Ability to block user accounts if inappropriate behavior is identified by an AI tool.
- Driver Management: Manage and monitor drivers, show availability, location, and current assignments. Review and approve driver applications.
- Promotions & Reviews: CRUD for 'promo_codes' and moderation tools for user reviews (filter profanity, highlight key topics).
- Notifications: Send targeted push notifications to users or drivers using Firebase Cloud Messaging based on various situations, composed using a generative AI tool.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to evoke trust, stability, and operational efficiency. The use case of controlling critical business data makes these attributes desirable.
- Background color: Light gray (#F0F4F7), a desaturated variant of the primary color to provide a clean, unobtrusive backdrop.
- Accent color: Vibrant orange (#FF9800) to highlight key actions, alerts, and important data points. This offers an analogous contrast against the indigo.
- Font pairing: 'Space Grotesk' (sans-serif) for headings and 'Inter' (sans-serif) for body text.
- Code Font: 'Source Code Pro' for displaying any code snippets.
- Consistent and clear icons from Material Design, tailored for data visualization and control actions.
- Responsive grid layout adapting to different screen sizes, with a sidebar for navigation and cards for data presentation.
- Subtle transitions and animations to provide feedback on actions and status updates, enhancing user experience.