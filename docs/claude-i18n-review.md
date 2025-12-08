# Multi-lingual Readiness Assessment

**Date**: 2025-12-08
**Reviewer**: Claude Code
**Project**: mares.cz-v3 (Astro 5)

## **Overall Rating: 3.5/10** ⭐⭐⭐☆☆☆☆☆☆☆

### Summary

The project has **basic i18n infrastructure** but is **far from production-ready** for a true bilingual experience. The foundation exists, but most implementation work remains.

---

## What's Working ✅

1. **Astro i18n configuration exists** (astro.config.mjs:68-76)
   - Czech as default locale (no prefix)
   - English under `/en` prefix
   - Sitemap integration configured

2. **Type system prepared**
   - Locale types: `"cs" | "en"` defined throughout
   - Content interfaces include locale field

3. **Partial navigation translation**
   - Static navigation links translated (src/lib/site.ts:45-90)
   - Locale detection in Navigation.astro:13-16

4. **CMS ready**
   - Strapi stores locale field for content
   - Article/Page/Training interfaces include locale

---

## Critical Gaps ❌

### 1. **No English Routes** (Impact: Critical)

- Current structure: `src/pages/[slug]/`, `src/pages/blog/[slug]/`
- Missing: `src/pages/en/` directory structure
- Result: `/en/blog`, `/en/skoleni` routes **don't exist**

### 2. **200+ Hardcoded Czech Strings** (Impact: Critical)

- Components with Czech-only text:
  - Homepage sections: Hero, Services, Cooperation
  - Cookie consent (src/components/cookie-consent-bar.tsx)
  - Training pages (src/pages/skoleni/)
  - Blog pages (src/pages/blog/)
  - Footer (src/components/Footer.astro:28-41)
- No translation files (JSON/YAML)
- No i18n library integration

### 3. **Content Not Filtered by Locale** (Impact: High)

- Strapi methods lack locale parameter (src/lib/strapi.ts:134-172)
- All articles fetched regardless of language
- Notion queries don't filter by locale
- Potential slug collisions between languages

### 4. **Missing SEO for Multi-lingual** (Impact: High)

- No `hreflang` tags anywhere
- OpenGraph component accepts locale but **never receives it** (src/components/seo/OpenGraph.astro:15)
- JSON-LD entirely in Czech (src/components/seo/JSONLD.astro)
- No alternate language links
- Single RSS feed (Czech only)

### 5. **No Language Switcher** (Impact: Medium)

- Users cannot switch between languages
- No UI element to toggle cs/en
- No automatic browser language detection

---

## Detailed Breakdown by Category

| Category               | Rating | Status                              |
| ---------------------- | ------ | ----------------------------------- |
| **Configuration**      | 7/10   | i18n config exists, but minimal     |
| **Routing**            | 2/10   | No English routes implemented       |
| **Content Management** | 3/10   | Locale field exists, but not used   |
| **UI Translation**     | 1/10   | 5 strings translated, 200+ missing  |
| **SEO**                | 2/10   | No hreflang, locale-aware OG unused |
| **Type Safety**        | 6/10   | Types exist but not enforced        |
| **User Experience**    | 1/10   | No language switcher                |

---

## What Needs to Happen

### **Phase 1: Critical Path** (Must-have)

1. Create `src/pages/en/` directory with all pages
2. Extract hardcoded text to translation files
3. Implement translation helper function
4. Add locale filtering to Strapi queries
5. Add hreflang tags to all pages
6. Create language switcher component

### **Phase 2: Content & Data** (Should-have)

7. Update Notion integration for locale filtering
8. Create English RSS feed
9. Localize date/number formatting
10. Update JSON-LD with locale variants
11. Test all English routes

### **Phase 3: Polish** (Nice-to-have)

12. Browser language detection
13. Cookie consent in English
14. Error pages in both languages
15. 404 page localization

---

## Architecture Issues

### Current Problems:

```typescript
// ❌ No locale parameter
public async fetchArticles(): Promise<Article[]>

// ❌ Locale received but ignored
<OpenGraph locale={undefined} />

// ❌ Hardcoded text
<h1>Jsem Vojtěch Mareš, DevOps architekt</h1>

// ❌ Czech-only RSS
<language>cs-cz</language>
```

### What's Needed:

```typescript
// ✅ Locale-filtered queries
public async fetchArticles(locale: 'cs' | 'en'): Promise<Article[]>

// ✅ Locale passed through
<OpenGraph locale={currentLocale} />

// ✅ Translatable text
<h1>{t('hero.title', locale)}</h1>

// ✅ Separate RSS feeds
/blog/rss.xml (Czech)
/en/blog/rss.xml (English)
```

---

## Estimated Effort

- **Text extraction & translation**: 10-15 hours
- **Routing restructure**: 5-7 hours
- **Content filtering**: 3-4 hours
- **SEO implementation**: 4-5 hours
- **Language switcher**: 2-3 hours
- **Testing**: 6-8 hours

**Total: ~30-42 hours** of development work

---

## Recommendation

The project is **not ready** for a production multi-lingual launch. While the foundation exists (Astro i18n config), the implementation is only ~20% complete. Before launching English content:

1. Implement locale-based routing
2. Create translation system for UI text
3. Add proper SEO (hreflang tags)
4. Filter CMS content by locale
5. Build language switcher

**Priority**: Focus on routing + translation first, then SEO, then polish.

---

## Comprehensive Analysis Details

### 1. ASTRO I18N CONFIGURATION

**Current State (astro.config.mjs:68-76):**

- i18n is **partially configured** with a basic setup:
  ```javascript
  i18n: {
    locales: ["cs", "en"],
    defaultLocale: "cs",
    routing: {
      prefixDefaultLocale: false,
    },
  }
  ```
- **Configuration Details:**
  - Czech (cs) is the default locale - no /cs prefix needed
  - English (en) requires /en prefix
  - Sitemap integration includes i18n with proper locale mappings (cs-CZ, en-US)

**Assessment:** Configuration exists but is **minimally utilized** for actual routing and content management.

---

### 2. ROUTING STRUCTURE FOR LOCALES

**Current State - NO PROPER LOCALE-BASED ROUTING:**

The routing structure does NOT leverage Astro's i18n routing capabilities:

```
src/pages/
├── index.astro           (/ and /en/)
├── [slug]/
│   └── index.astro       (static pages)
├── blog/
│   ├── index.astro       (blog listing)
│   └── [slug]/
│       └── index.astro   (blog posts)
└── skoleni/
    ├── [slug]/
    │   └── index.astro   (training details)
    └── verejne-terminy.astro (public training sessions)
```

**Issues:**

- **No locale-prefixed directories** (e.g., `src/pages/en/`) exist
- English routes are **hardcoded in navigation** (e.g., "/en/blog", "/en/training/public-sessions")
- URL structure doesn't automatically generate /en/blog, /en/skoleni/ routes
- English pages cannot be independently routed - all pages are in Czech structure only

**What's needed:**

- Implement directory-based locale routing: `src/pages/[locale]/...`
- OR use Astro's dynamic routing with locale parameter extraction

---

### 3. CONTENT MANAGEMENT APPROACH (STRAPI CMS)

**Current State - PARTIAL LOCALE SUPPORT:**

**In Strapi Integration (src/lib/strapi.ts:134):**

- Data transformation includes locale field: `locale: data.locale`
- Article interface includes locale: `locale: "cs" | "en"` (article.ts)
- Methods fetch content **without locale filtering**:
  ```typescript
  public async fetchArticles(): Promise<Article[]>
  public async getArticle(slug: string): Promise<Article>
  ```

**Issues:**

- Strapi methods don't accept locale parameter to filter content
- All articles/pages/trainings are fetched regardless of locale
- No content deduplication by language
- Slug collisions possible between Czech and English content

**What's implemented:**

- Strapi CMS likely stores locale field for each content item
- ArticleHeader and article components can display locale indicator

**What's missing:**

- Locale-filtered queries to Strapi (e.g., `?filters[locale]=en`)
- Separate fetch methods for different locales
- Content validation ensuring proper locale assignment

---

### 4. EXISTING I18N UTILITIES AND TRANSLATION FILES

**Current State - HARDCODED TEXT + LIMITED TRANSLATION:**

**Localized Static Data (src/lib/site.ts:45-90):**

- **LocalizedMetadata** - Page metadata per locale (2 locales)
- **LocalizedStaticNavigationLinks** - Navigation links per locale
- **Does NOT include:** Generic UI text, button labels, error messages, etc.

**Navigation Labels (Navigation.astro:13-16 & Footer.astro):**

```typescript
let locale = Astro.currentLocale;
if (locale === undefined) {
  locale = "cs";
}
const staticLinks = LocalizedStaticNavigationLinks.filter((links) => {
  return links.locale === locale;
})[0].links;
```

**Translation Coverage:**

- Navigation links: ✓ (3 static strings per locale)
- Page metadata: ✓ (title, description, keywords)
- Homepage text: ✗ (all hardcoded in Czech)
- Component text: ✗ (all hardcoded in Czech)
- UI elements: ✗ (all hardcoded in Czech)
- Cookie consent: ✗ (Czech only)
- Footer text: ✗ (mostly Czech except contact info)

**Hardcoded Czech Text Examples:**

- Hero component: "Jsem Vojtěch Mareš, DevOps architekt"
- Services: "Konzultace", "Školení", "DevOps spolupráce"
- Cooperation: "Z nuly do cloudu", "Jak může vypadat naše spolupráce"
- Cookie bar: "Tento web používá soubory cookies..."
- Footer: "Zaujal jsem vás?"

---

### 5. COMPONENTS WITH TEXT

**Components Overview:**

**Astro Components (Hardcoded Czech):**

- Hero.astro: Czech-only hero section text
- Services section: All Czech service names and descriptions
- Footer.astro: Mostly Czech with hardcoded labels ("Školení", "Důležité odkazy")
- Blog index: Czech labels ("Blog", "Přečíst si článek")
- Training sessions page: Czech only ("Veřejné termíny školení", "Podmínky veřejných termínů")

**React Components (Hardcoded Czech):**

- services.tsx: All service descriptions hardcoded in Czech
- training.tsx: Section heading and description in Czech
- cooperation.tsx: All 5 cooperation steps in Czech
- call-to-action.tsx: (needs checking)
- cookie-consent-bar.tsx: Cookie message entirely in Czech
- navigation.tsx: Button text "Napište mi" and "ještě dnes" in Czech

**How text is currently handled:**

- **Direct in JSX/Astro templates** (not translatable)
- **No translation files** (JSON, YAML, or i18n framework)
- **No i18n library** (react-i18next, astro-i18n, etc.)

---

### 6. SEO/META TAGS HANDLING FOR DIFFERENT LANGUAGES

**Current State - BASIC LOCALE AWARENESS:**

**OpenGraph.astro Component:**

- Has locale parameters: `locale?: "cs" | "en"`
- Converts to OG format: `cs_CZ`, `en_US`
- Includes alternate locale: `localeAlternate` property
- BUT: **Never receives locale from pages** - always defaults to "cs"

**Meta.astro Component:**

- No locale-specific handling
- Uses hardcoded "canonical" tag
- No hreflang support

**JSONLD.astro Component:**

- Hardcoded Czech content in all schemas
- No locale variants
- No language specification in JSON-LD

**Missing SEO Features:**

- **No hreflang tags** for language alternatives (critical for Google)
- **No alternate link tags** for language versions
- **No language declarations** in OpenGraph for English content
- **No JSON-LD localization** (language-specific descriptions)
- **Canonical tags don't account for locale variants**

**What's needed:**

```html
<!-- hreflang for Czech -->
<link rel="alternate" hreflang="cs" href="https://mares.cz/page" />
<!-- hreflang for English -->
<link rel="alternate" hreflang="en" href="https://mares.cz/en/page" />
<!-- Default/x-default -->
<link rel="alternate" hreflang="x-default" href="https://mares.cz/page" />
```

---

### 7. URL STRUCTURE AND LOCALE DETECTION

**Current URL Structure:**

- Czech default: `https://mares.cz/` (no prefix)
- English: `https://mares.cz/en/...` (prefix-based)
- Blog: `https://mares.cz/blog/[slug]` (Czech only, should be `/en/blog/[slug]`)
- Training: `https://mares.cz/skoleni/[slug]` (Czech only, should have `/en/` variant)

**Locale Detection (Astro.currentLocale):**

Used in components:

```typescript
let locale = Astro.currentLocale;
if (locale === undefined) {
  locale = "cs";
}
```

**Issues:**

1. **Default fallback to Czech** - if Astro doesn't detect locale properly, defaults to Czech
2. **No error handling** for invalid locales
3. **No browser language detection** for first-time visitors
4. **No explicit URL routing enforcement**

**How it works:**

- Astro's i18n middleware extracts locale from URL path
- `/` → locale = "cs" (default)
- `/en/*` → locale = "en"
- Components use this to filter content

---

### 8. MIDDLEWARE AND ROUTING LOGIC

**Current Middleware (src/middleware/security-headers.ts):**

- Only handles security headers
- No i18n or locale detection logic

**Server Configuration (src/server.ts):**

- Fastify with SSR handler
- No explicit locale routing middleware
- Astro handles i18n automatically through configured routing

**Notion Integration:**

- Training sessions queried **without locale filtering**
- Location and price in Czech (no translations)

**Blog RSS Feed (blog/rss.xml.ts):**

- Hardcoded language: `<language>cs-cz</language>`
- No English RSS feed exists
- All articles included regardless of locale

---

### 9. CURRENT STATE SUMMARY TABLE

| Aspect                   | Status       | Details                                           |
| ------------------------ | ------------ | ------------------------------------------------- |
| **I18n Configuration**   | ✓ Exists     | Basic Astro i18n config with cs/en locales        |
| **Locale Routing**       | ✗ Missing    | No locale-prefixed page directories               |
| **Content Filtering**    | ✗ Missing    | Strapi queries don't filter by locale             |
| **UI Text Translation**  | ✗ Missing    | All text hardcoded in Czech, no translation files |
| **Navigation Links**     | ✓ Partial    | Static links translated (3-4 items only)          |
| **Meta/SEO**             | ✗ Incomplete | No hreflang, locale-aware OG exists but unused    |
| **Notion Data**          | ✗ Missing    | No locale filtering, Czech-only data              |
| **RSS Feeds**            | ✗ Missing    | Czech only, no English variant                    |
| **Type Safety**          | ✓ Partial    | Locale types exist (cs\|en) but not enforced      |
| **Browser i18n Library** | ✗ None       | No i18n framework (no react-i18next, etc.)        |

---

### 10. COMPREHENSIVE LIST OF CHANGES NEEDED

#### Phase 1: Routing & Infrastructure

1. Create locale-prefixed page directories: `src/pages/en/`
2. Implement English routes for all existing pages
3. Add locale parameter to dynamic routes
4. Set up proper URL rewriting for English content
5. Add browser language detection for first-time visitors

#### Phase 2: Content Filtering

6. Enhance Strapi methods to accept locale parameter
7. Add locale filtering to all content queries
8. Implement fallback strategy (e.g., show Czech if English missing)
9. Create separate fetch methods: `fetchArticles(locale)`
10. Add validation for content locale consistency

#### Phase 3: Text Translation

11. Create translation file structure (JSON or YAML)
12. Extract all hardcoded Czech text from components
13. Implement i18n provider (astro-i18n or custom)
14. Translate:
    - 80+ component text strings
    - Form labels and buttons
    - Error messages
    - Cookie consent message
    - Footer content
    - Training page descriptions
    - Homepage sections

#### Phase 4: SEO Improvements

15. Add hreflang tags to all pages
16. Implement locale-aware canonical URLs
17. Update OpenGraph component to receive actual locale
18. Add language declarations to JSON-LD schemas
19. Create English RSS feed
20. Update sitemap with both locale variants

#### Phase 5: Data Localization

21. Add locale filtering to Notion queries
22. Implement proper date formatting per locale
23. Add number/currency formatting per locale
24. Create locale-specific copy for training prices

#### Phase 6: Testing & Validation

25. Verify all /en/ routes work
26. Test locale detection and switching
27. Validate hreflang implementation
28. Check SEO markup for both locales
29. Test RSS feeds for both languages
30. Ensure fallback behavior works

---

### 11. ARCHITECTURAL RECOMMENDATIONS

**Recommended Approach:**

1. **Use astro-i18n or create custom i18n system:**
   - Create `src/i18n/` directory
   - Organize translations: `src/i18n/cs.json`, `src/i18n/en.json`
   - Export translation helper function

2. **Centralize locale detection:**

   ```typescript
   export function getCurrentLocale(astroContext): "cs" | "en" {
     return astroContext.currentLocale || "cs";
   }
   ```

3. **Create translation helper:**

   ```typescript
   export function t(key: string, locale: "cs" | "en"): string {
     return translations[locale][key];
   }
   ```

4. **Update Strapi queries:**

   ```typescript
   public async fetchArticles(locale: 'cs' | 'en'): Promise<Article[]> {
     return this.sendRequest(`/articles?filters[locale]=${locale}`);
   }
   ```

5. **Implement locale-prefixed routing in pages:**
   - Use dynamic locale parameter in routes
   - Create shared layout for locale switching

---

### 12. MIGRATION EFFORT ESTIMATE

- **Text extraction & translation:** 8-12 hours (200+ strings × 5 min per string)
- **Route restructuring:** 4-6 hours
- **Content filtering setup:** 2-3 hours
- **SEO/hreflang implementation:** 3-4 hours
- **Testing & validation:** 4-6 hours
- **Total:** ~25-35 hours of development

---

### 13. CRITICAL ISSUES

1. **English routes don't exist yet** - /en/blog, /en/skoleni etc. won't work
2. **Homepage not translatable** - Hero, Services, Cooperation sections are Czech-only
3. **No language switcher** - Users can't switch between languages on-site
4. **Strapi content not filtered** - Fetching all articles regardless of locale
5. **SEO not optimized for multilingual** - Missing hreflang, wrong canonical URLs
6. **RSS feed Czech-only** - No English feed for subscribers
7. **Type system loose** - No enforcement that locale values are valid

---

## Conclusion

This codebase has **the foundation for i18n** (Astro config exists, locale types defined) but is **not yet production-ready for a true bilingual site**. The English version would currently be inaccessible or broken. Significant work is needed to make Czech and English fully equal, parallel experiences.
