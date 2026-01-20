import { getAllBlogs } from '@/libs/apis/data/blog';
import { getAllInsightBlogs } from '@/libs/apis/data/insights';
import { getRegions } from '@/libs/apis/data/menu';
import { getAllCapabilities } from '@/libs/apis/data/capabilities';
import { getAllPartners } from '@/libs/apis/data/partners';

const BASE_URL = process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL || 'https://dwao.com';

export async function GET() {
  try {
    // Fetch all regions
    const regionsResponse = await getRegions();
    const regions = regionsResponse?.data || [];
    // Exclude 'default' and 'in-en' (India) from sitemap
    const regionSlugs = regions
      .map(r => r.slug)
      .filter(slug => slug !== 'default' && slug !== 'in-en');

    // Create dynamic region to hreflang mapping
    const regionMap = {};
    regions.forEach(region => {
      if (region.slug !== 'default' && region.hrefLang) {
        regionMap[region.slug] = region.hrefLang;
      }
    });

    // Fallback mapping if hreflang not provided in Strapi
    const fallbackRegionMap = {
      'au-en': 'en-AU',
      'in-en': 'en-IN',
      'ie-en': 'en-IE',
      'uk-en': 'en-GB',
      'us-en': 'en-US'
    };

    // Merge with fallback for any missing hreflang values
    Object.keys(fallbackRegionMap).forEach(key => {
      if (!regionMap[key]) {
        regionMap[key] = fallbackRegionMap[key];
      }
    });

    // Fetch all blogs with pagination (to ensure we get ALL blogs)
    const blogs = [];
    let blogPage = 1;
    let hasMoreBlogs = true;
    const blogsPerPage = 100;

    while (hasMoreBlogs) {
      const blogsResponse = await getAllBlogs(blogPage, blogsPerPage, null, null, false, 'default');
      const pageBlogs = blogsResponse?.data || [];

      if (pageBlogs.length > 0) {
        blogs.push(...pageBlogs);
        blogPage++;
        // If we got less than the page size, we've reached the end
        hasMoreBlogs = pageBlogs.length === blogsPerPage;
      } else {
        hasMoreBlogs = false;
      }
    }

    // Fetch all case studies with pagination
    const caseStudies = [];
    let caseStudyPage = 1;
    let hasMoreCaseStudies = true;
    const caseStudiesPerPage = 100;

    while (hasMoreCaseStudies) {
      const caseStudiesResponse = await getAllInsightBlogs(caseStudyPage, caseStudiesPerPage, null, null, false, 'default');
      const pageCaseStudies = caseStudiesResponse?.data || [];

      if (pageCaseStudies.length > 0) {
        caseStudies.push(...pageCaseStudies);
        caseStudyPage++;
        hasMoreCaseStudies = pageCaseStudies.length === caseStudiesPerPage;
      } else {
        hasMoreCaseStudies = false;
      }
    }

    // Fetch all capabilities/services with pagination
    const capabilities = [];
    let capabilityPage = 1;
    let hasMoreCapabilities = true;
    const capabilitiesPerPage = 100;

    while (hasMoreCapabilities) {
      const capabilitiesResponse = await getAllCapabilities(capabilityPage, capabilitiesPerPage, false, 'default');
      const pageCapabilities = capabilitiesResponse?.data || [];

      if (pageCapabilities.length > 0) {
        capabilities.push(...pageCapabilities);
        capabilityPage++;
        hasMoreCapabilities = pageCapabilities.length === capabilitiesPerPage;
      } else {
        hasMoreCapabilities = false;
      }
    }

    // Fetch all partners with pagination
    const partners = [];
    let partnerPage = 1;
    let hasMorePartners = true;
    const partnersPerPage = 100;

    while (hasMorePartners) {
      const partnersResponse = await getAllPartners(partnerPage, partnersPerPage, false, 'default');
      const pagePartners = partnersResponse?.data || [];

      if (pagePartners.length > 0) {
        partners.push(...pagePartners);
        partnerPage++;
        hasMorePartners = pagePartners.length === partnersPerPage;
      } else {
        hasMorePartners = false;
      }
    }

    // Generate sitemap entries
    const urls = [];

    // 1. Static pages with regional variants
    const staticPages = [
      { path: '', priority: 1.0, changefreq: 'weekly' },
      { path: '/blog', priority: 0.8, changefreq: 'daily' },
      { path: '/case-studies', priority: 0.8, changefreq: 'weekly' },
      { path: '/services', priority: 0.8, changefreq: 'monthly' },
      { path: '/partners', priority: 0.8, changefreq: 'monthly' },
      { path: '/about', priority: 0.7, changefreq: 'monthly' },
      { path: '/about/culture', priority: 0.7, changefreq: 'monthly' },
      { path: '/contact', priority: 0.7, changefreq: 'yearly' },
    ];

    // Add static pages with hreflang support (one entry per page with all regional variants)
    staticPages.forEach(page => {
      urls.push({
        loc: `${BASE_URL}${page.path}`,
        lastmod: new Date().toISOString(),
        changefreq: page.changefreq,
        priority: page.priority,
        isStaticPage: true,
        regionalVariants: regionSlugs,
      });
    });

    // 2. Blog posts - One entry per blog with all regional variants
    blogs.forEach(blog => {
      urls.push({
        loc: `${BASE_URL}/blog/${blog.slug}`,
        lastmod: blog.updatedAt || blog.createdAt,
        changefreq: 'weekly',
        priority: 0.6,
        isGlobalContent: true,
        regionalVariants: regionSlugs,
      });
    });

    // 3. Case studies - One entry per case study with all regional variants
    caseStudies.forEach(caseStudy => {
      const industry = caseStudy.stats?.industry || '';
      const slug = caseStudy.slug;
      const industrySlug = industry.toLowerCase().replace(/\s+/g, '-');

      urls.push({
        loc: `${BASE_URL}/case-studies/${industrySlug}/${slug}`,
        lastmod: caseStudy.updatedAt || caseStudy.createdAt,
        changefreq: 'monthly',
        priority: 0.6,
        isGlobalContent: true,
        regionalVariants: regionSlugs,
      });
    });

    // 4. Capabilities/Services - One entry per service with all regional variants
    capabilities.forEach(capability => {
      const categorySlug = capability.category?.slug || '';
      const slug = capability.slug;

      // Build the service URL based on the routing structure
      // Route pattern: /services/[slug1]/[slug2] where slug1 = category, slug2 = capability
      // If slug equals categorySlug, it's a category landing page: /services/{category}
      // Otherwise it's a specific service: /services/{category}/{service}
      let servicePath = '/services';

      if (categorySlug && slug !== categorySlug) {
        // Specific service page: /services/{category}/{service}
        servicePath += `/${categorySlug}/${slug}`;
      } else if (categorySlug) {
        // Category landing page where slug === categorySlug: /services/{category}
        servicePath += `/${categorySlug}`;
      } else {
        // No category, just the slug: /services/{slug}
        servicePath += `/${slug}`;
      }

      urls.push({
        loc: `${BASE_URL}${servicePath}`,
        lastmod: capability.updatedAt || capability.createdAt,
        changefreq: 'monthly',
        priority: 0.7,
        isGlobalContent: true,
        regionalVariants: regionSlugs,
      });
    });

    // 5. Partners - One entry per partner with all regional variants
    partners.forEach(partner => {
      const slug = partner.slug;

      urls.push({
        loc: `${BASE_URL}/partners/${slug}`,
        lastmod: partner.updatedAt || partner.createdAt,
        changefreq: 'monthly',
        priority: 0.7,
        isGlobalContent: true,
        regionalVariants: regionSlugs,
      });
    });

    // Generate XML with hreflang support
    const generateUrlEntry = (url) => {
      let hreflangLinks = '';

      // Generate hreflang links if this page has regional variants
      if (url.regionalVariants && url.regionalVariants.length > 0) {
        const hreflangs = [];

        // Extract the content path from the URL
        const contentPath = url.loc.replace(BASE_URL, '');

        // Add x-default (the default region version)
        hreflangs.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${contentPath}"/>`);

        // Add all regional variants
        url.regionalVariants.forEach(regionSlug => {
          const hreflang = regionMap[regionSlug];
          if (hreflang) {
            // For static pages (home, contact, etc.), the regional URL is just /region
            // For content pages (blog, case studies), it's /region/content-path
            const regionalUrl = url.isStaticPage && contentPath === ''
              ? `${BASE_URL}/${regionSlug}`
              : `${BASE_URL}/${regionSlug}${contentPath}`;

            hreflangs.push(`    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${regionalUrl}"/>`);
          }
        });

        hreflangLinks = '\n' + hreflangs.join('\n');
      }

      return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority}</priority>${hreflangLinks}
  </url>`;
    };

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(generateUrlEntry).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return a basic sitemap with just the homepage on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}