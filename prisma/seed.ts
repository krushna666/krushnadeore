import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SERVICE_CATALOG, INDUSTRY_CATALOG } from "../src/lib/constants";
import { readingTimeMinutes, slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const WRITTEN_SERVICE_SLUGS = new Set([
  "social-media-marketing",
  "seo",
  "google-ads",
  "branding",
  "website-development",
  "lead-generation",
]);

const WRITTEN_INDUSTRY_SLUGS = new Set(["healthcare", "real-estate", "restaurants"]);

const SERVICE_DETAILS: Record<
  string,
  {
    headline: string;
    problem: string;
    solution: string;
    deliverables: string[];
    process: string[];
    benefits: string[];
    idealClient: string;
  }
> = {
  "social-media-marketing": {
    headline: "Social Media Marketing Agency in Pune That Drives Real Business Growth",
    problem:
      "Most businesses post on social media without a strategy — inconsistent content, no clear audience, and no link between posts and actual leads.",
    solution:
      "OlyxMedia builds a social media strategy tied to your business goals: audience research, a content calendar, creative production and paid amplification, all measured against leads and conversions rather than vanity metrics.",
    deliverables: [
      "Social media strategy and content calendar",
      "Static, carousel and Reels content production",
      "Community management and engagement",
      "Paid social campaign setup and optimization",
      "Monthly performance reporting",
    ],
    process: [
      "Discover your audience, competitors and current performance",
      "Build a content and campaign strategy tied to business goals",
      "Produce on-brand creative and copy",
      "Launch organic and paid campaigns",
      "Measure results and optimize monthly",
    ],
    benefits: [
      "Consistent, on-brand presence across platforms",
      "Content built to convert, not just to look good",
      "Clear monthly reporting tied to business outcomes",
    ],
    idealClient: "Businesses in Pune and across India that want social media to contribute to real leads and revenue, not just followers.",
  },
  seo: {
    headline: "SEO Agency in Pune for Sustainable Organic Growth",
    problem:
      "Ranking on Google takes technical fixes, quality content and consistent execution — most businesses either ignore SEO or get inconsistent, short-term efforts from freelancers.",
    solution:
      "OlyxMedia runs structured SEO programs — technical audits, on-page optimization, content built around real search intent and local SEO for Pune-based businesses — so your organic visibility compounds over time.",
    deliverables: [
      "Technical SEO audit and fixes",
      "Keyword research and content strategy",
      "On-page optimization",
      "Local SEO and Google Business Profile optimization",
      "Monthly rank and traffic reporting",
    ],
    process: [
      "Audit your site's technical health and current rankings",
      "Research keywords your customers actually search for",
      "Fix technical issues and optimize on-page content",
      "Publish content built around search intent",
      "Track rankings and traffic, then iterate",
    ],
    benefits: [
      "Organic traffic that keeps compounding, not paid-only spikes",
      "Technical foundation fixed before content is layered on",
      "Local visibility for Pune-area searches",
    ],
    idealClient: "Businesses ready to invest in organic growth over 6–12 months rather than expecting overnight rankings.",
  },
  "google-ads": {
    headline: "Google Ads Management for Measurable Acquisition",
    problem:
      "Google Ads accounts are easy to set up and easy to waste money in — broad targeting, weak landing pages and no conversion tracking quietly burn budget.",
    solution:
      "OlyxMedia builds Google Ads campaigns around proper conversion tracking, tight keyword targeting and landing pages designed to convert — so every rupee spent is measurable.",
    deliverables: [
      "Campaign strategy and keyword research",
      "Search, display and shopping campaign setup",
      "Conversion tracking implementation",
      "Ad copy and landing page recommendations",
      "Monthly spend and performance reporting",
    ],
    process: [
      "Audit your account or build a strategy from scratch",
      "Set up conversion tracking correctly, first",
      "Build tightly targeted campaigns and ad groups",
      "Launch and monitor daily in the first weeks",
      "Optimize monthly based on real conversion data",
    ],
    benefits: [
      "Spend tied to tracked conversions, not just clicks",
      "Faster feedback loop than organic channels",
      "Full visibility into what's working and what isn't",
    ],
    idealClient: "Businesses with a clear offer and a working website who want fast, measurable lead flow.",
  },
  branding: {
    headline: "Branding & Identity for Businesses That Want to Stand Out",
    problem:
      "A weak or inconsistent brand makes every other marketing effort harder — inconsistent visuals and messaging undermine trust before a customer even reads your offer.",
    solution:
      "OlyxMedia develops brand identities — positioning, visual identity and messaging — built to differentiate your business in a crowded market and carry through every touchpoint.",
    deliverables: [
      "Brand strategy and positioning",
      "Logo and visual identity system",
      "Brand guidelines",
      "Messaging and tone of voice",
      "Marketing collateral templates",
    ],
    process: [
      "Understand your business, market and competitors",
      "Define positioning and messaging",
      "Design visual identity and brand guidelines",
      "Apply the brand across key touchpoints",
      "Hand over a usable brand system",
    ],
    benefits: [
      "A consistent brand across every channel",
      "Positioning that differentiates you from competitors",
      "A visual system your team can use confidently",
    ],
    idealClient: "Businesses launching or refreshing their brand who want it to actually support sales and marketing, not just look good.",
  },
  "website-development": {
    headline: "Website Development That's Built to Convert",
    problem:
      "Many business websites look fine but load slowly, aren't optimized for mobile, and don't guide visitors toward taking action.",
    solution:
      "OlyxMedia builds fast, mobile-first websites focused on conversion — clear structure, strong CTAs and the technical foundation SEO depends on.",
    deliverables: [
      "Website strategy and information architecture",
      "UI/UX design",
      "Responsive development",
      "On-page SEO foundation",
      "Performance optimization",
    ],
    process: [
      "Define goals, pages and user journeys",
      "Design mobile-first layouts",
      "Develop with performance and SEO built in",
      "Test across devices",
      "Launch and monitor",
    ],
    benefits: [
      "Fast-loading, mobile-optimized experience",
      "Clear conversion paths for visitors",
      "A technical foundation that supports SEO",
    ],
    idealClient: "Businesses that need a website built to generate leads, not just exist online.",
  },
  "lead-generation": {
    headline: "Lead Generation Built for a Consistent Sales Pipeline",
    problem:
      "Marketing activity without a lead generation system means inconsistent, unpredictable pipeline — busy one month, quiet the next.",
    solution:
      "OlyxMedia combines paid campaigns, landing pages and lead capture systems into a repeatable lead generation engine tied to your sales process.",
    deliverables: [
      "Lead generation strategy",
      "Landing page design and copy",
      "Paid campaign management",
      "Lead capture and CRM setup",
      "Monthly lead quality reporting",
    ],
    process: [
      "Define your ideal customer and offer",
      "Build landing pages and lead capture systems",
      "Launch paid campaigns to drive qualified traffic",
      "Route and track leads into your sales process",
      "Optimize for lead quality, not just volume",
    ],
    benefits: [
      "A predictable, trackable lead pipeline",
      "Leads routed straight into your sales process",
      "Reporting focused on lead quality, not vanity metrics",
    ],
    idealClient: "Businesses with a defined sales process that need a consistent flow of qualified leads.",
  },
};

const INDUSTRY_DETAILS: Record<
  string,
  { challenges: string; solution: string; recommendedServices: string[]; contentStrategy: string; leadGenStrategy: string; seoStrategy: string }
> = {
  healthcare: {
    challenges:
      "Healthcare businesses face strict trust requirements, local competition and the need to educate patients — while navigating what can and can't be claimed in marketing.",
    solution:
      "OlyxMedia builds compliant, trust-focused marketing for clinics and healthcare providers: local SEO, patient education content and Google Business Profile optimization.",
    recommendedServices: ["Local SEO", "Google Business Profile", "Content Marketing", "Social Media Marketing"],
    contentStrategy: "Educational content that answers real patient questions and builds trust before the first appointment.",
    leadGenStrategy: "Local SEO and Google Business Profile optimization to capture high-intent, nearby searches.",
    seoStrategy: "Local SEO focused on service-area keywords and Google Maps visibility.",
  },
  "real-estate": {
    challenges:
      "Real estate marketing is highly visual and time-sensitive — listings need reach fast, and buyers research extensively online before contacting an agent.",
    solution:
      "OlyxMedia combines high-quality visual content, targeted social and paid campaigns, and local SEO to put listings in front of qualified buyers.",
    recommendedServices: ["Social Media Marketing", "Meta Ads", "Reels Marketing", "Website Development"],
    contentStrategy: "Property showcases, neighborhood guides and market insight content that builds authority.",
    leadGenStrategy: "Paid social campaigns targeted to buyer intent, paired with strong landing pages per listing or project.",
    seoStrategy: "Local SEO for project and area-specific searches.",
  },
  restaurants: {
    challenges:
      "Restaurants compete for local attention daily — visibility on social media and Google Maps directly affects footfall and orders.",
    solution:
      "OlyxMedia runs social-first campaigns with strong visual content, local SEO and Google Business Profile management to keep restaurants visible to nearby, hungry customers.",
    recommendedServices: ["Instagram Marketing", "Reels Marketing", "Local SEO", "Google Business Profile"],
    contentStrategy: "Reels and visual content that showcases food, ambience and offers.",
    leadGenStrategy: "Local social campaigns and Google Business Profile optimization to drive footfall and orders.",
    seoStrategy: "Local SEO and Maps optimization for 'near me' and area-specific searches.",
  },
};

const BLOG_POSTS = [
  {
    title: "7 Social Media Marketing Trends Defining 2026 (And How to Act on Them)",
    slug: "social-media-marketing-trends-2026",
    excerpt:
      "The 2026 social media landscape is being shaped by AI, community-first growth, social search, long-form video, social commerce, clearer ROI tracking and a stronger demand for authenticity.",
    content: `
      <p>Social media does not just move fast anymore - it moves in leaps. Every year brings a new wave of platform updates, shifting algorithms, and changing audience expectations, but 2026 feels different. AI has moved from "nice to have" to default infrastructure. Reach alone no longer proves ROI. And audiences are more selective than ever about which brands earn their attention.</p>
      <p>If you are planning your social strategy for the rest of the year, here are the trends actually worth building around - not the fleeting ones.</p>
      <h2>1. AI Is the New Baseline, Not the Differentiator</h2>
      <p>AI-assisted content creation, optimization, and analytics have become standard practice across the industry. Most marketing teams are already using AI in some part of their workflow, whether that is drafting captions, generating creative variations, or analyzing performance data.</p>
      <p>The differentiator in 2026 is not whether you use AI - it is how strategically you integrate it. Brands seeing real gains are the ones pairing AI tools with a clear content strategy, not just automating for volume.</p>
      <p><strong>What this means for your brand:</strong> Use AI to speed up production and surface insights, but keep a human hand on brand voice, judgment calls, and anything customer-facing. Audiences are increasingly wary of unlabeled AI content, so transparency matters as much as efficiency.</p>
      <h2>2. Community Management Is Having a Comeback</h2>
      <p>For years, growth meant chasing bigger audiences. In 2026, the smarter play is going deeper, not wider. Brands are investing in high-value niche communities that drive stronger retention and lifetime value, rather than spreading themselves thin across mass-market reach campaigns.</p>
      <p>This is also fueling renewed investment in community management as a dedicated discipline - responding to comments, hosting conversations, and making followers feel genuinely heard, not just broadcast to.</p>
      <p><strong>What this means for your brand:</strong> Budget time and headcount for real engagement, not just scheduled posting. A smaller, more responsive community will often outperform a larger, passive following.</p>
      <h2>3. Social Platforms Are Becoming Search Engines</h2>
      <p>More users are turning to social platforms to search for products, reviews, and recommendations before they ever open a traditional search engine. That shift is pushing social SEO - optimizing captions, keywords, and alt text for in-platform discovery - into a core marketing skill.</p>
      <p><strong>What this means for your brand:</strong> Treat your captions and video content the way you would treat a webpage. Use natural, keyword-rich language that answers real questions your audience is searching for.</p>
      <h2>4. Long-Form Video Is Making a Return</h2>
      <p>Short-form video is not going anywhere, but it is no longer the only format worth prioritizing. Platforms are rewarding longer, more substantial video content again, giving brands room to build trust and tell fuller stories instead of chasing six-second hooks alone.</p>
      <p><strong>What this means for your brand:</strong> Diversify your video mix. Use short-form for discovery and top-of-funnel reach, then use long-form to go deeper with product education, behind-the-scenes content, and storytelling that builds loyalty.</p>
      <h2>5. Social Commerce Is Scaling Fast</h2>
      <p>In-platform shopping continues to grow rapidly, with social commerce expected to represent a significant share of e-commerce revenue in the U.S. this year. As checkout friction disappears, social content and product discovery are merging into a single experience.</p>
      <p><strong>What this means for your brand:</strong> If you sell physical products, in-platform shopping features should be a standing line item in your strategy, not an experiment. Make sure your product content is shoppable wherever your audience already is.</p>
      <h2>6. ROI Measurement Is Finally Getting Clearer</h2>
      <p>For years, marketers struggled to prove exactly how social activity translated into revenue. That is changing in 2026 as integrated measurement platforms make it easier to connect social touchpoints to actual business outcomes, giving marketing teams stronger footing when justifying budget.</p>
      <p><strong>What this means for your brand:</strong> Move beyond vanity metrics like likes and follower counts. Track how social touchpoints contribute to leads, conversions, and customer lifetime value, and report on that upward.</p>
      <h2>7. Authenticity Is a Trust Issue, Not Just a Buzzword</h2>
      <p>As AI-generated content becomes more common, audiences are paying closer attention to whether brands are transparent about it. Many consumers say they are uncomfortable with undisclosed AI-generated content, even as they become more accepting of AI in areas like customer service.</p>
      <p><strong>What this means for your brand:</strong> Disclose when content is AI-assisted where it matters, and do not let automation replace the genuine storytelling and personality that built your audience's trust in the first place.</p>
      <h2>The Bottom Line</h2>
      <p>The brands winning on social in 2026 are not necessarily the ones posting the most - they are the ones operating with more intention: using AI to work smarter, investing in real community, diversifying content formats, and proving the results with real data.</p>
      <p>Trends will keep shifting, as they always do. The strategy that holds up is one built on genuine connection with your audience, backed by the tools and data to keep improving it.</p>
      <hr />
      <p><em>Ready to build a 2026 social strategy that actually moves the needle?</em> <a href="/contact">Get in touch with our team</a> to see how we can help.</p>
    `.trim(),
    seoTitle: "7 Social Media Marketing Trends Defining 2026 | OlyxMedia",
    metaDescription:
      "Discover the 7 social media marketing trends defining 2026, from AI and social SEO to community building, social commerce and stronger ROI measurement.",
    focusKeyword: "social media marketing trends 2026",
    category: "Social Media Marketing",
    tags: ["Social Media Marketing", "AI Marketing", "Social Commerce", "Content Strategy", "Social SEO"],
    faqs: [
      {
        question: "Is AI replacing social media marketers in 2026?",
        answer:
          "No. AI is becoming standard infrastructure for production and analysis, but strategy, brand judgment, transparency, and customer-facing communication still need a strong human lead.",
      },
      {
        question: "Why does community management matter more now?",
        answer:
          "Because brands are seeing more value from engaged niche communities than from passive large followings. Responsive conversations can improve retention, trust, and lifetime value.",
      },
      {
        question: "What should brands track instead of vanity metrics?",
        answer:
          "Track how social contributes to leads, conversions, revenue, and customer lifetime value. Likes and follower counts can be useful context, but they should not be the main measure of success.",
      },
    ],
    publishedAt: new Date("2026-08-25T09:00:00.000Z"),
  },
];

async function main() {
  // --- Admin user -----------------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL || "admin@olyxmedia.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "change-me-immediately";
  const name = process.env.SEED_ADMIN_NAME || "OlyxMedia Admin";

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { email, name, passwordHash, role: "ADMIN", mustChangePassword: true },
    });
    console.log(`Created admin user ${email}. IMPORTANT: change this password after first login.`);
  } else {
    console.log(`Admin user ${email} already exists, skipping.`);
  }

  const adminUser = await prisma.user.findUnique({ where: { email } });

  // --- Site settings singleton -----------------------------------------
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // --- Services (schema for every service in the catalog; 6 fully written
  //     via /admin later, rest published as soon as real copy is added) --
  for (const [i, svc] of SERVICE_CATALOG.entries()) {
    const details = SERVICE_DETAILS[svc.slug];
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: {
        name: svc.name,
        slug: svc.slug,
        order: i,
        shortDescription: svc.blurb,
        status: WRITTEN_SERVICE_SLUGS.has(svc.slug) ? "PUBLISHED" : "DRAFT",
        seoTitle: `${svc.name} Agency in Pune | OlyxMedia`,
        metaDescription: svc.blurb,
        ...(details || {}),
      },
    });
  }

  // --- Industries --------------------------------------------------------
  for (const [i, ind] of INDUSTRY_CATALOG.entries()) {
    const details = INDUSTRY_DETAILS[ind.slug];
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: {},
      create: {
        name: ind.name,
        slug: ind.slug,
        order: i,
        status: WRITTEN_INDUSTRY_SLUGS.has(ind.slug) ? "PUBLISHED" : "DRAFT",
        seoTitle: `Digital Marketing for ${ind.name} Businesses | OlyxMedia`,
        ...(details || {}),
      },
    });
  }

  // --- Locations (Pune + Baner published; rest of the local-SEO map can be
  //     added via /admin without touching code, per the "no thin pages" rule) -
  await prisma.location.upsert({
    where: { slug: "social-media-marketing-agency-pune" },
    update: {},
    create: {
      name: "Social Media Marketing Agency in Pune",
      slug: "social-media-marketing-agency-pune",
      city: "Pune",
      status: "PUBLISHED",
      intro:
        "OlyxMedia is a social media marketing agency based in Baner, Pune, helping local and national businesses build stronger brands and generate qualified leads through social media, SEO and performance marketing.",
      seoTitle: "Social Media Marketing Agency in Pune | OlyxMedia",
      metaDescription:
        "OlyxMedia is a Pune-based social media marketing agency offering strategy, content, reels, paid campaigns and lead generation for local businesses.",
    },
  });

  await prisma.location.upsert({
    where: { slug: "digital-marketing-agency-baner" },
    update: {},
    create: {
      name: "Digital Marketing Agency in Baner",
      slug: "digital-marketing-agency-baner",
      city: "Pune",
      status: "PUBLISHED",
      intro:
        "Based in Baner, OlyxMedia works with businesses across Baner, Aundh, Balewadi and Wakad on social media marketing, SEO and lead generation.",
      seoTitle: "Digital Marketing Agency in Baner, Pune | OlyxMedia",
      metaDescription:
        "OlyxMedia is a digital marketing agency headquartered in Baner, Pune, offering social media marketing, SEO and performance marketing for local businesses.",
    },
  });

  // --- Blog category/tags starter set -------------------------------------
  const categories = [
    "Social Media Marketing",
    "SEO",
    "Digital Marketing",
    "Local SEO",
    "Pune Business",
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { name: c, slug: c.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  // --- Blog authors, tags and starter articles ---------------------------
  const teamAuthor = await prisma.author.upsert({
    where: { slug: "olyxmedia-team" },
    update: {
      name: "OlyxMedia Team",
      bio: "Marketing strategists, writers and growth specialists from OlyxMedia.",
    },
    create: {
      name: "OlyxMedia Team",
      slug: "olyxmedia-team",
      bio: "Marketing strategists, writers and growth specialists from OlyxMedia.",
    },
  });

  const allBlogTags = [...new Set(BLOG_POSTS.flatMap((post) => post.tags))];
  for (const tagName of allBlogTags) {
    const tagSlug = slugify(tagName);
    await prisma.tag.upsert({
      where: { slug: tagSlug },
      update: { name: tagName },
      create: { name: tagName, slug: tagSlug },
    });
  }

  for (const post of BLOG_POSTS) {
    const category = await prisma.category.findUnique({ where: { slug: slugify(post.category) } });
    const tags = await prisma.tag.findMany({ where: { slug: { in: post.tags.map((tag) => slugify(tag)) } } });

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        status: "PUBLISHED",
        readingTimeMins: readingTimeMinutes(post.content),
        faqs: post.faqs,
        seoTitle: post.seoTitle,
        metaDescription: post.metaDescription,
        focusKeyword: post.focusKeyword,
        robotsNoindex: false,
        publishedAt: post.publishedAt,
        author: { connect: { id: teamAuthor.id } },
        ...(category ? { category: { connect: { id: category.id } } } : {}),
        tags: { set: tags.map((tag) => ({ id: tag.id })) },
        ...(adminUser ? { updatedById: adminUser.id } : {}),
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: "PUBLISHED",
        readingTimeMins: readingTimeMinutes(post.content),
        faqs: post.faqs,
        seoTitle: post.seoTitle,
        metaDescription: post.metaDescription,
        focusKeyword: post.focusKeyword,
        robotsNoindex: false,
        publishedAt: post.publishedAt,
        author: { connect: { id: teamAuthor.id } },
        ...(category ? { category: { connect: { id: category.id } } } : {}),
        tags: { connect: tags.map((tag) => ({ id: tag.id })) },
        ...(adminUser ? { createdBy: { connect: { id: adminUser.id } } } : {}),
      },
    });
  }

  // --- Glossary starter terms ---------------------------------------------
  const glossary = [
    { term: "SEO", slug: "seo", definition: "Search Engine Optimization — the practice of improving a website to increase its visibility in organic (unpaid) search results." },
    { term: "CTR", slug: "ctr", definition: "Click-Through Rate — the percentage of people who click a link or ad after seeing it, calculated as clicks divided by impressions." },
    { term: "CPC", slug: "cpc", definition: "Cost Per Click — the amount an advertiser pays each time someone clicks their ad." },
    { term: "ROAS", slug: "roas", definition: "Return on Ad Spend — revenue generated for every rupee spent on advertising." },
    { term: "Lead Generation", slug: "lead-generation", definition: "The process of attracting and converting strangers into people who have indicated interest in your product or service." },
  ];
  for (const g of glossary) {
    await prisma.glossaryTerm.upsert({
      where: { slug: g.slug },
      update: {},
      create: { ...g, status: "PUBLISHED" },
    });
  }

  // --- One clearly-labelled placeholder client card (never a fabricated company) -
  await prisma.client.upsert({
    where: { id: "placeholder-verified-client" },
    update: {},
    create: {
      id: "placeholder-verified-client",
      companyName: "Add Verified Client",
      category: "VERIFIED_CLIENT",
      verified: false,
      published: false,
      description: "Placeholder — replace with a real, permission-cleared client via /admin/clients.",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
