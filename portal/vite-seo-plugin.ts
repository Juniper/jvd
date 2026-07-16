import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

// Build-time SEO enrichment for a client-rendered SPA.
//
// The app mounts into an empty <div id="root">, so crawlers that don't execute
// JavaScript (many social, LLM, and SEO bots) would otherwise see no content.
// This plugin injects, from the single source of truth (src/data/jvds.json):
//   1. JSON-LD structured data (WebSite + ItemList of every JVD), and
//   2. a <noscript> catalog fallback (names, descriptions, links),
// so the served HTML is meaningful without JS. Runs on every `vite build`
// (and dev), so it never drifts from the catalog data.

type Jvd = {
  id: string;
  name: string;
  area: string;
  description: string;
  repoPath: string;
};

const SITE_URL = "https://juniper.github.io/jvd/portal/";
const REPO_BASE = "https://github.com/Juniper/jvd/tree/main/";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Escape "<" in inline JSON-LD so a stray "</script>" in data can't break out.
const jsonLd = (obj: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

export function seoInject(): Plugin {
  return {
    name: "jvd-seo-inject",
    transformIndexHtml(html) {
      const jvds: Jvd[] = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "src/data/jvds.json"), "utf8"),
      );

      const website = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "JVD Portal",
        alternateName: "Juniper Validated Designs Portal",
        url: SITE_URL,
        description:
          "Find the right Juniper Validated Design, explore its config building blocks, ask design questions grounded in the docs, and generate validated device configuration.",
        publisher: { "@type": "Organization", name: "Juniper Networks" },
      };

      const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Juniper Validated Designs",
        numberOfItems: jvds.length,
        itemListElement: jvds.map((j, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "TechArticle",
            name: j.name,
            description: j.description,
            url: REPO_BASE + j.repoPath,
            articleSection: j.area,
          },
        })),
      };

      const noscript =
        `<noscript>` +
        `<h1>Juniper Validated Designs</h1>` +
        `<p>Production-ready reference architectures for data center, WAN, optical, security, and service provider networks. Enable JavaScript for the interactive catalog, config explorer, and generator.</p>` +
        `<ul>` +
        jvds
          .map(
            (j) =>
              `<li><a href="${esc(REPO_BASE + j.repoPath)}">${esc(j.name)}</a> — ${esc(j.description)} (${esc(j.area)})</li>`,
          )
          .join("") +
        `</ul></noscript>`;

      return html
        .replace("</head>", `${jsonLd(website)}\n    ${jsonLd(itemList)}\n  </head>`)
        .replace('<div id="root"></div>', `${noscript}\n    <div id="root"></div>`);
    },
  };
}
