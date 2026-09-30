# DKALKI Portfolio

A responsive one-page portfolio draft for `dkalki.com`, built with plain HTML and CSS. It uses the selected DKALKI dark logo and final tagline, and presents an editable starting set of cloud/platform, SRE/observability, and DevSecOps/secure delivery offerings.

SRE and DevSecOps summaries are based on the separate private reference repositories; the public site does not link to those private repositories.

## Files

- `index.html` — page copy, navigation, service descriptions, and lab summaries
- `styles.css` — responsive visual system using DKALKI's navy, teal, gold, and off-white colors
- `assets/DKalki_Dark_Logo.svg` — selected dark-background logo
- `CNAME` — custom domain `dkalki.com`
- `.github/workflows/pages.yml` — deploys the site to GitHub Pages on pushes to `main`

## GitHub Pages setup

1. In `dupatanekrishna/portfolio_v2`, open **Settings → Pages** and choose **GitHub Actions** as the publishing source.
2. The repository is private. GitHub Pages supports private source repositories on GitHub Pro, Team, or Enterprise; GitHub Free supports Pages from public repositories. The published site is public either way.
3. Add `dkalki.com` in the Pages custom domain setting and verify ownership with GitHub.
4. At the domain registrar, configure the DNS records GitHub gives you for the apex domain. Add `www` only if you want a `www.dkalki.com` alias. The `CNAME` file does not configure GitHub settings or DNS by itself.
5. Pushes to `main` deploy through `.github/workflows/pages.yml`.

Use [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for current DNS values and verification instructions.

## Iteration and reuse

Edit the page copy in `index.html` and styles in `styles.css`. This is an evolving portfolio draft; service scope and contact details can be refined as the business develops.

The repository is private to reduce direct access to the source. The published page, its text, images, and styles remain publicly visible and can be copied from a browser. No reuse license is granted for the DKALKI name, logo, tagline, or original page content.
