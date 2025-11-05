# Deliverzler Admin Dashboard

This is a comprehensive admin dashboard for the "Deliverzler" food delivery platform, built with Next.js and Firebase. It provides administrators with the tools to manage users, drivers, orders, menu items, and more, while leveraging AI for enhanced functionality like content moderation and automated communication.

## Features

- **Dashboard:** An overview of key metrics, including total revenue, new orders, user growth, and sales charts.
- **Menu Management:** Full CRUD (Create, Read, Update, Delete) functionality for menu items and categories.
- **Order Tracking:** View and manage all customer orders.
- **User Management:** Manage all registered users, with the ability to view details, update status, and delete accounts.
- **Driver Management:** Onboard and manage drivers, approve applications, and monitor their status and availability.
- **Promotions:** Create and manage promotional codes and special offers.
- **Review Moderation:** View customer reviews and use AI to summarize feedback and filter content.
- **AI-Powered Notifications:** Generate and send targeted push notifications to users or drivers based on specific situations.
- **AI-Powered Moderation:** Use an AI flow to analyze user activity summaries and recommend moderation actions (e.g., blocking a user).
- **Secure Authentication:** Firebase-powered email/password authentication with admin-only access control.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Generative AI:** [Genkit](https://firebase.google.com/docs/genkit) with the Gemini API
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Charts:** [Recharts](https://recharts.org/)

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or another package manager like yarn or pnpm

### Installation

1.  **Clone the repository:**
    If you have access to the GitHub repository, clone it to your local machine.

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

    Alternatively, download the source code as a ZIP file and extract it.

2.  **Install dependencies:**
    Navigate to the project's root directory in your terminal and install the required packages.

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    The application requires an API key for the Gemini AI features. Create a file named `.env.local` in the root of the project and add your key:

    ```
    GEMINI_API_KEY="your_api_key_here"
    ```
    You can obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the Development Server:**
    Start the Next.js development server.

    ```bash
    npm run dev
    ```

    The application should now be running at [http://localhost:3000](http://localhost:3000).
