# Implementation Tasks - Project Improvements

Generated: 2025-12-06

This document provides detailed implementation plans for each issue identified in the project analysis.

---

## P0 - Critical Priority

### P0-1: Layout API Calls Caching

**Problem Statement:**
`Layout.astro:45-46` fetches all pages and trainings from Strapi on every single SSR request. This results in:

- 2 API calls to Strapi for every page load
- No caching mechanism
- Poor scalability as content grows
- Strapi API becomes a single point of failure for the entire site
- Increased response times for all pages
- Unnecessary load on Strapi CMS

**Implementation Plan:**

1. **Create caching utility module** (`src/lib/cache.ts`)
   - Implement in-memory cache with TTL support
   - Add cache key generation
   - Add cache invalidation methods
   - Include LRU eviction policy for memory management

2. **Add cache wrapper for Strapi client**
   - Modify `strapi.ts` to add optional caching parameter
   - Implement `fetchPagesCached()` and `fetchTrainingsCached()` methods
   - Set default TTL to 5 minutes (configurable via env var)
   - Add cache statistics logging

3. **Update Layout.astro to use cached methods**
   - Replace direct API calls with cached versions
   - Add error handling with fallback to empty arrays
   - Add cache warming on server startup

4. **Add cache configuration**
   - Add `CACHE_TTL_SECONDS` environment variable to schema
   - Document caching behavior in CLAUDE.md
   - Add cache clear mechanism for content updates

5. **Optional: Implement Cloudflare Workers caching**
   - Investigate edge caching for static navigation data
   - Add cache headers for CDN caching

**Definition of Done:**

- [ ] In-memory cache implemented with TTL support
- [ ] Layout.astro uses cached Strapi calls
- [ ] Cache TTL configurable via environment variable (default: 300s)
- [ ] Server logs cache hit/miss statistics
- [ ] Navigation still loads if Strapi is unavailable (graceful degradation)
- [ ] Cache invalidation method documented
- [ ] No increase in memory usage beyond 50MB for cache
- [ ] Response time for pages reduced by >50% (measure with ab/wrk)
- [ ] Documentation updated in CLAUDE.md
- [ ] Manual testing shows stale data updates within TTL window

---

### P0-2: Error Handling in Layout

**Problem Statement:**
Layout.astro has no try/catch around critical API calls to fetch pages and trainings. If Strapi CMS is down or returns an error:

- Entire website becomes unavailable
- Users see 500 errors instead of degraded content
- No graceful fallback mechanism
- No error logging for debugging
- No visibility into CMS availability issues

**Implementation Plan:**

1. **Add comprehensive error handling to Layout.astro**
   - Wrap `fetchPages()` and `fetchTrainings()` in try/catch blocks
   - Default to empty arrays on error
   - Log errors with context (timestamps, error messages)
   - Add error reporting mechanism

2. **Implement fallback behavior**
   - Site renders with empty navigation when CMS is unavailable
   - Consider adding static fallback navigation items
   - Add visual indicator for degraded mode (optional)

3. **Add structured logging**
   - Log successful fetches with timing
   - Log failures with full error context
   - Include request ID for correlation

4. **Add health check enhancement**
   - Update `/_/livez` endpoint to check Strapi connectivity
   - Add `/_/readyz` endpoint with dependency checks
   - Return degraded status when CMS is unavailable

**Definition of Done:**

- [ ] Layout.astro has try/catch around all API calls
- [ ] Site renders successfully when Strapi is down (with empty nav)
- [ ] Errors logged to console with full context
- [ ] `/_/livez` endpoint checks Strapi health
- [ ] `/_/readyz` endpoint added with dependency checks
- [ ] Manual testing: site works with Strapi unreachable
- [ ] Manual testing: errors appear in server logs
- [ ] No unhandled promise rejections in error scenarios
- [ ] Documentation includes degraded mode behavior

---

## P1 - High Priority

### P1-1: Strapi Error Handling

**Problem Statement:**
The error handling logic in `strapi.ts:117-119` is unreachable because:

- Axios throws exceptions on 4xx/5xx status codes by default
- The status check happens after axios has already thrown
- Error messages lack context (no URL, no response details)
- No retry mechanism for transient failures (network timeouts, 502/503)
- Generic errors make debugging difficult

**Implementation Plan:**

1. **Fix axios error handling logic**
   - Add `validateStatus` option to prevent throwing on 4xx/5xx
   - Implement proper status code checking
   - Add axios error type guards

2. **Improve error messages**
   - Include request path in error messages
   - Add response status code
   - Include response body for debugging
   - Add request timing information

3. **Implement retry mechanism**
   - Add exponential backoff for transient errors (502, 503, 504, network errors)
   - Configure max retries (default: 3)
   - Only retry idempotent GET requests
   - Add retry count to error logs

4. **Add request logging**
   - Log all Strapi requests with timing
   - Log response status codes
   - Track slow requests (>1s threshold)

5. **Create custom error types**
   - `StrapiNotFoundError` for 404s
   - `StrapiAuthError` for 401/403
   - `StrapiServerError` for 5xx
   - `StrapiNetworkError` for timeouts/connection issues

**Definition of Done:**

- [ ] Axios configured with `validateStatus` to handle all status codes
- [ ] Status code validation happens before throwing
- [ ] Error messages include path, status code, and context
- [ ] Retry mechanism with exponential backoff implemented
- [ ] Max retries configurable via environment (default: 3)
- [ ] Custom error classes created and used
- [ ] Request/response logging added
- [ ] Unit tests for error scenarios (404, 500, timeout, retry)
- [ ] Manual testing with mock Strapi errors
- [ ] All `any` types in error handling replaced with proper types
- [ ] Documentation updated with error handling behavior

---

### P1-2: TypeScript Type Safety

**Problem Statement:**
Multiple type safety issues throughout the codebase:

- 6 instances of `any` types in Strapi transformers (lines 54, 72, 90, 124, 139, 177)
- No runtime validation of API responses
- Unsafe property access without null checks
- Risk of runtime errors from malformed CMS data
- Type information lost at API boundaries
- No schema validation for external data

**Implementation Plan:**

1. **Define Strapi API response interfaces**
   - Create `src/interfaces/strapi-api.ts`
   - Define complete interfaces for Article, Training, Page responses
   - Include all nested objects (icon, logo, formats)
   - Document Strapi field types

2. **Add runtime validation with Zod**
   - Install Zod: `pnpm add zod`
   - Create Zod schemas matching Strapi responses
   - Add validation in transform methods
   - Handle validation errors gracefully

3. **Update transformer methods**
   - Replace all `any` parameters with proper interfaces
   - Add null checks for optional fields
   - Use Zod schemas for validation
   - Add type assertions where safe

4. **Add response validation**
   - Validate Strapi responses before transformation
   - Log validation errors with response data
   - Throw typed errors on validation failure
   - Add response schema version checking

5. **Update interfaces for strict null checks**
   - Review all interfaces for optional vs required fields
   - Add proper null/undefined handling
   - Update consuming code to handle nulls

**Definition of Done:**

- [ ] Zod installed and configured
- [ ] All Strapi API response interfaces defined in `src/interfaces/strapi-api.ts`
- [ ] Zod schemas created for all API responses
- [ ] All `any` types removed from strapi.ts
- [ ] Runtime validation added to all transform methods
- [ ] Validation errors logged with context
- [ ] Type errors caught at compile time
- [ ] No type assertions without runtime checks
- [ ] Unit tests for validation (valid/invalid data)
- [ ] Manual testing with malformed CMS responses
- [ ] TypeScript strict mode enabled (if not already)
- [ ] Documentation includes schema validation approach

---

## P1 - High Priority (continued)

### P1-3: Integration Testing for Critical Pages

**Problem Statement:**
No automated tests verify that critical pages render correctly:

- Homepage and training pages are core to the business but untested
- No verification that expected content appears on pages
- Manual testing required for every deployment
- Risk of deploying broken pages to production
- No regression detection when dependencies change
- Content from Strapi/Notion could be missing without notice
- No confidence in SSR rendering correctness

**Implementation Plan:**

1. **Set up testing infrastructure**
   - Install Vitest: `pnpm add -D vitest @vitest/ui`
   - Install Playwright for integration tests: `pnpm add -D @playwright/test`
   - Configure test scripts in package.json
   - Set up test environment with Astro

2. **Create homepage integration tests**
   - Test homepage renders without errors
   - Verify hero section is present
   - Check navigation menu appears
   - Verify training list renders
   - Check footer is present
   - Verify meta tags and OpenGraph data
   - Test both Czech and English versions

3. **Create training page tests**
   - Test training detail pages render
   - Verify training title and description appear
   - Check training content (markdown) renders
   - Verify pricing information is displayed
   - Check public training sessions table appears
   - Verify OpenGraph image generation
   - Test with mock Strapi/Notion data

4. **Add mock data for tests**
   - Create test fixtures for Strapi responses
   - Mock Notion API responses
   - Add factories for Article, Training, Page objects
   - Handle authentication in test environment

5. **Set up CI integration**
   - Add test job to GitHub Actions workflow
   - Run tests before deployment
   - Fail deployment if tests fail
   - Add test coverage reporting

6. **Add visual regression testing (optional)**
   - Install Playwright visual comparisons
   - Capture screenshots of critical pages
   - Detect visual regressions
   - Store baselines in repository

**Definition of Done:**

- [ ] Vitest and Playwright installed and configured
- [ ] Test script added to package.json (`pnpm test`)
- [ ] Homepage integration tests created
- [ ] Tests verify hero, navigation, footer, training list
- [ ] Training page tests created
- [ ] Tests verify title, content, pricing, sessions table
- [ ] Mock Strapi/Notion data created for tests
- [ ] Both Czech and English locales tested
- [ ] Tests run in CI before deployment
- [ ] All tests pass locally and in CI
- [ ] Test coverage >70% for critical page components
- [ ] Failed tests block deployment
- [ ] Tests complete in <60 seconds
- [ ] Documentation includes testing guide
- [ ] Visual regression tests configured (optional)

---

## P2 - Medium Priority

### P2-1: Pagination Implementation

**Problem Statement:**
Blog pagination is incomplete:

- TODO comments in `strapi.ts:26-27` and `strapi.ts:49`
- Hardcoded limit of 100 items for articles, pages, trainings
- No pagination UI on blog index page
- Poor UX as content grows (loading 100 articles on every request)
- No way to navigate older content
- Inconsistent with best practices (typical blog shows 10-20 per page)

**Implementation Plan:**

1. **Update Strapi client pagination logic**
   - Change default `articlesPerPage` from 100 to 12
   - Implement proper pagination in `fetchArticles()`
   - Return pagination metadata (total pages, current page, total items)
   - Add method to fetch single page of articles

2. **Create pagination component**
   - Create `src/components/blog/pagination.tsx`
   - Support page numbers, prev/next buttons
   - Highlight current page
   - Disable buttons at boundaries
   - Mobile-responsive design

3. **Update blog index page**
   - Add page parameter to route: `/blog/[page]` or query string
   - Parse page number from URL
   - Validate page number (1 to maxPages)
   - Return 404 for invalid pages
   - Pass pagination data to component

4. **Add SEO considerations**
   - Add `rel="prev"` and `rel="next"` links in `<head>`
   - Update sitemap to include all blog pages
   - Add canonical URLs for each page

5. **Update interfaces**
   - Create `PaginationMeta` interface
   - Update return type of `fetchArticles()`
   - Add pagination props to blog components

**Definition of Done:**

- [ ] `articlesPerPage` changed from 100 to 12
- [ ] `fetchArticles()` returns pagination metadata
- [ ] Pagination component created and styled
- [ ] Blog index shows only 12 articles per page
- [ ] Pagination controls work (prev/next, page numbers)
- [ ] URL reflects current page
- [ ] Invalid page numbers return 404
- [ ] SEO meta tags added (rel=prev/next, canonical)
- [ ] Sitemap includes all paginated blog pages
- [ ] Manual testing with >12 blog posts
- [ ] Responsive design tested on mobile
- [ ] Documentation updated in CLAUDE.md

---

### P2-2: Kubernetes Readiness Probes

**Problem Statement:**
Kubernetes deployment configuration is missing critical health checks:

- Only liveness probe configured, no readiness probe
- Pods receive traffic before application is ready
- Can cause 502 errors during deployments
- No graceful handling of startup time
- Risk of cascading failures during rolling updates
- No pod disruption budget to prevent outages

**Implementation Plan:**

1. **Add readiness probe to deployment**
   - Update `deploy/k8s/templates/deployment.yaml`
   - Use same endpoint as liveness: `/_/livez`
   - Configure appropriate delays and timeouts
   - Set failure threshold

2. **Enhance health check endpoint**
   - Create separate `/_/readyz` endpoint in server.mjs
   - Check Strapi connectivity (optional)
   - Check cache initialization
   - Return 200 only when fully ready

3. **Add pod disruption budget**
   - Create `deploy/k8s/templates/pdb.yaml`
   - Set minimum available pods during disruptions
   - Ensure at least 1 pod always available

4. **Add horizontal pod autoscaler**
   - Create `deploy/k8s/templates/hpa.yaml`
   - Configure CPU-based autoscaling (70% threshold)
   - Set min replicas: 2, max replicas: 10
   - Add memory-based scaling (optional)

5. **Update resource requests/limits**
   - Review current settings (512Mi memory, 100m CPU)
   - Increase if needed based on actual usage
   - Add recommendation based on monitoring

**Definition of Done:**

- [ ] Readiness probe added to deployment.yaml
- [ ] `/_/readyz` endpoint created in server.mjs
- [ ] Readiness endpoint checks critical dependencies
- [ ] Pod disruption budget created (minAvailable: 1)
- [ ] HPA created with CPU threshold at 70%
- [ ] Rolling update tested without downtime
- [ ] Pods don't receive traffic until ready
- [ ] Health check thresholds tuned (no flapping)
- [ ] Resource requests/limits reviewed and updated
- [ ] Manual testing of rolling deployment
- [ ] Documentation updated with health check behavior
- [ ] Values.yaml includes configurable probe settings

---

## P3 - Low Priority

### P3-1: Monitoring & Observability

**Problem Statement:**
Application lacks production-grade observability:

- No error tracking or alerting
- No performance monitoring
- No application metrics (response times, cache hit rates)
- No visibility into Strapi API latency
- Cannot debug production issues effectively
- No structured logging
- OTEL config exists but unused (server.mjs:17)

**Implementation Plan:**

1. **Add Sentry for error tracking**
   - Install Sentry packages: `pnpm add @sentry/astro @sentry/node`
   - Configure Sentry in astro.config.mjs
   - Add Sentry to server.mjs
   - Set up error boundaries
   - Configure source maps upload

2. **Implement structured logging**
   - Install pino: `pnpm add pino pino-pretty`
   - Replace console.log with pino logger
   - Add request ID correlation
   - Log levels: debug, info, warn, error
   - Add log sampling for high-traffic endpoints

3. **Add application metrics**
   - Install prometheus client: `pnpm add prom-client`
   - Add metrics endpoint: `/_/metrics`
   - Track request duration, status codes
   - Track cache hit/miss rates
   - Track Strapi API latency

4. **Add OpenTelemetry instrumentation**
   - Install OTEL packages
   - Configure tracing for HTTP requests
   - Add Strapi client instrumentation
   - Export to OTEL collector (or Honeycomb/DataDog)

5. **Configure alerting**
   - Set up Sentry alerts for error rate spikes
   - Configure Prometheus alerts (if using)
   - Add uptime monitoring (UptimeRobot, Pingdom)
   - Alert on high Strapi latency

**Definition of Done:**

- [ ] Sentry installed and configured
- [ ] All errors sent to Sentry with context
- [ ] Pino structured logging implemented
- [ ] All console.log replaced with logger calls
- [ ] Request ID added to all logs
- [ ] Prometheus metrics endpoint exposed
- [ ] Key metrics tracked (latency, cache, errors)
- [ ] OpenTelemetry tracing configured (optional)
- [ ] Alerts configured for critical errors
- [ ] Source maps uploaded to Sentry
- [ ] Manual testing of error reporting
- [ ] Dashboard created for key metrics
- [ ] Documentation includes monitoring setup
- [ ] Environment variables added for Sentry DSN

---

### P3-2: Security Headers

**Problem Statement:**
Application missing critical security headers:

- No Content Security Policy (CSP)
- No HSTS (Strict-Transport-Security)
- No X-Frame-Options (clickjacking protection)
- No X-Content-Type-Options (MIME sniffing protection)
- No Referrer-Policy
- No Permissions-Policy
- No Referrer-Policy
- Fails security header checks (securityheaders.com)
- Vulnerable to XSS, clickjacking attacks

**Implementation Plan:**

1. **Add security headers middleware to Fastify**
   - Update `server.mjs` with `onRequest` hook
   - Add all standard security headers
   - Configure CSP for inline scripts/styles
   - Add Tailwind nonce support for CSP

2. **Configure Content Security Policy**
   - Allow self for scripts/styles
   - Allow cdn.mares.cz for images
   - Allow Google Analytics domains
   - Use nonces for inline scripts
   - Report violations to endpoint

3. **Add HSTS header**
   - Set max-age to 1 year (31536000)
   - Include subdomains
   - Consider preload directive

4. **Add remaining headers**
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: restrict features

5. **Test and validate**
   - Test with securityheaders.com
   - Verify CSP doesn't break functionality
   - Test analytics still works
   - Check browser console for violations

**Definition of Done:**

- [ ] Security headers middleware added to server.mjs
- [ ] All headers implemented (CSP, HSTS, X-Frame-Options, etc.)
- [ ] CSP configured to allow necessary resources
- [ ] CSP nonce support for inline scripts
- [ ] HSTS with 1-year max-age and includeSubDomains
- [ ] Site scores A+ on securityheaders.com
- [ ] Manual testing: all features work with CSP
- [ ] Google Analytics still functional
- [ ] No CSP violations in browser console
- [ ] Headers configurable via environment (strict/permissive modes)
- [ ] Documentation includes security header configuration
- [ ] HSTS preload considered and documented

---

## P3-3: Content Validation (Nice-to-Have)

**Problem Statement:**
No validation of content from Strapi CMS:

- Markdown content not validated before rendering
- Malformed dates could cause runtime errors
- Missing required fields might crash pages
- No schema version checking
- Potential XSS from malicious content
- No content sanitization

**Implementation Plan:**

1. **Extend Zod schemas for content validation**
   - Add markdown content validation
   - Validate URL formats
   - Check date formats
   - Validate required vs optional fields

2. **Add markdown sanitization**
   - Install sanitize-html: `pnpm add sanitize-html`
   - Configure allowed HTML tags
   - Sanitize before rendering
   - Allow safe subset (headings, lists, links, code blocks)

3. **Add date handling robustness**
   - Validate date strings before parsing
   - Handle invalid dates gracefully
   - Default to null for unparseable dates
   - Log validation warnings

4. **Add content schema versioning**
   - Add schema version field to CMS
   - Check version compatibility
   - Handle schema migrations
   - Log schema mismatches

**Definition of Done:**

- [ ] Zod schemas include content field validation
- [ ] Markdown content sanitized before rendering
- [ ] Invalid dates handled gracefully (default to null)
- [ ] URL fields validated as proper URLs
- [ ] Schema version checking implemented
- [ ] Validation errors logged with content context
- [ ] Invalid content doesn't crash pages
- [ ] Manual testing with malformed CMS data
- [ ] XSS testing with malicious markdown
- [ ] Documentation includes content validation approach

---

## P3-4: SEO Enhancements (Nice-to-Have)

**Problem Statement:**
Missing advanced SEO features:

- JSON-LD structured data incomplete (JSONLD.astro untracked)
- No Article schema for blog posts
- No breadcrumbs for navigation
- Missing Organization schema
- No FAQ schema for training pages
- Limited rich snippets in search results

**Implementation Plan:**

1. **Complete JSON-LD component**
   - Track `src/components/seo/JSONLD.astro`
   - Implement Article schema for blog posts
   - Add Organization schema for homepage
   - Add Course schema for training pages

2. **Add breadcrumb navigation**
   - Create breadcrumb component
   - Add BreadcrumbList schema
   - Show on blog posts and training pages
   - Style with Tailwind

3. **Enhance article metadata**
   - Add author information to Article schema
   - Add article publication/modification dates
   - Add article image URLs
   - Add reading time estimate

4. **Add FAQ schema for trainings**
   - Structure training content as FAQs
   - Add FAQPage schema
   - Improve training page rich snippets

**Definition of Done:**

- [ ] JSONLD.astro component tracked and implemented
- [ ] Article schema added to all blog posts
- [ ] Organization schema on homepage
- [ ] Course schema on training pages
- [ ] Breadcrumb component created
- [ ] BreadcrumbList schema added
- [ ] FAQ schema on appropriate pages
- [ ] Validated with Google Rich Results Test
- [ ] No schema validation errors
- [ ] Manual testing in search console
- [ ] Documentation includes schema implementation

---

## Summary Statistics

**Total Tasks:** 12

- **P0 (Critical):** 2 tasks
- **P1 (High):** 3 tasks
- **P2 (Medium):** 2 tasks
- **P3 (Low):** 5 tasks

**Estimated Effort:**

- **Quick wins (<4 hours):** P0-2, P1-1, P2-2, P3-2
- **Medium effort (4-8 hours):** P0-1, P1-2, P1-3, P2-1
- **Large effort (>8 hours):** P3-1, P3-3, P3-4

**Recommended Implementation Order:**

1. P0-2 (Error handling - quick, high impact)
2. P0-1 (Caching - medium effort, high impact)
3. P1-1 (Strapi errors - quick, important for stability)
4. P2-2 (K8s probes - quick, important for deployments)
5. P1-2 (Type safety - medium effort, reduces bugs)
6. P1-3 (Integration testing - medium effort, prevents regressions)
7. P2-1 (Pagination - medium effort, UX improvement)
8. P3-2 (Security headers - quick win)
9. P3-1 (Monitoring - large effort but critical long-term)
10. P3-3, P3-4 (Nice-to-have enhancements)
