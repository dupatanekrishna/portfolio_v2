# Portfolio

A responsive one-page portfolio for **krishna.dupatane.portfolio.dkalki.com**, built with plain HTML, CSS, and JavaScript. It presents practical cloud/platform, SRE/observability, and DevSecOps/secure-delivery work.

The site is hosted as a static GitHub Pages site. It also includes a small Groot DevOps assistant whose server-side API is deployed separately on Cloudflare Workers.

## Groot DevOps assistant

The floating Ask Groot widget is embedded in the static page and uses this request path:

~~~text
Browser
  -> GitHub Pages portfolio
  -> Cloudflare Worker API
       -> Cloudflare D1 quota state
       -> OpenAI Responses API with official-documentation web search
  <- short answer, validated source links, quota status
~~~

Current public backend endpoint:

~~~text
https://groot-api.support-dupatane.workers.dev
~~~

The frontend uses the root HTML attribute data-groot-api-base to locate the Worker. The public page contains no OpenAI API key.

Current behaviour:

- Short DevOps, cloud, DNS, Kubernetes, SRE, infrastructure, observability, and security explanations.
- Answers are grounded in an allowlist of official documentation domains.
- Up to three validated official source links are shown below an answer.
- Three accepted questions are allowed per IP in a rolling 24-hour window.
- The third answer shows a final-question notice.
- The fourth request is rejected before the OpenAI call.
- The widget shows a paid-credit reminder below live answers.
- The backend stores a salted IP hash rather than the raw IP address.

The complete architecture, Worker source, D1 migration, deployment lab, security notes, troubleshooting guide, and rollback procedure are maintained in the companion repository:

<https://github.com/dupatanekrishna/groot-openai-api-chatbot>

That companion repository is currently private. The live portfolio does not read GitHub repositories or private project code; it currently answers from the configured official documentation sources only.

## Files

- index.html — page copy, navigation, service descriptions, lab summaries, and the Groot widget markup
- styles.css — responsive visual system using the navy, teal, gold, and off-white palette
- groot-chat.css — scoped widget layout and responsive styles
- groot-chat.js — browser-side health check, quota display, request handling, safe text rendering, and source-link rendering
- assets/DUPATANE_Logo_Final.png — selected logo artwork from the brand archive
- assets/groot-avatar.webp — Groot widget avatar
- CNAME — custom domain krishna.dupatane.portfolio.dkalki.com

## Security boundary

GitHub Pages serves only public static assets. The OpenAI key and rate-limit salt live in Cloudflare Worker secrets. Browser JavaScript receives only the public Worker URL and sends questions over HTTPS.

The browser Origin check is a sharing control, not a login system. The Worker also validates message size, history shape, source domains, and the D1 quota. Stronger visitor authentication would be a separate future feature.

## GitHub Pages setup

1. In dupatanekrishna/portfolio_v2, **Settings → Pages** publishes from **main / (root)**.
2. The Pages custom domain is krishna.dupatane.portfolio.dkalki.com, and the repository CNAME file contains that same hostname.
3. At the active DNS provider, the CNAME owner/Host is krishna.dupatane.portfolio and its target is dupatanekrishna.github.io. Check dig NS dkalki.com +short to find the authoritative DNS provider.
4. GitHub profile verification of dkalki.com is a separate ownership check. GitHub showed the domain as Verified on 3 October 2026; keep its TXT record in DNS.
5. GitHub Pages HTTPS is enabled for the portfolio hostname. Pushes to main trigger the branch build.
6. The Worker backend is deployed independently with Wrangler; publishing the static site does not upload backend secrets.

The CNAME file and the Pages setting do not create the DNS record. Use [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for current instructions.

## Iteration and reuse

Edit page copy in index.html, visual styles in styles.css and groot-chat.css, and browser behaviour in groot-chat.js. Backend changes belong in the companion Cloudflare Worker repository and are deployed separately.

Use a feature branch and pull request for public-site changes. Review the Worker URL, asset paths, source-link handling, and absence of secrets before merging.

The page, text, logo, and styles are public. No reuse license is granted for the DUPATANE name, logo, tagline, or original page content.
