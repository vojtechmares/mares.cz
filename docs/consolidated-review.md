# Consolidated Code Review

This document contains all remaining issues from previous code reviews, organized by priority.

---

## Critical Priority

### No CSP Headers

**Status:** Not implemented
**Impact:** Security vulnerability - XSS attacks possible without Content-Security-Policy headers

**Action Items:**

- Configure CSP headers in Cloudflare Workers or middleware
- At minimum, set `default-src 'self'` with appropriate exceptions for analytics and fonts

---

## High Priority

### E2E Tests Don't Cover Application

**Status:** Tests navigate to playwright.dev instead of actual application
**Impact:** No real E2E coverage of the website

**Action Items:**

- Update Playwright tests in `tests/e2e/` to test actual application routes
- Add tests for key user flows: navigation, blog posts, training pages

---

## Medium Priority

### No Health Check Endpoint

**Status:** Not implemented
**Impact:** Cannot verify application health in production monitoring

**Action Items:**

- Add `/health` or `/livez` route that returns 200 OK
- Optionally check downstream dependencies (if any)

### Hardcoded Tailwind Classes (~40% remaining)

**Status:** Partially fixed - UI components adopted but hardcoded values remain
**Location:** Hero, Footer, Navigation components

**Action Items:**

- Audit remaining hardcoded colors and spacing in layout components
- Replace with design tokens from `design-tokens.ts`
- Use spacing scale (sm, md, lg, xl) instead of arbitrary values

### Error Page Exposes Raw Error Message

**Status:** 500.astro may expose `error.message` to users
**Impact:** Information leakage in production

**Action Items:**

- Review `src/pages/500.astro` error handling
- Show generic message to users, log details server-side

### Outdated CLAUDE.md Documentation

**Status:** References STRAPI environment variables
**Impact:** Misleading documentation - app no longer uses Strapi

**Action Items:**

- Update CLAUDE.md to reflect current architecture (content collections)
- Remove references to `STRAPI_API_URL` and `STRAPI_API_TOKEN`

### Google Analytics Configuration

**Status:** `DISABLE_ANALYTICS` defined but implementation incomplete
**Impact:** Tracking ID hardcoded, flag may not work properly

**Action Items:**

- Verify `DISABLE_ANALYTICS` flag actually disables tracking
- Move tracking ID to environment variable

---

## Low Priority

### File Naming Convention Inconsistency

**Status:** Mixed conventions across codebase
**Pattern:** Astro files use PascalCase, TSX files use kebab-case

**Action Items:**

- Document naming convention in CLAUDE.md
- Optionally migrate to consistent convention

### Body Component Uses Different Prop Name

**Status:** Body uses `color` prop while other components use `variant`
**Impact:** Inconsistent API across UI components

**Action Items:**

- Consider renaming to `variant` for consistency
- Or document the intentional difference

### i18n Routing Incomplete

**Status:** No `src/pages/en/` directory exists
**Impact:** English routes not properly supported

**Action Items:**

- Implement English page routes if multilingual support needed
- Or document that only Czech is currently supported

### Hardcoded Czech Strings

**Status:** Hero, Services, Cooperation components have Czech-only text
**Impact:** Cannot easily add other languages

**Action Items:**

- Extract strings to i18n system if multilingual needed
- Low priority if site remains Czech-only

### No hreflang Tags

**Status:** SEO components lack language alternate tags
**Impact:** Search engines can't identify language versions

**Action Items:**

- Add hreflang tags if multilingual support is implemented
- Skip if site remains single-language

### Commented-Out Code

**Status:** Dead code in article-grid.tsx, navigation.tsx
**Impact:** Code clutter

**Action Items:**

- Remove commented code blocks
- Use git history for reference if needed

### TagList Component Duplication

**Status:** Inline tag rendering duplicated in 3 places
**Impact:** Minor code duplication

**Action Items:**

- Use TagList component consistently
- Or accept duplication if usage patterns differ

### Prettier Config Documentation Mismatch

**Status:** .prettierrc.json says "strict", CLAUDE.md says "ignore"
**Impact:** Confusing documentation

**Action Items:**

- Verify actual Prettier config and update CLAUDE.md to match

---

## Reference

For design system documentation, see:

- `docs/design-system.md` - Active design system tokens and components
- `docs/whitespace-formatting.md` - Code pattern documentation

---

_Last updated: 2025-01-25_
