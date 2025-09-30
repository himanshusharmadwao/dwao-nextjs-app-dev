import { getRevalidateTime, debugFetch, logCacheHit, logCacheMiss } from "@/libs/utils";
import {
  getCachedApiResult,
  setCachedApiResult,
  hasCachedApiResult,
  getInFlightRequest,
  setInFlightRequest,
  hasInFlightRequest
} from "@/libs/apis/cache";

export const getCategory = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getCategory", preview, region)) {
      logCacheHit("getCategory", preview, region);
      return getCachedApiResult("getCategory", preview, region);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getCategory", preview, region)) {
      console.log('🔀 Reusing in-flight request: getCategory', { preview, region });
      return await getInFlightRequest("getCategory", preview, region);
    }

    logCacheMiss("getCategory", preview, region);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      // Only fetch the fields needed for filter display
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blog-categories?` +
        `fields[0]=name&` +
        `populate[sub_category][fields][0]=name`;

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

      setCachedApiResult("getCategory", result, preview, region);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getCategory", apiPromise, preview, region);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getCategory", errorResult, preview, region);
    return errorResult;
  }
};

export const getBlog = async (preview = false, slug, region = "default") => {
  try {
    // Check cache first
    const cacheKey = `getBlog_${slug}_${preview}_${region}`;
    if (hasCachedApiResult(cacheKey)) {
      logCacheHit("getBlog", preview, region);
      return getCachedApiResult(cacheKey);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest(cacheKey)) {
      console.log('🔀 Reusing in-flight request: getBlog', { slug, preview, region });
      return await getInFlightRequest(cacheKey);
    }

    logCacheMiss("getBlog", preview, region);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?` +
        `populate[0]=category&populate[1]=sub_category&populate[2]=author&populate[3]=author.image` +
        `&populate[4]=seo&populate[5]=seo.openGraph&populate[6]=seo.openGraph.ogImage` +
        `&populate[7]=thumbnail&populate[8]=featuredImage` +
        `&populate[9]=regions` +
        `&filters[slug][$eq]=${slug}`;

      if (preview) url += `&status=draft`;

      // Multi-region filtering for individual blog
      if (region && region !== "default") {
        url += `&filters[regions][slug][$in]=${region}&filters[regions][slug][$in]=default`;
      } else {
        url += `&filters[regions][slug][$eq]=default`;
      }

      let response = await debugFetch(url, {
        next: { revalidate: getRevalidateTime(preview) },
      });

      let finalResponse = await response.json();
      let mainBlog = finalResponse?.data?.[0];

      if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
        return { data: null, error: finalResponse?.error?.message || "Something went wrong", status: "error" };
      }

      if (!finalResponse?.data || finalResponse.data.length === 0) {
        return { data: null, message: "Not Found", status: "not_found" };
      }

      const categorySlug = mainBlog?.category?.slug;
      let related = [];

      if (categorySlug) {
        // Only fetch fields needed for related blog cards display
        let relatedUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?` +
          `fields[0]=title&fields[1]=slug` +
          `&pagination[pageSize]=4` +
          `&filters[slug][$ne]=${slug}` +
          `&filters[category][slug][$eq]=${categorySlug}`;

        // Multi-region filtering for related blogs
        if (region && region !== "default") {
          relatedUrl += `&filters[regions][slug][$in]=${region}&filters[regions][slug][$in]=default`;
        } else {
          relatedUrl += `&filters[regions][slug][$eq]=default`;
        }

        const relatedResponse = await debugFetch(relatedUrl, {
          next: { revalidate: getRevalidateTime(preview) },
        });

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          related = relatedData?.data || [];
        }
      }

      const result = {
        data: [mainBlog],
        related,
      };

      setCachedApiResult(cacheKey, result);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest(cacheKey, apiPromise);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    const cacheKey = `getBlog_${slug}_${preview}_${region}`;
    setCachedApiResult(cacheKey, errorResult);
    return errorResult;
  }
};

// Optimized blog listing function with minimal fields
export const getAllBlogs = async (
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
    if (hasCachedApiResult("getAllBlogs", cacheKey)) {
      logCacheHit("getAllBlogs", preview, region);
      return getCachedApiResult("getAllBlogs", cacheKey);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getAllBlogs", cacheKey)) {
      console.log('🔀 Reusing in-flight request: getAllBlogs', cacheKey);
      return await getInFlightRequest("getAllBlogs", cacheKey);
    }

    logCacheMiss("getAllBlogs", preview, region);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      // Only fetch fields needed for listing display (including regions for sitemap)
      let url =
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?` +
        `fields[0]=title&fields[1]=slug&fields[2]=excerpt&fields[3]=createdAt&fields[4]=updatedAt` +
        `&populate[thumbnail][fields][0]=url` +
        `&populate[thumbnail][fields][1]=alternativeText` +
        `&populate[thumbnail][fields][2]=width` +
        `&populate[thumbnail][fields][3]=height` +
        `&populate[category][fields][0]=name` +
        `&populate[sub_category][fields][0]=name` +
        `&populate[regions][fields][0]=slug` +
        `&pagination[page]=${page}&pagination[pageSize]=${pageSize}` +
        `&sort[0]=createdAt:desc`;

      if (preview) url += `&status=draft`;
      if (category) url += `&filters[category][name][$eq]=${encodeURIComponent(category)}`;
      if (subCategory) url += `&filters[sub_category][name][$eq]=${encodeURIComponent(subCategory)}`;

      // Multi-region filtering for blog posts
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
        result = {
          data: finalResponse?.data || [],
          meta: finalResponse?.meta || { pagination: { total: 0 } },
        };
      }

      setCachedApiResult("getAllBlogs", result, cacheKey);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getAllBlogs", apiPromise, cacheKey);

    return await apiPromise;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    const errorResult = {
      data: [],
      meta: { pagination: { total: 0 } },
      error: error.message || "Something went wrong"
    };
    setCachedApiResult("getAllBlogs", errorResult, cacheKey);
    return errorResult;
  }
};
