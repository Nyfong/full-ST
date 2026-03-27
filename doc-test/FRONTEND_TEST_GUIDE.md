# Frontend Testing Guide — MetaBlog
> Based on Project Guideline: Quality Engineering Group Assignment
> Path B: The Creator (Custom) — Frontend only scope

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Font | Inter (Google Fonts) |
| Runtime | Node.js 18+ |

---

## 2. Local Setup

### Prerequisites
- Node.js >= 18
- npm >= 9

### Steps

```bash
# 1. Navigate to the frontend project
cd ST_final_project/blogapp

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Build for production

```bash
npm run build
npm run start
```

---

## 3. Application Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero banner + Latest Posts grid |
| `/blog` | Blog Listing | All posts in 3-column grid |
| `/blog/[slug]` | Single Post | Full article with related posts |
| `/contact` | Contact | Contact form |
| `/pages` | Pages | Site map / page index |

---

## 4. Frontend Flow Diagrams

### Flow 1 — Home Page Navigation

```
User opens http://localhost:3000
        │
        ▼
Navbar renders (logo + search bar + Contact link)
        │
        ▼
Hero section loads (featured post image + title + author)
        │
        ▼
Trending bar shows 4 post titles
        │
        ▼
"Latest Posts" grid renders (3 columns × 3 rows)
        │
        ├─── User clicks a PostCard ──────────────► Single Post Page
        ├─── User clicks "View All" ──────────────► /blog
        └─── User clicks "Load More Posts" ──────► (pagination - future)
```

---

### Flow 2 — Search Flow

```
User focuses on search bar in Navbar
        │
        ▼
Search bar expands (w-36 → w-64)
        │
        ▼
User types 2+ characters
        │
        ▼
Dropdown renders matching posts
(filtered by title / category / author)
        │
        ├─── Match found ──► User clicks result ──► /blog/[slug]
        └─── No match ────► "No posts found" message shown
```

---

### Flow 3 — Single Post Page Flow

```
User navigates to /blog/[slug]
        │
        ▼
Hero image loads (full-width)
        │
        ▼
Meta card renders (category badge, title, author, date, read time)
        │
        ▼
Article body renders
  ├─ Paragraphs (plain text)
  ├─ Headings (## prefix → <h2>)
  └─ Blockquotes (> prefix → styled quote)
        │
        ▼
"Related Posts" section (3 cards)
        │
        ▼
"← Back to Home" link → /
```

---

### Flow 4 — Contact Page Flow

```
User clicks "Contact" in Navbar
        │
        ▼
/contact page renders
        │
        ▼
Form fields: Name | Email | Message
        │
        ▼
User fills in form and clicks "Send Message"
        │
        ▼
(Form submission — currently UI only, no backend)
```

---

### Flow 5 — Responsive / Mobile Flow

```
Viewport < 768px (md breakpoint)
        │
        ▼
Desktop nav hidden
Hamburger icon (☰) shown
        │
        ▼
User taps hamburger
        │
        ▼
Mobile menu slides open:
  ├─ Search input
  ├─ Search results (if query ≥ 2 chars)
  └─ Contact link
        │
        ▼
User taps a link → menu closes → navigates
```

---

## 5. Phase 1 — Frontend Test Cases (Black-Box)

**Project Name:** MetaBlog
**Module:** Frontend UI
**Technique:** Equivalence Partitioning, Boundary Value Analysis, Exploratory

---

### TC-FE-001 — Home page loads successfully

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-001 |
| **Test Title** | Home page renders hero and post grid |
| **Technique** | Happy Path |
| **Pre-conditions** | Dev server running at `localhost:3000` |
| **Test Steps** | 1. Open `http://localhost:3000` |
| **Test Data** | N/A |
| **Expected Result** | Hero image, featured post title, "Latest Posts" heading, and 9 post cards visible |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | Page fully rendered, no console errors |

---

### TC-FE-002 — Navbar Contact link navigates correctly

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-002 |
| **Test Title** | Clicking "Contact" in navbar navigates to /contact |
| **Technique** | Happy Path |
| **Pre-conditions** | User is on home page |
| **Test Steps** | 1. Click "Contact" link in the navbar |
| **Test Data** | N/A |
| **Expected Result** | URL changes to `/contact`, contact form is displayed |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | User is on `/contact` page |

---

### TC-FE-003 — Active nav link is highlighted

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-003 |
| **Test Title** | Active page link shows blue highlight |
| **Technique** | Visual / Exploratory |
| **Pre-conditions** | User navigates to `/contact` |
| **Test Steps** | 1. Open `/contact` 2. Inspect "Contact" link in navbar |
| **Test Data** | N/A |
| **Expected Result** | "Contact" link has `text-blue-600 bg-blue-50` styling |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | N/A |

---

### TC-FE-004 — Search with valid query returns results

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-004 |
| **Test Title** | Search dropdown shows results for matching keyword |
| **Technique** | Equivalence Partitioning (valid input) |
| **Pre-conditions** | User is on any page with Navbar visible |
| **Test Steps** | 1. Click search bar 2. Type "Technology" |
| **Test Data** | query = "Technology" |
| **Expected Result** | Dropdown shows posts with "Technology" in title or category |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | Dropdown visible |

---

### TC-FE-005 — Search with no match shows "No posts found"

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-005 |
| **Test Title** | Search shows empty state for unmatched query |
| **Technique** | Equivalence Partitioning (invalid input) |
| **Pre-conditions** | Search bar focused |
| **Test Steps** | 1. Type "xyzxyzxyz" in search bar |
| **Test Data** | query = "xyzxyzxyz" |
| **Expected Result** | Message: `No posts found for "xyzxyzxyz"` |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | No navigation occurs |

---

### TC-FE-006 — Search with 1 character shows no dropdown

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-006 |
| **Test Title** | Search dropdown does not appear for single character |
| **Technique** | Boundary Value Analysis |
| **Pre-conditions** | Search bar focused |
| **Test Steps** | 1. Type "T" (1 character) |
| **Test Data** | query = "T" |
| **Expected Result** | No dropdown appears |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | N/A |

---

### TC-FE-007 — Clicking a search result navigates to post

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-007 |
| **Test Title** | Selecting search result opens correct blog post |
| **Technique** | Happy Path |
| **Pre-conditions** | Search dropdown is visible with results |
| **Test Steps** | 1. Search "Technology" 2. Click first result in dropdown |
| **Test Data** | query = "Technology" |
| **Expected Result** | Navigates to `/blog/[slug]` of selected post |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | User is on single post page |

---

### TC-FE-008 — Single post page renders all content sections

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-008 |
| **Test Title** | Blog post page shows image, meta, body, related posts |
| **Technique** | Happy Path |
| **Pre-conditions** | Valid slug exists |
| **Test Steps** | 1. Navigate to `/blog/impact-of-technology-on-workplace` |
| **Test Data** | slug = `impact-of-technology-on-workplace` |
| **Expected Result** | Hero image, category badge, title, author, date, read time, article body, related posts all visible |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | N/A |

---

### TC-FE-009 — Invalid post slug shows 404

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-009 |
| **Test Title** | Non-existent slug triggers not-found page |
| **Technique** | Sad Path |
| **Pre-conditions** | Dev server running |
| **Test Steps** | 1. Navigate to `/blog/this-does-not-exist` |
| **Test Data** | slug = `this-does-not-exist` |
| **Expected Result** | Next.js 404 / not-found page is displayed |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | N/A |

---

### TC-FE-010 — Mobile hamburger menu opens and closes

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-010 |
| **Test Title** | Mobile nav toggling works correctly |
| **Technique** | Happy Path (Responsive) |
| **Pre-conditions** | Viewport set to 375px width (mobile) |
| **Test Steps** | 1. Open home page at mobile width 2. Click ☰ icon 3. Verify menu opens 4. Click ✕ icon |
| **Test Data** | Viewport: 375×812 |
| **Expected Result** | Menu opens showing Contact link and search input; clicking ✕ closes it |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | Menu closed |

---

### TC-FE-011 — PostCard hover effects work

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-011 |
| **Test Title** | Post card shows scale and shadow on hover |
| **Technique** | Exploratory / Visual |
| **Pre-conditions** | Home page loaded |
| **Test Steps** | 1. Hover over any PostCard |
| **Test Data** | N/A |
| **Expected Result** | Card lifts (shadow increases), image zooms slightly, title turns blue |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | N/A |

---

### TC-FE-012 — "Back to Home" link on post page works

| Field | Data |
|-------|------|
| **Test Case ID** | TC-FE-012 |
| **Test Title** | Back to Home link returns user to home page |
| **Technique** | Happy Path |
| **Pre-conditions** | User is on a single post page |
| **Test Steps** | 1. Click "← Back to Home" link at bottom of post |
| **Test Data** | N/A |
| **Expected Result** | Navigates back to `/` |
| **Actual Result** | _Fill during execution_ |
| **Status** | Pass / Fail / Blocked |
| **Post-conditions** | User is on home page |

---

## 6. Phase 2 — UI Automation (E2E Flows)

Use **Playwright** or **Cypress** for the following flows.

### E2E Flow 1 — Browse and Read a Blog Post

```
1. Open http://localhost:3000
2. Assert: hero section is visible
3. Assert: at least 6 PostCards are rendered
4. Click the first PostCard
5. Assert: URL matches /blog/[slug]
6. Assert: article title is visible
7. Assert: "Related Posts" section has 3 cards
8. Click "← Back to Home"
9. Assert: URL is /
```

### E2E Flow 2 — Search and Navigate to Result

```
1. Open http://localhost:3000
2. Click the search input in the navbar
3. Type "Travel"
4. Assert: dropdown appears with at least 1 result
5. Click the first result
6. Assert: navigated to /blog/[slug]
7. Assert: post category badge text is "Travel"
```

---

## 7. Phase 1B — Test Charters (SBTM)

### Charter 1 — Navigation & Routing Integrity

| Field | Details |
|-------|---------|
| **Mission** | Explore all navigation paths to find broken links or unexpected behavior |
| **Area** | Navbar, PostCard links, Back button, Trending bar |
| **Time Box** | 30 minutes |
| **Risks to Explore** | Missing routes (404), wrong slugs, active state mismatch |

---

### Charter 2 — Search Edge Cases

| Field | Details |
|-------|---------|
| **Mission** | Test search input with unusual inputs to find vulnerabilities or broken states |
| **Area** | Navbar search bar |
| **Time Box** | 30 minutes |
| **Risks to Explore** | 1-char input, special chars (`<script>`, `"`, `'`), very long strings, whitespace-only |

---

### Charter 3 — Responsive Layout Breakpoints

| Field | Details |
|-------|---------|
| **Mission** | Verify UI at different viewport sizes doesn't break layout |
| **Area** | All pages — Navbar, Hero, PostCard grid, Footer |
| **Time Box** | 30 minutes |
| **Risks to Explore** | Grid collapse at 768px, hero overflow on small screens, footer stacking |

---

## 8. Bug Report Template (Frontend)

```
Bug ID:       BUG-FE-001
Bug Title:    [Short description]
Severity:     Critical / Major / Minor
Priority:     P1 / P2 / P3
Environment:  Browser: Chrome v120 | OS: macOS | Viewport: 1440px
              App: http://localhost:3000 | Next.js 16

Steps to Reproduce:
  1.
  2.
  3.

Expected Result:
Actual Result:
Evidence:     [screenshot / screen recording link]
Status:       New / Open / Fixed / Verified
```

---

## 9. Quick Reference — File Locations

| What | File |
|------|------|
| Mock post data | `lib/posts.ts` |
| Navbar (search + contact) | `components/Navbar.tsx` |
| Footer | `components/Footer.tsx` |
| Post card | `components/PostCard.tsx` |
| Home page | `app/page.tsx` |
| Blog listing | `app/blog/page.tsx` |
| Single post | `app/blog/[slug]/page.tsx` |
| Contact form | `app/contact/page.tsx` |
| Global styles | `app/globals.css` |
| Next.js config | `next.config.ts` |
