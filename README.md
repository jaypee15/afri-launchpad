# Africa Launchpad: Ultra-Lean MVP Product

## Objective

Develop a minimal pre-launch discovery platform for African startups, featuring:

- **Pre-launch profiles** for businesses (idea validation and waitlists).
- **User discovery and follow** functionalities for upcoming startups.
- Optimizations for low-bandwidth environments and affordable devices.

## Core Non-Negotiables

1. **Africa-First**:

   - Offline support and optimizations for slow networks.
   - Tested on affordable devices such as the Tecno Spark.

2. **Pre-Launch Essentials**:

   - Waitlist collection, progress tracking, and basic analytics.

3. **Zero Bloat**:

   - Focus exclusively on core features (no admin dashboards, no AI, and no investor matchmaking).

## Tech Stack

### Project Structure

- **Monorepo**: Both frontend and backend reside in a single repository in one main folder.

### Frontend

- **Framework**: Next.js (App Router) with TypeScript.

  - **Benefits**: Server-Side Rendering (SSR) for SEO, Vercel hosting, and built-in image optimization.

- **UI**:

  - Tailwind CSS combined with shadcn/ui for rapid UI development.
  - Images are compressed (under 50KB) using Next.js's `Image` component.

- **State Management**: Zustand for global state management with `localStorage` for offline persistence.

- **Authentication & Onboarding**: NextAuth.js configured with:

  - **Providers**: Google, Twitter, Facebook, and Email/Password.
  - **Email Verification**: Ensures users verify their email addresses.
  - **Onboarding Flow**:
    - **For New Users**: After sign-up, guide users through a brief tour. Prompt them to select their interests (e.g., fintech, agritech, healthtech) so the discovery feed can be tailored to their preferences.
    - **For Business Owners**: After authentication, provide a step-by-step wizard to create a pre-launch profile. Steps include:
      1. **Business Details**: Enter the business name, a one-sentence pitch, and select a sector.
      2. **Logo Upload**: Upload and auto-resize the logo to 100x100px.
      3. **Waitlist Setup**: Configure a “Notify on Launch” feature to collect emails.
      4. **Preview & Confirm**: Review the profile before publishing.

### Backend

- **Framework**: NestJS with TypeScript.
  - **Benefits**: Structured, scalable, and modular architecture.
- **Authentication**:
  - **JWT Verification**: Secure API routes by validating tokens issued by NextAuth.js.
- **Database**: MongoDB (Atlas free tier).
  - **Schemas**:
    - `User`: Stores user details.
    - `Business`: Contains business details such as name, pitch, sector, and waitlist emails.
- **APIs**:
  - `POST /businesses`: Create a pre-launch profile.
  - `GET /businesses`: Retrieve businesses by search criteria (e.g., sector, country).

## MVP Features

### For Businesses

- **Pre-Launch Profile**:

  - **Inputs**: Business name, one-sentence pitch, and sector selection (e.g., fintech, agritech, healthtech, edtech, logistics).
  - **Logo Upload**: Auto-resize images to 100x100px.
  - **Notification Button**: "Notify on Launch" to collect emails.

- **Progress Dashboard**:

  - Display basic statistics (e.g., "500 people waiting") using placeholder data until real user data is collected.

### For Users

- **Discovery Feed**:

  - A list of startups with logos, pitches, and "Follow" buttons.
  - Search functionality by keyword or sector, leveraging MongoDB's text indexing.

- **Profile Pages**:

  - Static pre-rendered pages using Next.js SSG.
  - "Get notified" forms for email alerts.

## Additional Benefits

### For Users

- **Early Access to Innovation**:\
  Discover and explore the latest startup ideas before they officially launch, giving you the thrill of being an early adopter.

- **Personalized Discovery**:\
  Enjoy a tailored feed based on your selected interests (e.g., fintech, agritech, healthtech), ensuring that you see content most relevant to you.

- **Community Engagement**:\
  Join a growing community of early adopters. Provide feedback, engage in discussions, and help shape the direction of emerging startups.

- **Exclusive Perks & Offers**:\
  Gain access to early-bird benefits, beta trials, or special discounts offered by startups as a reward for early engagement.

- **Market Insights**:\
  Stay informed with curated data and trends about the startup ecosystem, helping you anticipate emerging technologies and services in Africa.

### For Businesses

- **Early Market Validation**:\
  Validate your product ideas and business concepts by collecting real user feedback and building a waitlist of interested customers.

- **Cost-Effective Launchpad**:\
  Benefit from a low-cost, high-impact platform that enables you to test your ideas without a heavy upfront investment.

- **Enhanced Visibility & Branding**:\
  Gain exposure on a dedicated, Africa-focused platform. Establish credibility and build a strong brand presence among a targeted audience.

- **Data-Driven Insights**:\
  Access basic analytics and engagement data to better understand user behavior, optimize marketing strategies, and refine your product offerings.

- **Networking & Partnerships**:\
  Connect with potential customers, investors, and other startups. Leverage the platform as a hub for forming valuable industry relationships.

- **Direct User Feedback Loop**:\
  Utilize real-time feedback from early adopters to iterate quickly on product features, ensuring a better market fit upon full launch.

## DevOps

- **Hosting**:

  - **Frontend**: Vercel (free tier with a global CDN).
  - **Backend**: Railway.app (free tier with auto-scaling).

- **Monitoring**:

  - **Sentry**: For error tracking on both frontend and backend.
  - **LogRocket**: For recording user sessions, especially useful under slow network conditions.

- **Database**:

  - MongoDB Atlas with automated backups enabled.

## Risks & Mitigations

| **Risk**                   | **Mitigation**                                              |
| -------------------------- | ----------------------------------------------------------- |
| Slow API responses         | Cache search results in Redis with a TTL of 1 hour.         |
| Trust issues in pre-launch | Display a “Verified by AfriLabs” badge after manual checks. |
| Integration challenges     | Modularize features to allow for iterative improvements.    |

## Key Adaptations for Africa

1. **Offline-First**:
   - Use service workers to cache profile pages.
   - Persist state using Zustand with `localStorage`.

## Tools & Resources

- **Authentication**: [NextAuth.js Documentation](https://next-auth.js.org/)
- **UI Components**: [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- **Hosting**: [Vercel](https://vercel.com), [Railway](https://railway.app)

## Codebase Setup

### Frontend Setup, in frontend folder

```bash
# Create Next.js project with TypeScript and App Router
npx create-next-app@latest africa-launchpad --typescript --app

# Move into the project folder
cd africa-launchpad

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui for rapid UI components
npx shadcn-ui@latest init

# Install Zustand for state management
npm install zustand

# Install NextAuth.js for authentication
npm install next-auth

# Create NestJS backend
npx @nestjs/cli new backend

# Move into the backend in server folder
cd server

# Install MongoDB (using Mongoose)
npm install @nestjs/mongoose mongoose

# Install JWT libraries for authentication
npm install jsonwebtoken @nestjs/config


# In the project root folder:
mkdir apps
mv africa-launchpad backend apps/


```
