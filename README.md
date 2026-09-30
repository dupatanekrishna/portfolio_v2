# DKALKI Portfolio

A responsive one-page portfolio draft for `dkalki.com`, built with plain HTML and CSS. It uses the final logo from `dupatanekrishna/brand-identity-archive` and the archived final tagline, and presents an editable starting set of cloud/platform, SRE/observability, and DevSecOps/secure delivery offerings.

SRE and DevSecOps summaries are based on the separate private reference repositories; the public site does not link to those private repositories.

## Files

- `index.html` — page copy, navigation, service descriptions, and lab summaries
- `styles.css` — responsive visual system using the navy, teal, gold, and off-white palette
- `assets/DUPATANE_Logo_Final.png` — selected logo artwork from the brand archive
- `CNAME` — custom domain `dkalki.com`
- `.github/workflows/pages.yml` — deploys the site to GitHub Pages on pushes to `main`

## GitHub Pages setup

1. In `dupatanekrishna/portfolio_v2`, open **Settings → Pages** and choose **GitHub Actions** as the publishing source.
2. This repository is public, so GitHub Pages is available on GitHub Free. The source files are visible and can be cloned.
3. Add `dkalki.com` in the Pages custom domain setting and verify ownership with GitHub.
4. At the domain registrar, configure the DNS records GitHub gives you for the apex domain. Add `www` only if you want a `www.dkalki.com` alias. The `CNAME` file does not configure GitHub settings or DNS by itself.
5. Pushes to `main` deploy through `.github/workflows/pages.yml`.

Use [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for current DNS values and verification instructions.

## Iteration and reuse

Edit the page copy in `index.html` and styles in `styles.css`. This is an evolving portfolio draft; service scope and contact details can be refined as the business develops.

The page, text, logo, and styles are public. No reuse license is granted for the DUPATANE name, logo, tagline, or original page content.
