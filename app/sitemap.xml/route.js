import { getAllBlogs } from '@/libs/apis/data/blog';
import { getAllInsightBlogs } from '@/libs/apis/data/insights';
import { getRegions } from '@/libs/apis/data/menu';

const BASE_URL = process.env.NEXT_PUBLIC_DWAO_GLOBAL_URL || 'https://dwao.com';

export async function GET() {
  try {
    // Fetch all regions
    const regionsResponse = await getRegions();
    const regions = regionsResponse?.data || [];
    const regionSlugs = regions.map(r => r.slug).filter(slug => slug !== 'default');

    // Create dynamic region to hreflang mapping
    const regionMap = {};
    regions.forEach(region => {
      if (region.slug !== 'default' && region.hreflang) {
        regionMap[region.slug] = region.hreflang;
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

    // Fetch all blogs (with regions field)
    const blogsResponse = await getAllBlogs(1, 100, null, null, false, 'default');
    const blogs = blogsResponse?.data || [];

    // Fetch all case studies
    const caseStudiesResponse = await getAllInsightBlogs(1, 100, null, null, false, 'default');
    const caseStudies = caseStudiesResponse?.data || [];

    // Generate sitemap entries
    const urls = [];

    // 1. Static pages for all regions
    const staticPages = [
      { path: '', priority: 1.0, changefreq: 'weekly' },
      { path: '/blog', priority: 0.8, changefreq: 'daily' },
      { path: '/case-studies', priority: 0.8, changefreq: 'weekly' },
      { path: '/services', priority: 0.8, changefreq: 'monthly' },
      { path: '/about', priority: 0.7, changefreq: 'monthly' },
      { path: '/contact', priority: 0.7, changefreq: 'yearly' },
    ];

    // Add static pages for default route
    staticPages.forEach(page => {
      urls.push({
        loc: `${BASE_URL}${page.path}`,
        lastmod: new Date().toISOString(),
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Add static pages for each region
    regionSlugs.forEach(region => {
      staticPages.forEach(page => {
        urls.push({
          loc: `${BASE_URL}/${region}${page.path}`,
          lastmod: new Date().toISOString(),
          changefreq: page.changefreq,
          priority: page.priority * 0.9, // Slightly lower priority for regional pages
        });
      });
    });

    // 2. Blog posts - Generate for ALL regions regardless of content settings
    blogs.forEach(blog => {
      // Default URL
      urls.push({
        loc: `${BASE_URL}/blog/${blog.slug}`,
        lastmod: blog.updatedAt || blog.createdAt,
        changefreq: 'weekly',
        priority: 0.6,
        isGlobalContent: true,
      });

      // All regional URLs
      regionSlugs.forEach(region => {
        urls.push({
          loc: `${BASE_URL}/${region}/blog/${blog.slug}`,
          lastmod: blog.updatedAt || blog.createdAt,
          changefreq: 'weekly',
          priority: 0.6,
          isGlobalContent: true,
        });
      });
    });

    // 3. Case studies - Generate for ALL regions regardless of content settings
    caseStudies.forEach(caseStudy => {
      const industry = caseStudy.stats?.industry || '';
      const slug = caseStudy.slug;
      const industrySlug = industry.toLowerCase().replace(/\s+/g, '-');

      // Default URL
      urls.push({
        loc: `${BASE_URL}/case-studies/${industrySlug}/${slug}`,
        lastmod: caseStudy.updatedAt || caseStudy.createdAt,
        changefreq: 'monthly',
        priority: 0.6,
        isGlobalContent: true,
      });

      // All regional URLs
      regionSlugs.forEach(region => {
        urls.push({
          loc: `${BASE_URL}/${region}/case-studies/${industrySlug}/${slug}`,
          lastmod: caseStudy.updatedAt || caseStudy.createdAt,
          changefreq: 'monthly',
          priority: 0.6,
          isGlobalContent: true,
        });
      });
    });

    // Generate XML with hreflang support
    const generateUrlEntry = (url) => {
      // Generate hreflang links if this is a content page
      let hreflangLinks = '';

      // Extract the path from the URL
      const urlPath = url.loc.replace(BASE_URL, '');

      // Check if this is a blog or case study page
      if (urlPath.includes('/blog/') || urlPath.includes('/case-studies/')) {
        // Extract the actual content path (removing region if present)
        let contentPath = urlPath;
        const regionMatch = urlPath.match(/^\/([a-z]{2}-[a-z]{2})\//);
        if (regionMatch) {
          contentPath = urlPath.replace(`/${regionMatch[1]}`, '');
        }

        // Generate hreflang links for all available versions
        const hreflangs = [];

        // Add default version
        hreflangs.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${contentPath}"/>`);

        // Since we're generating all content for all regions, add all regional variants
        Object.entries(regionMap).forEach(([region, hreflang]) => {
          hreflangs.push(`    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${BASE_URL}/${region}${contentPath}"/>`);
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
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