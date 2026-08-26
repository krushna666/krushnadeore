export const SITE = {
  name: "OlyxMedia",
  tagline: "Social Media That Builds Your Business.",
  description:
    "OlyxMedia is a Pune-based social media and digital marketing agency helping businesses grow through social media, SEO, paid advertising, content and lead generation.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+91 7559191116",
  phoneHref: "tel:+917559191116",
  email: "support@olyxmedia.com",
  address: "Baner, Pune, Maharashtra, India",
  whatsappNumber: "917559191116",
  whatsappDefaultMessage: "Hi OlyxMedia, I want to discuss digital marketing for my business.",
} as const;

export function whatsappUrl(message: string = SITE.whatsappDefaultMessage) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Social Media Marketing", href: "/services/social-media-marketing" },
    { label: "SEO", href: "/services/seo" },
    { label: "Google Ads", href: "/services/google-ads" },
    { label: "Branding", href: "/services/branding" },
    { label: "Website Development", href: "/services/website-development" },
    { label: "Lead Generation", href: "/services/lead-generation" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Resources", href: "/resources" },
    { label: "Glossary", href: "/glossary" },
    { label: "FAQs", href: "/faq" },
    { label: "Pricing", href: "/pricing" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
} as const;

export const SERVICE_CATALOG: { name: string; slug: string; blurb: string }[] = [
  { name: "Social Media Marketing", slug: "social-media-marketing", blurb: "Strategy, content and paid campaigns that turn followers into customers." },
  { name: "Social Media Management", slug: "social-media-management", blurb: "Day-to-day handling of your brand's social presence, done right." },
  { name: "Instagram Marketing", slug: "instagram-marketing", blurb: "Growth, content and campaigns built for Instagram's algorithm." },
  { name: "Facebook Marketing", slug: "facebook-marketing", blurb: "Reach and convert Facebook's audience with targeted campaigns." },
  { name: "LinkedIn Marketing", slug: "linkedin-marketing", blurb: "B2B visibility and lead generation on LinkedIn." },
  { name: "Content Marketing", slug: "content-marketing", blurb: "Content that builds authority and drives organic discovery." },
  { name: "Reels Marketing", slug: "reels-marketing", blurb: "Short-form video production built for reach and retention." },
  { name: "SEO", slug: "seo", blurb: "Rank higher and win qualified organic traffic on Google." },
  { name: "Local SEO", slug: "local-seo", blurb: "Dominate local search and Google Maps in your service area." },
  { name: "Technical SEO", slug: "technical-seo", blurb: "Fix the technical issues holding your rankings back." },
  { name: "Google Business Profile", slug: "google-business-profile", blurb: "Optimize your GBP listing to win local, map-based discovery." },
  { name: "Performance Marketing", slug: "performance-marketing", blurb: "Full-funnel paid media focused on measurable acquisition." },
  { name: "Google Ads", slug: "google-ads", blurb: "Search, display and shopping campaigns built to convert." },
  { name: "Meta Ads", slug: "meta-ads", blurb: "Facebook & Instagram ad campaigns engineered for ROAS." },
  { name: "Lead Generation", slug: "lead-generation", blurb: "Consistent, qualified leads for your sales pipeline." },
  { name: "Branding", slug: "branding", blurb: "Brand identity and positioning that stands out in your category." },
  { name: "Graphic Design", slug: "graphic-design", blurb: "On-brand creative for every channel and campaign." },
  { name: "Website Development", slug: "website-development", blurb: "Fast, conversion-focused websites built to perform." },
  { name: "Influencer Marketing", slug: "influencer-marketing", blurb: "Partnerships that extend your reach through trusted voices." },
  { name: "Personal Branding", slug: "personal-branding", blurb: "Build a founder or executive presence that earns trust." },
];

export const INDUSTRY_CATALOG: { name: string; slug: string }[] = [
  { name: "Healthcare", slug: "healthcare" },
  { name: "Real Estate", slug: "real-estate" },
  { name: "Restaurants", slug: "restaurants" },
  { name: "Education", slug: "education" },
  { name: "E-commerce", slug: "ecommerce" },
  { name: "Startups", slug: "startups" },
  { name: "B2B", slug: "b2b" },
];

export const LOCATION_CATALOG: { name: string; slug: string; city: string }[] = [
  { name: "Social Media Marketing Agency in Pune", slug: "social-media-marketing-agency-pune", city: "Pune" },
  { name: "Digital Marketing Agency in Baner", slug: "digital-marketing-agency-baner", city: "Pune" },
];
