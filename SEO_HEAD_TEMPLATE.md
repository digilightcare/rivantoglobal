# SEO-Optimized Head Template for Rivanto Pages

Use this template for all new pages to ensure consistent SEO optimization.

## Standard Head Section Template

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>[PAGE_TITLE] | Rivanto</title>

  <meta name="description" content="[PAGE_DESCRIPTION]" />

  <meta name="robots" content="[ROBOTS_DIRECTIVE]" />

  <link rel="canonical" href="https://rivantoglobal.com/[PAGE_URL]" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="[OG_TITLE]" />
  <meta property="og:description" content="[OG_DESCRIPTION]" />
  <meta property="og:url" content="https://rivantoglobal.com/[PAGE_URL]" />
  <meta property="og:site_name" content="Rivanto" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="[TWITTER_TITLE]" />
  <meta name="twitter:description" content="[TWITTER_DESCRIPTION]" />

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />

  <!-- Google Analytics (Replace G-XXXXXXXXXX with real ID) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>

  <!-- Structured Data: Organization -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rivanto",
    "url": "https://rivantoglobal.com/",
    "logo": "https://rivantoglobal.com/logo.png",
    "description": "Strategic hospitality revenue partner helping independent and boutique hotels improve retained profitability."
  }
  </script>

  <!-- Structured Data: WebPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "[SCHEMA_NAME]",
    "url": "https://rivantoglobal.com/[PAGE_URL]",
    "description": "[SCHEMA_DESCRIPTION]"
  }
  </script>

  <link rel="stylesheet" href="styles.css">
</head>
```

## Placeholders to Replace

- `[PAGE_TITLE]` - Specific page title
- `[PAGE_DESCRIPTION]` - Unique meta description (150-160 characters)
- `[ROBOTS_DIRECTIVE]` - Use "index, follow" for public pages, "noindex, follow" for thank-you/utility pages
- `[PAGE_URL]` - Full page URL (e.g., "about.html", "services.html")
- `[OG_TITLE]` - Open Graph title (can match page title)
- `[OG_DESCRIPTION]` - Open Graph description (can match meta description)
- `[TWITTER_TITLE]` - Twitter card title
- `[TWITTER_DESCRIPTION]` - Twitter card description
- `[SCHEMA_NAME]` - Schema.org WebPage name
- `[SCHEMA_DESCRIPTION]` - Schema.org description

## Robots Directives Guide

- **Public pages**: `index, follow`
- **Thank-you pages**: `noindex, follow`
- **Admin/utility pages**: `noindex, nofollow`

## Current Pages Updated

✅ index.html - Homepage with "index, follow"
✅ strategy-call.html - Landing page with "index, follow"  
✅ thank-you.html - Thank you page with "noindex, follow"

## Notes

- Always use consistent formatting with 2-space indentation
- Keep descriptions under 160 characters for optimal SERP display
- Update Google Analytics ID with real tracking ID when available
- Ensure canonical URLs match actual page locations
- Organization schema remains consistent across all pages
