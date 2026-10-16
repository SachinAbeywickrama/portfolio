# Sachin Abeywickrama — Portfolio

A Next.js 16 / React 19 portfolio closely adapting the layout and interaction patterns of [mijobello.com](https://mijobello.com/), with Sachin’s content, supplied personal media, and an Obsidian & Lime palette (near-black `#141613`, ivory `#F0F0E8`, lime `#D2F55A`). Dark mode is the default; the alternate light theme is saved independently of earlier palette preferences.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Build with `npm run build`, serve with `npm start`, and run the concurrency-engine checks with `npm test`.

## Experience

- The header contains a live world-clock strip, a theme toggle, and a slide-down navigation panel.
- The desktop hero pairs a film with a portrait; mobile stacks the film, portrait, name, and roles.
- Biography, project selector, services, and contact follow the reference’s bordered grid. On desktop, the biography photograph expands from its side panel to a full-width frame as you scroll; scrolling back reverses it. Mobile and reduced-motion layouts keep the photograph static.
- Projects use directional slide transitions. Browse with thumbnails, Previous/Next, arrow keys, Home/End, or horizontal touch swipes. Manual selections are announced to screen readers.
- The project slideshow advances every 6.5 seconds while visible, with a Play/Pause control. Hover, keyboard focus, leaving the viewport, and a hidden tab pause it; manual selection stops autoplay.
- Image wipes, heading and letter reveals, rolling links, moving arrows, and a pausable work strip provide motion.
- The work archive combines a large featured case study with live text search, category filters, responsive project cards, image zooms, and arrow reveals.
- A responsive coastal-train film fills the shared space between each page’s closing content and the footer navigation.
- The About-page experience portrait uses a pausable engineering-scan animation with pointer depth and a static reduced-motion fallback.
- On desktop, service rows expand with a zoom-out image treatment; the selected-work portrait drifts on hover. Menu links enter in sequence and the drawer animates on close. Footer links invert their colors and roll their labels.
- The footer uses an inverted palette and oversized name.

The implementation uses original React and CSS. The reference’s proprietary source code, branding, photography, and video are not bundled.

## Pages

- `/` — personal film, introduction, selected work, services, and contact invitation
- `/about` — image-led biography, toolkit, experience, education, and contact invitation
- `/work` — editorial project archive with a portrait hero, featured case study, searchable category filters, responsive cards, and hover motion
- `/work/[slug]` — project context, contribution, evidence, and source links
- `/contact` — contact form and direct email link
- `/lab` — interactive concurrency experiment

## Personal media

The supplied MOV and three JPEGs are preserved in `output/media-originals/`. Public assets live in `public/media/`:

| Asset | Use |
| --- | --- |
| `sachin-film-clean.mp4` | Logo-free silent H.264 desktop film, 1280×632 at 4 Mbps, approximately 17.6 MB |
| `sachin-film-clean-mobile.mp4` | Logo-free mobile film, 1280×632 at 2 Mbps, approximately 9 MB |
| `sachin-film-clean-lite.mp4` | Logo-free fallback for slow/data-saving connections, 960×474, approximately 3.4 MB |
| `sachin-film-clean-poster.jpg` | Matching logo-free still for initial loading and motion/data-saving preferences |
| `sachin-car.webp` | Hero portrait and contact image |
| `sachin-cinematic.webp` | Wide biography photograph |
| `sachin-about-portrait.jpg` | Responsive portrait used across the redesigned About page |
| `sachin-about-story.jpg` | Coastal hammock photograph used in the “This is me” section |
| `sachin-work-selfie-cutout.webp` | Transparent monochrome selfie in the work-page header |
| `sachin-standing-cutout.webp` | Transparent portrait beside selected projects |
| `sachin-coast-train.mp4` | 8.5-second H.264 coastal-train film for the shared pre-footer strip, approximately 7.6 MB |
| `sachin-coast-train-mobile.mp4` | Lightweight 8.5-second mobile encode, approximately 278 KB |
| `sachin-coast-train-poster.jpg` | Still poster shown before playback and for reduced-motion/data-saving preferences |

The original MOV and earlier exports remain untouched. `IMG_4974.MOV` also remains unchanged in Downloads; the site uses only its optimized H.264 exports and poster.

Images were resized and compressed for the web. The supplied About-page HEIC files are preserved as `output/media-originals/sachin-about-original.heic` and `output/media-originals/sachin-about-story-original.heic`. The standing portrait’s background was removed with the built-in imagegen tool; its original edit and exact prompt are in `output/imagegen/`. The earlier generated coastal study remains an unused alternative there. Project covers in `public/images/` are labeled concept artwork, not project screenshots.

## Motion and accessibility

Both videos are muted and inline, pause when out of view or when the tab is hidden, and have Play/Pause controls. Reduced-motion and data-saving preferences start with posters and require an explicit play request. Phone-sized views request dedicated mobile exports. The hero film’s bottom 88 pixels are cropped to remove the embedded CapCut logo, with no upscaling; higher bitrates reduce additional compression but cannot restore detail absent from the source. The on-page color treatment slightly deepens contrast and reduces saturation. Browsers may also restrict autoplay; the play controls remain available.

Reduced motion disables entrance animations, marquees, slideshow autoplay, expanding rows, and transitions. Touch layouts keep content visible without requiring hover; vertical scrolling and pinch zoom remain native. Both moving text strips have pause controls. Navigation supports Escape and trapped keyboard focus, restores focus on close, and temporarily makes the underlying content inert. Content remains readable without JavaScript.

## Contact and experiment

The contact form sends through Formspree using the public form ID `xvkzdavg` supplied by the site owner. It needs no custom sending domain or Vercel environment variable. Confirm that the form's target email is `sachinsuranjana@gmail.com` and that the address is verified in Formspree. After deployment, submit a message through the site and check the Formspree submissions dashboard and Gmail inbox, including Spam. A direct email link remains available beside the form.

To change forms without changing code, set `FORMSPREE_FORM_ID` in Vercel Project Settings → Environment Variables and redeploy. For local testing, set it in `.env.local`. Setting it to an empty string disables Formspree and lets a complete Resend configuration take over.

If you later own a custom sending domain, the route can also use Resend's server-side Email API. Verify the domain in Resend, then set `FORMSPREE_FORM_ID` to an empty string and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` (for example, `Sachin Portfolio <hello@your-verified-domain.com>`). The Vercel deployment URL cannot serve as your Resend sender domain. Never prefix server-only variables with `NEXT_PUBLIC_` or commit API keys.

Tests mock provider requests and never send real email. See the [Formspree form guide](https://help.formspree.io/articles/troubleshooting/phasing-out-legacy-forms-email-urls), [Resend domain guide](https://resend.com/docs/dashboard/domains/introduction), and [Vercel environment-variable guide](https://vercel.com/docs/environment-variables).

`lib/concurrency.mjs` performs deterministic read/write scheduling for two workers incrementing a shared counter. The unsafe design loses an update; mutual exclusion preserves both. This is a browser illustration, not Java-thread execution.
