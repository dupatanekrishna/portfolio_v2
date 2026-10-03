# Portfolio

A responsive one-page portfolio for `krishna.dupatane.portfolio.dkalki.com`, built with plain HTML and CSS. It uses the final logo from `dupatanekrishna/brand-identity-archive` and the archived final tagline, and presents an editable starting set of cloud/platform, SRE/observability, and DevSecOps/secure delivery offerings.

SRE and DevSecOps summaries are based on the separate private reference repositories; the public site does not link to those private repositories.

## Files

- `index.html` — page copy, navigation, service descriptions, and lab summaries
- `styles.css` — responsive visual system using the navy, teal, gold, and off-white palette
- `assets/DUPATANE_Logo_Final.png` — selected logo artwork from the brand archive
- `CNAME` — custom domain `krishna.dupatane.portfolio.dkalki.com`

## GitHub Pages setup

1. In `dupatanekrishna/portfolio_v2`, **Settings → Pages** publishes from **`main` / (root)**.
2. The Pages custom domain is `krishna.dupatane.portfolio.dkalki.com`, and the repository `CNAME` file contains that same hostname.
3. At the active DNS provider, the CNAME owner/Host is `krishna.dupatane.portfolio` and its target is `dupatanekrishna.github.io`. Check `dig NS dkalki.com +short` to find the authoritative DNS provider.
4. GitHub profile verification of `dkalki.com` is a separate ownership check. GitHub showed the domain as **Verified** on 3 October 2026; keep its TXT record in DNS.
5. GitHub Pages HTTPS is enabled for the portfolio hostname. Pushes to `main` trigger the branch build.

The `CNAME` file and the Pages setting do not create the DNS record. Use [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for current instructions.

## Iteration and reuse

Edit the page copy in `index.html` and styles in `styles.css`. This is an evolving portfolio draft; service scope and contact details can be refined as the business develops.

The page, text, logo, and styles are public. No reuse license is granted for the DUPATANE name, logo, tagline, or original page content.
