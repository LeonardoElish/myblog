import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "关于",
    icon: "i-fa-solid:paw",
    md: [
      {
        id: "about-me",
        title: "关于我",
        file: "markdown/about-me.md",
        icon: "i-la:dragon",
        excerpt: "1"
      },
      {
        id: "github-stats",
        title: "技术栈",
        file: "markdown/github-stats.md",
        icon: "i-icon-park-outline:code",
        excerpt: "1"
      },
      {
        id: "about-site",
        title: "设计理念",
        file: "markdown/about-site.md",
        icon: "i-mdi:brush",
        excerpt: "1"
      }
    ]
  },
  {
    id: "project",
    title: "作品集",
    icon: "i-octicon:repo",
    md: [
      {
        id: "tweakden",
        title: "TweakDen",
        file: "markdown/project-tweakden.md",
        icon: "i-ri:search-eye-line",
        excerpt: "1"
      },
      {
        id: "tarot-fragrance",
        title: "Fragrant Epiphany",
        file: "markdown/project-tarot-fragrance.md",
        icon: "i-ri:magic-line",
        excerpt: "1"
      },
      {
        id: "Leonardo Elish-desktop",
        title: "Leonardo Elish's Desktop",
        file: "markdown/project-Leonardo Elish-desktop.md",
        icon: "i-ri:macbook-line",
        excerpt: "1"
      },
      {
        id: "smartbot",
        title: "SmartBot",
        file: "markdown/project-smartbot.md",
        icon: "i-ri:customer-service-2-line",
        excerpt: "1"
      },
      {
        id: "coinpulse",
        title: "CoinPulse",
        file: "markdown/project-coinpulse.md",
        icon: "i-ri:stock-line",
        excerpt: "1"
      },
      {
        id: "moodflow",
        title: "MoodFlow",
        file: "markdown/project-moodflow.md",
        icon: "i-ri:mental-health-line",
        excerpt: "1"
      },
      {
        id: "hotel-website",
        title: "1",
        file: "markdown/project-hotel-website.md",
        icon: "i-ri:hotel-line",
        excerpt: "1"
      },
      {
        id: "ebay-erp",
        title: "1",
        file: "markdown/project-ebay-erp.md",
        icon: "i-ri:shopping-cart-2-line",
        excerpt: "1"
      }
    ]
  }
];

export default bear;
