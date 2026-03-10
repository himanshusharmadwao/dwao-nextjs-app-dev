import { getRevalidateTime, debugFetch, logCacheHit, logCacheMiss } from "@/libs/utils";
import {
  getCachedApiResult,
  setCachedApiResult,
  hasCachedApiResult,
  getInFlightRequest,
  setInFlightRequest,
  hasInFlightRequest
} from "@/libs/apis/cache";

// Fetch Insight Categories (with optional region filter)
export const getInsightCategory = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getInsightCategory", preview, region)) {
      logCacheHit("getInsightCategory", preview, region);
      return getCachedApiResult("getInsightCategory", preview, region);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getInsightCategory", preview, region)) {
      console.log('🔀 Reusing in-flight request: getInsightCategory', { preview, region });
      return await getInFlightRequest("getInsightCategory", preview, region);
    }

    logCacheMiss("getInsightCategory", preview, region);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-categories?populate=*`;

      if (preview) url += `&status=draft`;

      // Multi-region filtering: include both selected region and default as fallback
      if (region && region !== "default") {
        url += `&filters[regions][slug][$in]=${region}&filters[regions][slug][$in]=default`;
      } else {
        url += `&filters[regions][slug][$eq]=default`;
      }

      let response = await debugFetch(url, {
        next: { revalidate: getRevalidateTime(preview) },
      });

      let finalResponse = await response.json();

      let result;
      if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
        result = { data: null, error: finalResponse?.error?.message || "Unknown error" };
      } else {
        result = { data: finalResponse?.data || null, error: null };
      }

      setCachedApiResult("getInsightCategory", result, preview, region);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getInsightCategory", apiPromise, preview, region);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getInsightCategory", errorResult, preview, region);
    return errorResult;
  }
};

// Fetch Insight Blogs for Listing (Optimized with minimal fields)
export const getInsightBlogsListing = async (
  page = 1,
  pageSize = 6,
  category = null,
  subCategory = null,
  preview = false,
  region = "default"
) => {
  try {
    // Create cache key with all parameters
    const cacheKey = { page, pageSize, category, subCategory, preview, region, listing: true };

    // Check cache first
    if (hasCachedApiResult("getInsightBlogsListing", cacheKey)) {
      logCacheHit("getInsightBlogsListing", preview, region);
      return getCachedApiResult("getInsightBlogsListing", cacheKey);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getInsightBlogsListing", cacheKey)) {
      console.log('🔀 Reusing in-flight request: getInsightBlogsListing', cacheKey);
      return await getInFlightRequest("getInsightBlogsListing", cacheKey);
    }

    logCacheMiss("getInsightBlogsListing", preview, region);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      // Only fetch the fields needed for listing display
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?` +
        'fields[0]=title&' +
        'fields[1]=slug&' +
        'populate[thumbnail][fields][0]=url&' +
        'populate[thumbnail][fields][1]=alternativeText&' +
        'populate[thumbnail][fields][2]=width&' +
        'populate[thumbnail][fields][3]=height&' +
        'populate[category][fields][0]=name&' +
        'populate[category][fields][1]=slug&' +
        'populate[sub_category][fields][0]=name&' +
        'populate[sub_category][fields][1]=slug&' +
        'populate[stats][fields][0]=industry&' +
        `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

      if (category) {
        url += `&filters[category][name][$eq]=${encodeURIComponent(category)}`;
      }

      if (subCategory) {
        url += `&filters[sub_category][name][$eq]=${encodeURIComponent(subCategory)}`;
      }

      // Multi-region filtering for insight blogs
      if (region && region !== "default") {
        url += `&filters[regions][slug][$in]=${region}&filters[regions][slug][$in]=default`;
      } else {
        url += `&filters[regions][slug][$eq]=default`;
      }

      if (preview) {
        url += `&status=draft`;
      }

      let response = await debugFetch(url, {
        next: { revalidate: getRevalidateTime(preview) },
      });

      let finalResponse = await response.json();

      let result;
      if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
        result = { data: null, error: finalResponse?.error?.message || "Unknown error" };
      } else {
        result = {
          data: finalResponse?.data || [],
          meta: finalResponse?.meta || { pagination: { total: 0 } },
        };
      }

      setCachedApiResult("getInsightBlogsListing", result, cacheKey);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getInsightBlogsListing", apiPromise, cacheKey);

    return await apiPromise;
  } catch (error) {
    console.error("Error fetching insight blogs listing:", error);
    const errorResult = {
      data: [],
      meta: { pagination: { total: 0 } },
      error: error.message || "Something went wrong"
    };
    setCachedApiResult("getInsightBlogsListing", errorResult, cacheKey);
    return errorResult;
  }
};

// Fetch Single Insight Blog with Related (region-aware)
export const getInsightBlog = async (preview = false, industry = '', slug = '', region = "default") => {
  try {
    // Keep original populate structure but without thumbnail
    let mainUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?` +
      `populate[0]=brandLogo&populate[1]=category&populate[2]=sub_category` +
      `&populate[3]=featuredImage&populate[4]=stats&populate[5]=background&populate[6]=valueVisual` +
      `&populate[7]=objective&populate[8]=solution&populate[9]=insightVisual` +
      `&populate[10]=result.resultStats&populate[11]=insightTestimonial&populate[12]=insightTestimonial.image` +
      `&populate[13]=seo&populate[14]=seo.openGraph&populate[15]=seo.openGraph.ogImage` +
      `&filters[slug][$eq]=${slug}` +
      `&filters[stats][industry][$eqi]=${industry.replace(/-/g, ' ')}`;

    // Multi-region filtering for insight blog
    if (region && region !== "default") {
      mainUrl += `&filters[regions][slug][$in]=${region}&filters[regions][slug][$in]=default`;
    } else {
      mainUrl += `&filters[regions][slug][$eq]=default`;
    }
    if (preview) mainUrl += `&status=draft`;

    let response = await debugFetch(mainUrl, {
      next: { revalidate: getRevalidateTime(preview) },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    const insight = await response.json();
    let mainInsight = insight?.data?.[0];

    if (!mainInsight) return null;

    const categorySlug = mainInsight?.category?.slug;

    let related = [];
    if (categorySlug) {
      try {
        // Only fetch fields needed for related cards display
        let relatedUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?` +
          `fields[0]=title&` +
          `fields[1]=slug&` +
          `populate[thumbnail][fields][0]=url&` +
          `populate[thumbnail][fields][1]=alternativeText&` +
          `populate[thumbnail][fields][2]=width&` +
          `populate[thumbnail][fields][3]=height&` +
          `populate[stats][fields][0]=industry&` +
          `pagination[pageSize]=4&filters[category][slug][$eq]=${categorySlug}` +
          `&filters[slug][$ne]=${slug}`;

        // Multi-region filtering for related insights
        if (region && region !== "default") {
          relatedUrl += `&filters[regions][slug][$in]=${region}&filters[regions][slug][$in]=default`;
        } else {
          relatedUrl += `&filters[regions][slug][$eq]=default`;
        }
        if (preview) relatedUrl += `&status=draft`;

        const relatedResponse = await debugFetch(relatedUrl, {
          next: { revalidate: getRevalidateTime(preview) },
          signal: AbortSignal.timeout(5000),
        });

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          related = relatedData?.data || [];
        }
      } catch (relatedError) {
        console.warn("Failed to fetch related insights:", relatedError);
      }
    }

    return {
      data: [mainInsight],
      related,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Fetch All Insight Blogs (region-aware)
export const getAllInsightBlogs = async (
  page = 1,
  pageSize = 6,
  category = null,
  subCategory = null,
  preview = false,
  region = "default"
) => {
  try {
    // Create cache key with all parameters
    const cacheKey = { page, pageSize, category, subCategory, preview, region };

    // Check cache first
    if (hasCachedApiResult("getAllInsightBlogs", cacheKey)) {
      logCacheHit("getAllInsightBlogs", preview, region);
      return getCachedApiResult("getAllInsightBlogs", cacheKey);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getAllInsightBlogs", cacheKey)) {
      console.log('🔀 Reusing in-flight request: getAllInsightBlogs', cacheKey);
      return await getInFlightRequest("getAllInsightBlogs", cacheKey);
    }

    logCacheMiss("getAllInsightBlogs", preview, region);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      let url =
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?` +
        `fields[0]=title&fields[1]=slug&fields[2]=insightStatus&` +
        `populate[thumbnail][fields][0]=url&` +
        `populate[category][fields][0]=name&` +
        `populate[sub_category][fields][0]=name&` +
        `populate[regions][fields][0]=slug&` +
        `populate[stats]=*&` +
        `pagination[page]=${page}&pagination[pageSize]=${pageSize}` +
        `&sort[0]=createdAt:desc`;

      if (category) {
        url += `&filters[category][name][$eq]=${encodeURIComponent(category)}`;
      }

      if (subCategory) {
        url += `&filters[sub_category][name][$eq]=${encodeURIComponent(subCategory)}`;
      }

      // Multi-region filtering for insight blogs
      if (region && region !== "default") {
        url += `&filters[regions][slug][$in]=${region}&filters[regions][slug][$in]=default`;
      } else {
        url += `&filters[regions][slug][$eq]=default`;
      }

      if (preview) {
        url += `&status=draft`;
      }

      let response = await debugFetch(url, {
        next: { revalidate: getRevalidateTime(preview) },
      });

      let finalResponse = await response.json();

      let result;
      if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
        result = { data: null, error: finalResponse?.error?.message || "Unknown error" };
      } else {
        result = {
          data: finalResponse?.data || [],
          meta: finalResponse?.meta || { pagination: { total: 0 } },
        };
      }

      setCachedApiResult("getAllInsightBlogs", result, cacheKey);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getAllInsightBlogs", apiPromise, cacheKey);

    return await apiPromise;
  } catch (error) {
    console.error("Error fetching insight blogs:", error);
    const errorResult = {
      data: [],
      meta: { pagination: { total: 0 } },
      error: error.message || "Something went wrong"
    };
    setCachedApiResult("getAllInsightBlogs", errorResult, cacheKey);
    return errorResult;
  }
};
