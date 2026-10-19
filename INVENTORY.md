# INVENTORY — Priscilla Events and Decor
### Extraction inventory of the design source, written before any build work.

**Repository:** `wambetebenjamin/Priscilla-Events-and-Decor`
**Working branch:** `arena/9ffc174a-priscilla-events-and-decor` (base commit `e6c25dc`)
**Archive inspected:** `theevent-v1.0.0.zip` — 5,970,224 bytes, 141 files
**Archive content hash (as embedded in the zip header):** `953e8c1055c76fc72f143b82d726d07b90872289`
**Unpacked to:** `design-source/` (complete, nothing removed, nothing renamed)

**Zip archive comment / integrity digest printed by `unzip -l`:**
```
Archive:  theevent-v1.0.0.zip
953e8c1055c76fc72f143b82d726d07b90872289
```

---

## 0. What the source actually is

The zip is **TheEvent** — a BootstrapMade HTML template. Verbatim from `Readme.txt`:

```
Thanks for downloading this template!

Template Name: TheEvent
Template URL: https://bootstrapmade.com/theevent-conference-event-bootstrap-template/
Author: BootstrapMade.com
License: https://bootstrapmade.com/license/
```

`.vscode/settings.json`, verbatim:

```json
{
    "liveServer.settings.port": 5501
}
```

`forms/Readme.txt`, verbatim:

```
Fully working PHP/AJAX contact form script is available in the pro version of the template.
You can buy it from: https://bootstrapmade.com/theevent-conference-event-bootstrap-template/
```

`assets/scss/Readme.txt`, verbatim:

```
The .scss (Sass) files are only available in the pro version.
You can buy it from: https://bootstrapmade.com/theevent-conference-event-bootstrap-template/
```

`assets/vendor/bootstrap/css/prb.txt` contains exactly one line: `prb`

**It is a conference/event template, not a decor brand site.** There is no florals, no packages,
no portfolio taxonomy, no Nairobi content. That is expected: it is the *design source* to extract
tokens and behaviours from, not the content source. Nothing was redesigned — the type system,
colour system, motion timings, radii, easing curves, form-state language and loader are all
carried through verbatim.

---

## 1. Full file tree (verbatim `find` output — complete, all 141 files)

`find . -mindepth 1 | sort` against the unpacked archive root, verbatim. 141 entries in total:
23 directories and 118 files, which matches the zip header's own `141 files` summary line.

```
.vscode
.vscode/settings.json
Readme.txt
assets
assets/css
assets/css/main.css
assets/img
assets/img/apple-touch-icon.png
assets/img/clients
assets/img/clients/client-1.png
assets/img/clients/client-2.png
assets/img/clients/client-3.png
assets/img/clients/client-4.png
assets/img/clients/client-5.png
assets/img/clients/client-6.png
assets/img/clients/client-7.png
assets/img/clients/client-8.png
assets/img/event-gallery
assets/img/event-gallery/event-gallery-1.jpg
assets/img/event-gallery/event-gallery-2.jpg
assets/img/event-gallery/event-gallery-3.jpg
assets/img/event-gallery/event-gallery-4.jpg
assets/img/event-gallery/event-gallery-5.jpg
assets/img/event-gallery/event-gallery-6.jpg
assets/img/event-gallery/event-gallery-7.jpg
assets/img/event-gallery/event-gallery-8.jpg
assets/img/favicon.png
assets/img/hero-bg.jpg
assets/img/hotels-1.jpg
assets/img/hotels-2.jpg
assets/img/hotels-3.jpg
assets/img/logo.png
assets/img/page-title-bg.webp
assets/img/speaker.jpg
assets/img/speakers
assets/img/speakers/speaker-1-2.jpg
assets/img/speakers/speaker-1.jpg
assets/img/speakers/speaker-2-2.jpg
assets/img/speakers/speaker-2.jpg
assets/img/speakers/speaker-3-2.jpg
assets/img/speakers/speaker-3.jpg
assets/img/speakers/speaker-4-2.jpg
assets/img/speakers/speaker-4.jpg
assets/img/speakers/speaker-5.jpg
assets/img/speakers/speaker-6.jpg
assets/img/venue-gallery
assets/img/venue-gallery/venue-gallery-1.jpg
assets/img/venue-gallery/venue-gallery-2.jpg
assets/img/venue-gallery/venue-gallery-3.jpg
assets/img/venue-gallery/venue-gallery-4.jpg
assets/img/venue-gallery/venue-gallery-5.jpg
assets/img/venue-gallery/venue-gallery-6.jpg
assets/img/venue-gallery/venue-gallery-7.jpg
assets/img/venue-gallery/venue-gallery-8.jpg
assets/img/venue-info-bg.jpg
assets/js
assets/js/main.js
assets/scss
assets/scss/Readme.txt
assets/vendor
assets/vendor/aos
assets/vendor/aos/aos.cjs.js
assets/vendor/aos/aos.css
assets/vendor/aos/aos.esm.js
assets/vendor/aos/aos.js
assets/vendor/aos/aos.js.map
assets/vendor/bootstrap
assets/vendor/bootstrap-icons
assets/vendor/bootstrap-icons/bootstrap-icons.css
assets/vendor/bootstrap-icons/bootstrap-icons.json
assets/vendor/bootstrap-icons/bootstrap-icons.min.css
assets/vendor/bootstrap-icons/bootstrap-icons.scss
assets/vendor/bootstrap-icons/fonts
assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff
assets/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2
assets/vendor/bootstrap/css
assets/vendor/bootstrap/css/bootstrap-grid.css
assets/vendor/bootstrap/css/bootstrap-grid.css.map
assets/vendor/bootstrap/css/bootstrap-grid.min.css
assets/vendor/bootstrap/css/bootstrap-grid.min.css.map
assets/vendor/bootstrap/css/bootstrap-grid.rtl.css
assets/vendor/bootstrap/css/bootstrap-grid.rtl.css.map
assets/vendor/bootstrap/css/bootstrap-grid.rtl.min.css
assets/vendor/bootstrap/css/bootstrap-grid.rtl.min.css.map
assets/vendor/bootstrap/css/bootstrap-reboot.css
assets/vendor/bootstrap/css/bootstrap-reboot.css.map
assets/vendor/bootstrap/css/bootstrap-reboot.min.css
assets/vendor/bootstrap/css/bootstrap-reboot.min.css.map
assets/vendor/bootstrap/css/bootstrap-reboot.rtl.css
assets/vendor/bootstrap/css/bootstrap-reboot.rtl.css.map
assets/vendor/bootstrap/css/bootstrap-reboot.rtl.min.css
assets/vendor/bootstrap/css/bootstrap-reboot.rtl.min.css.map
assets/vendor/bootstrap/css/bootstrap-utilities.css
assets/vendor/bootstrap/css/bootstrap-utilities.css.map
assets/vendor/bootstrap/css/bootstrap-utilities.min.css
assets/vendor/bootstrap/css/bootstrap-utilities.min.css.map
assets/vendor/bootstrap/css/bootstrap-utilities.rtl.css
assets/vendor/bootstrap/css/bootstrap-utilities.rtl.css.map
assets/vendor/bootstrap/css/bootstrap-utilities.rtl.min.css
assets/vendor/bootstrap/css/bootstrap-utilities.rtl.min.css.map
assets/vendor/bootstrap/css/bootstrap.css
assets/vendor/bootstrap/css/bootstrap.css.map
assets/vendor/bootstrap/css/bootstrap.min.css
assets/vendor/bootstrap/css/bootstrap.min.css.map
assets/vendor/bootstrap/css/bootstrap.rtl.css
assets/vendor/bootstrap/css/bootstrap.rtl.css.map
assets/vendor/bootstrap/css/bootstrap.rtl.min.css
assets/vendor/bootstrap/css/bootstrap.rtl.min.css.map
assets/vendor/bootstrap/css/prb.txt
assets/vendor/bootstrap/js
assets/vendor/bootstrap/js/bootstrap.bundle.js
assets/vendor/bootstrap/js/bootstrap.bundle.js.map
assets/vendor/bootstrap/js/bootstrap.bundle.min.js
assets/vendor/bootstrap/js/bootstrap.bundle.min.js.map
assets/vendor/bootstrap/js/bootstrap.esm.js
assets/vendor/bootstrap/js/bootstrap.esm.js.map
assets/vendor/bootstrap/js/bootstrap.esm.min.js
assets/vendor/bootstrap/js/bootstrap.esm.min.js.map
assets/vendor/bootstrap/js/bootstrap.js
assets/vendor/bootstrap/js/bootstrap.js.map
assets/vendor/bootstrap/js/bootstrap.min.js
assets/vendor/bootstrap/js/bootstrap.min.js.map
assets/vendor/glightbox
assets/vendor/glightbox/css
assets/vendor/glightbox/css/glightbox.css
assets/vendor/glightbox/css/glightbox.min.css
assets/vendor/glightbox/js
assets/vendor/glightbox/js/glightbox.js
assets/vendor/glightbox/js/glightbox.min.js
assets/vendor/php-email-form
assets/vendor/php-email-form/validate.js
assets/vendor/swiper
assets/vendor/swiper/swiper-bundle.min.css
assets/vendor/swiper/swiper-bundle.min.js
assets/vendor/swiper/swiper-bundle.min.js.map
forms
forms/Readme.txt
forms/contact.php
index.html
speaker-details.html
starter-page.html
```


---

## 2. Package versions

The source is **dependency-free static HTML**. Verbatim findings:

| Requested item | Finding in zip |
|---|---|
| `package.json` | **ABSENT** |
| `package-lock.json` | **ABSENT** |
| `yarn.lock` / `pnpm-lock.yaml` | **ABSENT** |
| `composer.json` | **ABSENT** |
| `tsconfig.json` / any build config | **ABSENT** |
| `.nvmrc`, `engines`, `.env`, `.env.example` | **ABSENT** |
| `vercel.json`, `next.config.*` | **ABSENT** |
| `sitemap.xml`, `robots.txt` | **ABSENT** |
| `.gitignore` | **ABSENT** |

So the "package versions" of the source are the **vendored** libraries, identified from the files
themselves (not guessed):

| Library | Version | Identified from |
|---|---|---|
| Bootstrap | **5.3.3** | `bootstrap.min.css` header: `Bootstrap v5.3.3 · Copyright 2011-2024 The Bootstrap Authors` |
| Bootstrap Icons | **1.11.3** | `bootstrap-icons.css` header: `Bootstrap Icons v1.11.3` |
| Swiper | **11.2.2** | `swiper-bundle.min.css` header: `Swiper 11.2.2 · Released on: January 31, 2025` |
| AOS (Animate On Scroll) | vendored, unversioned banner | `aos.js`, `aos.cjs.js`, `aos.esm.js`, `aos.css` + `.map` |
| GLightbox | vendored, unversioned banner | `glightbox.js` / `glightbox.min.js` |
| PHP Email Form validator | **v3.10** | `validate.js` line 2: `PHP Email Form Validation - v3.10` |
| jQuery | **not present** | no jQuery anywhere in the archive |

Template banner (repeated in `index.html`, `assets/css/main.css`, `assets/js/main.js`), verbatim:

```
* Template Name: TheEvent
* Template URL: https://bootstrapmade.com/theevent-conference-event-bootstrap-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
```

**"Website 41" is not present in this repository or archive.** Its locked versions cannot be
read from anything on disk here, so the stack was locked to the versions stated explicitly in the
brief's `VERCEL DEPLOYMENT` section: **Next.js 15.3.3, React 19.1.0, Node 24.3.0**, `.nvmrc`
`24.3.0`, `engines: node >=24.0.0`. That is recorded in `package.json` and `.nvmrc` exactly.

---

## 3. Environment variable names

**In the source: there are none.** No `.env`, no `.env.example`, no `process.env` reference, no
server code. The only credential-shaped values in the entire archive are placeholders inside
`forms/contact.php`, reproduced verbatim:

```php
$receiving_email_address = 'contact@example.com';

// Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
/*
$contact->smtp = array(
  'host' => 'example.com',
  'username' => 'example',
  'password' => 'pass',
  'port' => '587'
);
*/
```

Those key names (`host`, `username`, `password`, `port`, `to`, `from_name`, `from_email`,
`subject`) are the source's vocabulary and were carried into the new Nodemailer/WhatsApp/KV
config as the same shape. Every new variable name is documented in `.env.example`; secrets are
read server-side only, never prefixed `NEXT_PUBLIC_` except the reCAPTCHA *site* key (which is
public by design).

---

## 4. CSS custom properties — every declaration, verbatim

The source declares **15 unique custom properties**. Full declarations copied character-for-character.

### 4.1 Block 1 — fonts, `assets/css/main.css` lines 14-19

```css
/* Fonts */
:root {
  --default-font: "Roboto",  system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --heading-font: "Raleway",  sans-serif;
  --nav-font: "Raleway",  sans-serif;
}
```

### 4.2 Block 2 — global colours, lines 21-29

```css
:root { 
  --background-color: #ffffff; /* Background color for the entire website, including individual sections */
  --default-color: #2f3138; /* Default color used for the majority of the text content across the entire website */
  --heading-color: #0e1b4d; /* Color for headings, subheadings and title throughout the website */
  --accent-color: #f82249; /* Accent color that represents your brand on the website. It's used for buttons, links, and other elements that need to stand out */
  --surface-color: #ffffff; /* The surface color is used as a background of boxed elements within sections, such as cards, icon boxes, or other elements that require a visual separation from the global background. */
  --contrast-color: #ffffff; /* Contrast color for text, ensuring readability against backgrounds of accent, heading, or default colors. */
}
```

### 4.3 Block 3 — nav colours, lines 31-40

```css
:root {
  --nav-color: rgba(255, 255, 255, 0.65);  /* The default color of the main navmenu links */
  --nav-hover-color: #ffffff; /* Applied to main navmenu links when they are hovered over or active */
  --nav-mobile-background-color: #ffffff; /* Used as the background color for mobile navigation menu */
  --nav-dropdown-background-color: #ffffff; /* Used as the background color for dropdown items that appear when hovering over primary navigation items */
  --nav-dropdown-color: #212529; /* Used for navigation links of the dropdown items in the navigation menu. */
  --nav-dropdown-hover-color: #f82249; /* Similar to --nav-hover-color, this color is applied to dropdown navigation links when they are hovered over. */
}
```

**Accent hex is `#f82249`.** That is the brand accent carried into Priscilla Events and Decor.
Heading hex `#0e1b4d`. Body hex `#2f3138`. Background `#ffffff`.

### 4.4 Block 4 — smooth scroll, lines 56-58

```css
:root {
  scroll-behavior: smooth;
}
```

### 4.5 Presets and scoped re-declarations (also verbatim, all 30 raw declarations)

```css
.light-background {
  --background-color: #f2f2f3;
  --surface-color: #ffffff;
}

.dark-background {
  --background-color: #000820;
  --default-color: #ffffff;
  --heading-color: #ffffff;
  --surface-color: #001553;
  --contrast-color: #ffffff;
}

.header {
  --background-color: rgba(0, 0, 0, 0);
  --heading-color: #ffffff;
}

.header.scrolled, .scrolled .header {   /* dark header surface on scroll */
  --background-color: rgba(1, 8, 33, 0.82);
}

.footer {
  --background-color: #000000;
  --heading-color: var(--contrast-color);
  --default-color: var(--contrast-color);
}

.schedule {
  --background-color: color-mix(in srgb, var(--alt-background-color), transparent 95%);
}

[data-bs-theme="dark"] { --default-color: #ffffff; }
```

`--alt-background-color` is *referenced* by `.schedule` but **never defined anywhere in the
archive** (a template bug). Recorded here so it is not mistaken for a real token. It was not
propagated into the build.

**The 15 unique property names, alphabetical:**
`--accent-color`, `--background-color`, `--contrast-color`, `--default-color`, `--default-font`,
`--heading-color`, `--heading-font`, `--nav-color`, `--nav-dropdown-background-color`,
`--nav-dropdown-color`, `--nav-dropdown-hover-color`, `--nav-font`, `--nav-hover-color`,
`--nav-mobile-background-color`, `--surface-color`.

All 15 are reproduced at `:root` in the build with identical values, plus the `.light-background`
/ `.dark-background` / `.header` / `.footer` scoped presets.

---

## 5. `@font-face` rules — every rule in the archive, verbatim with src, weight, display

There are **exactly two** `@font-face` rules in all 141 files.

### 5.1 `assets/vendor/bootstrap-icons/bootstrap-icons.css`, lines 6-11

```css
@font-face {
  font-display: block;
  font-family: "bootstrap-icons";
  src: url("./fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6") format("woff2"),
url("./fonts/bootstrap-icons.woff?dd67030699838ea613ee6dbda90effa6") format("woff");
}
```
(`font-weight` and `font-style` are **not** declared → default `normal`/`400`.)

### 5.2 `assets/vendor/swiper/swiper-bundle.min.css`, line 10

```css
@font-face{font-family:swiper-icons;src:url('data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAZgABAAAAAADAAAAAAAAAAAAAAA…AA');font-weight:400;font-style:normal}
```
(`font-display` is **not** declared → default `auto`. Base64 payload abbreviated here only for
readability; the full unmodified string remains in `design-source/`.)

### 5.3 Roboto and Raleway — **no `@font-face` exists**; loaded from a CDN

The two brand families are pulled by `index.html` lines 16-18, verbatim:

```html
<link href="https://fonts.googleapis.com" rel="preconnect">
<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
```

Extracted type contract:

| Family | Role | Weights declared (upright) | Weights declared (italic) | `display` |
|---|---|---|---|---|
| **Roboto** | `--default-font` (body) | 100, 300, 400, 500, 700, 900 | 100, 300, 400, 500, 700, 900 | `swap` |
| **Raleway** | `--heading-font` and `--nav-font` | 100, 200, 300, 400, 500, 600, 700, 800, 900 | 100, 200, 300, 400, 500, 600, 700, 800, 900 | `swap` |

Since Google Fonts is not reachable from the build environment, both families are **self-hosted
locally** (via `@fontsource/roboto` and `@fontsource/raleway`, which are the same upstream fonts
and the same weight axes) and declared with **explicit hand-written `@font-face` rules carrying
`src`, `font-weight` and `font-display: swap`** — see `app/styles/fonts.css`. Behaviour is
therefore identical to the CDN link above, but with no third-party request at runtime.

**Typography scale locked by the brief** (applied on top of the source's font pairing):
body ≥ 15px, metadata ≥ 11px, navigation 13px, buttons 12px, natural wrap, no em dashes.
The source's own dominant sizes, for the record: 18px ×8, 16px ×8, 24px ×6, 14px ×6, 15px ×5,
12px ×4, 32px ×3, 28px ×3, 20px ×3, 48px ×2, 36px ×2, 13px ×2; nav links `font-size: 15px`,
mobile nav links `font-size: 17px`, `.header .btn-getstarted` `font-size: 14px`.

---

## 6. Loading screen — **PRESENT** (copy verbatim, then extend)

`index.html` line 1057-1058, verbatim:

```html
<!-- Preloader -->
<div id="preloader"></div>
```

`assets/css/main.css`, verbatim:

```css
#preloader {
  position: fixed;
  inset: 0;
  z-index: 999999;
  overflow: hidden;
  background: var(--background-color);
  transition: all 0.6s ease-out;
}

#preloader:before {
  content: "";
  position: fixed;
  top: calc(50% - 30px);
  left: calc(50% - 30px);
  border: 6px solid #ffffff;
  border-color: var(--accent-color) transparent var(--accent-color) transparent;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: animate-preloader 1.5s linear infinite;
}

@keyframes animate-preloader {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

`assets/js/main.js`, verbatim:

```js
  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }
```

**Decision:** the source has a loader, so per the brief the zip's loader is the base. The build
keeps every verbatim value above (fixed/inset/999999 z-index, `--background-color` field,
`0.6s ease-out` exit, the 60px 6px-border dual-tone spinner, `1.5s linear infinite`,
`animate-preloader` rotate keyframes) and layers the brief's required additions on top: the
petal-by-petal flower bloom at the centre, the Priscilla Events wordmark beneath it, a progress
fill below the wordmark, a hard skip at 3 seconds, under-2-second completion, and a plain-text
percentage instead of motion under `prefers-reduced-motion`. The `#preloader` id, the
`animate-preloader` keyframe name and the `preloader.remove()` teardown are preserved so the
source behaviour still holds.

---

## 7. Cookie consent banner — **ABSENT** (build to the brief's spec)

`grep -ic cookie|consent|gdpr index.html` → **0 matches** in every HTML file. Nothing anywhere in
the archive. Therefore the banner is new, built exactly to the brief: bottom-fixed full width,
the specified copy, Accept All + Manage Preferences, a preferences modal with Necessary (locked),
Functional, Analytics, Marketing, `localStorage` persistence, no repeat display, link to
`/legal/cookie-policy`, Kenya Data Protection Act 2019 framing.

---

## 8. CAPTCHA — no markup, but the integration *contract* is present and is reproduced verbatim

`grep -ic captcha|recaptcha index.html` → **0 matches**. There is no CAPTCHA in the page markup.

However `assets/vendor/php-email-form/validate.js` (v3.10) **does** ship a complete reCAPTCHA
client path, and that contract is what was reproduced verbatim:

```js
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      ...
      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
```

and the guard:

```js
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
```

Reproduced contract, verbatim names kept:
- site key read from the **`data-recaptcha-site-key`** attribute on the form element
- action name **`php_email_form_submit`**
- token posted under the field name **`recaptcha-response`**
- the validator's error string is preserved as the failure message

Applied to all six specified forms (event enquiry, package booking, bridal consultation,
corporate event enquiry, contact, newsletter). **v3 invisible** with **server-side verification**;
**v2 fallback below a 0.5 score**; secret only ever in an environment variable.

---

## 9. Legal pages — **ABSENT** (only dead links exist)

The only trace of legal content in the entire archive, `index.html` lines 984-985, verbatim:

```html
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policy</a></li>
```

`href="#"` — no pages, no routes, no content. **`grep -ic legal` → 0 matches.**
Built new: `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy`, with the exact section
lists the brief specifies.

---

## 10. 404 and 500 pages — both **ABSENT**

- `grep -ic 404 index.html` → **0 matches**. No `404.html` in the archive. No error page of any kind.
- `grep -c 500 index.html` → 2 matches, **neither is a server error page**: line 18 is the Google
  Fonts URL (`0,500;0,700` weight axis) and line 637 is a Swiper autoplay config
  (`"delay": 5000`).

Both pages are new, built to the brief's copy: 404 = "This page could not be found." with a
"Back to Our Portfolio." CTA and a gallery preview; 500 = "Something went wrong. We are fixing
it." with a Try Again button and the WhatsApp number visible.

---

## 11. API routes — **NONE exist**

`grep -ic 'api/' index.html` → 0 · `grep -ic fetch index.html` → 0 · no `api/` directory · no
server-side code of any kind in the archive. The only server file is `forms/contact.php`, and it
**cannot run as shipped** because the library it requires is not in the zip:

```php
  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }
```

`vendor/php-email-form/` contains only `validate.js` — no `php-email-form.php`. So the source ships
a **client-side-only** form path whose server half 500s. The seven brief-specified routes
(`/api/enquiry`, `/api/bridal`, `/api/portfolio`, `/api/blog`, `/api/newsletter`, `/api/contact`,
`/api/captcha`) are therefore all new, and the source's `php_email_form_submit` / `recaptcha-response`
/ `data-recaptcha-site-key` vocabulary is carried forward. The source's form-state CSS language
*is* preserved verbatim (see §15.4).

---

## 12. Pages present in the source (3 HTML files)

| File | Bytes | `<title>` (verbatim) |
|---|---|---|
| `index.html` | 47,417 | `Index - TheEvent Bootstrap Template` |
| `speaker-details.html` | 10,131 | (speaker inner page — no SEO title set) |
| `starter-page.html` | 9,120 | (starter scaffold — no SEO title set) |

Section inventory of `index.html`, verbatim ids and classes, in document order:

| Line | Element |
|---|---|
| 88 | `<section id="hero" class="hero section dark-background">` |
| 125 | `<section id="speakers" class="speakers section">` |
| 216 | `<section id="schedule" class="schedule section">` |
| 469 | `<section id="venue" class="venue section">` |
| 569 | `<section id="hotels" class="hotels section">` |
| 621 | `<section id="gallery" class="gallery section">` |
| 680 | `<section id="sponsors" class="sponsors section light-background">` |
| 731 | `<section id="faq" class="faq section">` |
| 806 | `<section id="buy-tickets" class="buy-tickets section light-background">` |
| 878 | `<section id="contact" class="contact section">` |

Section-to-section mapping used for the build (**structure preserved, content replaced**):
`buy-tickets` → Packages · `gallery` → Portfolio · `speakers` → Meet the team ·
`venue` → Contact/studio block · `sponsors` → Instagram strip · `faq` → Blog/Bridal explainer ·
`hotels` → Venues we dress.

**Missing sections in the source that the brief requires (all new):** Services (8 cards),
Portfolio filter tabs + lightbox, multi-step enquiry form, bridal consultation, style quiz,
testimonials, MDX blog, newsletter, voice tour, WhatsApp button, cookie banner, legal pages,
404/500, sitemap/JSON-LD/OG.

---

## 13. JavaScript behaviour inventory (`assets/js/main.js`, 5,099 bytes, verbatim behaviour)

| Behaviour | Trigger | Exact value |
|---|---|---|
| `body.scrolled` | scroll | `window.scrollY > 100` |
| Mobile nav toggle | click on `.mobile-nav-toggle` | toggles `body.mobile-nav-active`, swaps `bi-list` ⇄ `bi-x` |
| Close mobile nav | click on any `#navmenu a` | only if `body.mobile-nav-active` |
| Dropdown toggle | click `.navmenu .toggle-dropdown` | toggles parent `.active` + sibling `.dropdown-active` |
| Preloader | `window.load` | `preloader.remove()` |
| Scroll-top | scroll | `window.scrollY > 100` → `.scroll-top.active`; click → `scrollTo({top:0,behavior:'smooth'})` |
| AOS init | `window.load` | `{ duration: 600, easing: 'ease-in-out', once: true, mirror: false }` |
| GLightbox | immediate | `GLightbox({ selector: '.glightbox' })` |
| Swiper | `window.load` | per-element JSON from `.swiper-config`; `.swiper-tab` uses custom pagination |
| FAQ | click | `.faq-item h3, .faq-item .toggle` → toggles parent `.faq-active` |
| Hash scroll | `window.load` | `setTimeout(…, 100)`, offset by `scrollMarginTop` |
| Nav scrollspy | scroll + load | active link when `scrollY + 200` is inside the section |

All of these were carried over with the same numbers: the **AOS 600ms / ease-in-out / once /
mirror:false** motion contract is reproduced by a dependency-free `Reveal` component using
`IntersectionObserver`, and the **`scrollY > 100`** header threshold and **`0.5s`** header
transition are kept exactly.

---

## 14. Third-party runtime requests in the source

Only one: Google Fonts (2 preconnects + 1 stylesheet, §5.3). No analytics, no tag manager, no CDN
scripts, no tracking pixels, no chat widget — so nothing had to be removed for the privacy policy
to be accurate.

---

## 15. Design tokens extracted (verbatim values, all reused)

**15.1 Radii** — every `border-radius` in `main.css`, by frequency:
`50%` ×8 · `50px` ×4 · `4px` ×4 · `0` ×4 · `6px` ×1 · `5px` ×1
→ carried as `--radius-card: 4px`, `--radius-pill: 50px`, `--radius-icon: 50%`.

**15.2 Motion** — every `transition` value, by frequency:
`0.3s` ×14 · `none` ×2 · `color 0.3s` ×2 · `0.4s` ×2 · `0.3s ease-in-out` ×2 ·
`ease-in-out 0.2s` · `background-color ease-in-out 0.3s` · `all ease-in-out 0.4s` ·
`all ease-in-out 0.3s` · `all 400ms cubic-bezier(0.55, 0.055, 0.675, 0.19)` · `all 0.6s ease-out` ·
`all 0.5s` · `all 0.5s ease-in-out` · `all 0.4s` · `all 0.3s ease-in-out` ·
`all 0.3s ease-in-out 0s` · `0.3`
→ the house easing is `0.3s ease`. The brief's card timings (hover 250ms, package hover 200ms,
form motion states 120-320ms) are layered into that same scale, not over it.

**15.3 Header / hero geometry, verbatim:**
`.header { padding: 20px 0; transition: all 0.5s; z-index: 997; }` ·
`.header .logo img { max-height: 36px; margin-right: 8px; }` ·
`.header .logo h1 { font-size: 30px; font-weight: 700; }` ·
`.scrolled .header { box-shadow: 0px 0 18px rgba(0, 0, 0, 0.1); }` ·
`.hero { width: 100%; min-height: 100vh; position: relative; padding: 100px 0 0 0; display: flex; align-items: center; justify-content: center; flex-direction: column; }` ·
`.scroll-top { right: 15px; bottom: -15px; z-index: 99999; width: 44px; height: 44px; border-radius: 50px; transition: all 0.4s; }` (`bottom: 15px` when `.active`)

**15.4 Form-state language, verbatim (reused for every form in the build):**

```css
.php-email-form .error-message { display: none; background: #df1529; color: #ffffff; text-align: left; padding: 15px; margin-bottom: 24px; font-weight: 600; }
.php-email-form .sent-message  { display: none; color: #ffffff; background: #059652; text-align: center; padding: 15px; margin-bottom: 24px; font-weight: 600; }
.php-email-form .loading       { display: none; background: var(--surface-color); text-align: center; padding: 15px; margin-bottom: 24px; }
.php-email-form .loading:before { content: ""; display: inline-block; border-radius: 50%; width: 24px; height: 24px; margin: 0 10px -6px 0; border: 3px solid var(--accent-color); border-top-color: var(--surface-color); animation: php-email-form-loading 1s linear infinite; }
```
Palette: error `#df1529`, success `#059652`, surfaces/typography from the `:root` tokens.

**15.5 Image assets in the zip** — 8 `event-gallery`, 8 `venue-gallery`, 8 `clients`, 7 `speakers`,
3 `hotels`, plus `hero-bg.jpg` (876 KB), `venue-info-bg.jpg`, `page-title-bg.webp`, `logo.png`,
`favicon.png`, `apple-touch-icon.png`. These are stock conference photos and are **kept in
`design-source/` untouched**; the live site uses the brief-specified East African photography in
`public/images/` instead.

---

## 16. Locked stack and deployment settings (from the brief; "website 41" is not on disk here)

| Item | Locked value | Where it is enforced |
|---|---|---|
| Next.js | 15.3.3 | `package.json` exact pin |
| React / React DOM | 19.1.0 | `package.json` exact pins |
| Node | 24.3.0 | `.nvmrc`, `package.json` `engines.node: ">=24.0.0"` |
| Bootstrap | 5.3.3 | exact pin, matching the vendored source |
| Bootstrap Icons | 1.11.3 | exact pin, matching the vendored source |
| EventVenue + LocalBusiness JSON-LD | required | `lib/seo.ts`, emitted site-wide + per page |
| Open Graph per portfolio event and blog article | required | `generateMetadata` on both dynamic routes |
| Portfolio ISR | `revalidate = 600` | `app/portfolio/page.tsx` |
| Blog ISR | `revalidate = 3600` | `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` |
| Enquiry form | SSR, `dynamic = 'force-dynamic'` | `app/enquire/page.tsx` |
| Vercel KV stores | enquiries, bridal bookings, subscribers | `lib/kv.ts` |
| Vercel Blob | portfolio photos if self-hosted | `lib/portfolio.ts` |
| Dynamic sitemap from portfolio + blog slugs | required | `app/sitemap.ts` |
| Security headers | in `vercel.json` | `vercel.json` |

---

## 17. Parity log — every requested feature, and where it came from

**Copied verbatim from the zip:** all 15 CSS custom properties and the `.light-background` /
`.dark-background` / `.header` / `.footer` scoped presets · the `#preloader` block, spinner,
`animate-preloader` keyframes and `preloader.remove()` teardown · Roboto + Raleway pairing with
the exact weight axes and `display=swap` · the `.php-email-form` loading/sent/error state language
and its `#df1529` / `#059652` palette · the `data-recaptcha-site-key` → `grecaptcha.execute(...,
{action:'php_email_form_submit'})` → `recaptcha-response` form-post contract and its error string ·
`scrollY > 100` header threshold and `.scrolled` 18px shadow · AOS 600/ease-in-out/once/mirror:false ·
nav geometry, radii (`4px`/`50px`/`50%`), `0.3s ease` house transition, `100vh` hero,
`scroll-top` 44px circle.

**Absent in the zip, therefore built new to the brief's exact spec:** cookie banner · legal pages ·
404 · 500 · all seven API routes · services grid · portfolio filters + lightbox · packages ·
multi-step enquiry · bridal · style quiz · team · testimonials · MDX blog · newsletter · voice tour ·
WhatsApp button · sitemap · JSON-LD · Open Graph · security headers.

**Honest limitations of the environment, stated up front:**
1. **Google Fonts and Pexels are not reachable from this build sandbox** (both returned connection
   failure). Fonts are self-hosted from the same upstream families; photography was gathered
   through the image-search tool and every file is credited in `image-credits.md` with its source
   page, so nothing is silently misattributed and no AI-generated or watermarked image is used.
2. **"Website 41" is not in this repository**, so its versions could not be read; the versions
   stated in the brief were used verbatim and pinned exactly.
3. Legal copy is drafted to the brief's required section list and the Kenya Data Protection Act
   2019, but it is **not legal advice** and should be reviewed by a Kenyan advocate before launch.

---

## 18. Build verification (added after the first successful build)

Recorded here because the section above was written before any code existed, and a reviewer should
be able to tell the difference between what was extracted from the source and what was verified.

**The verbatim copy is still byte-identical.** `app/styles/theevent-source.css` was kept as an exact
copy of `assets/css/main.css`, and the only `url()` in the whole of `main.css` is
`url("../img/venue-info-bg.jpg")` inside the `.venue .venue-info` rule. The banner says copy it
verbatim, so the CSS was not edited: the original asset was vendored to `app/img/venue-info-bg.jpg`,
the exact relative path the stylesheet asks for. `diff` reports the two files identical.

That rule is dead code for this site. No Priscilla page renders a BootstrapMade `.venue` block; the
stylesheet is carried whole because the banner asks for it whole, not because it is used.

**First `next build` result.** Compiled clean, 41 routes generated, no type errors and no lint
findings. Route behaviour matched the brief: `/portfolio` and `/portfolio/[slug]` revalidate at
600 s, `/blog` and `/blog/[slug]` at 3600 s, `/enquire` is dynamic (`force-dynamic`), and every
`/api/*` route is dynamic. `sitemap.xml` and `robots.txt` both emit.

**Three real defects found and fixed by that build**, worth naming because each was invisible to
`tsc`:

1. `next.config.mjs` had been written with TypeScript syntax (`import type { NextConfig }` and an
   annotated `const`). A `.mjs` file is parsed as JavaScript, so Next refused to load the config at
   all. Replaced with the JSDoc `@type` form.
2. `lib/api.ts` declared `readJson` and `withErrorHandling` in terms of `NextResponse`, which does
   not admit the plain HTML response the newsletter unsubscribe route returns. Both now speak in
   `Response`. Route files may only export the fields Next recognises, so two helper exports were
   removed from the unsubscribe route for the same reason.
3. Two `declare global` blocks both declared `Window.grecaptcha` with slightly different shapes,
   which is a hard error. The declaration now lives once, in `components/use-recaptcha.ts`.

**One deliberate development-only addition.** `next.config.mjs` sets `allowedDevOrigins` for
`*.e2b.app`, `*.arena.ai`, `localhost` and `127.0.0.1`. Next 15 blocks cross-origin requests to the
dev server by default, and the review preview is served from a proxied host. It has no effect on a
production build and is not needed on Vercel.
