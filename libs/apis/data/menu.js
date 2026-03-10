import { getRevalidateTime, debugFetch, logCacheHit, logCacheMiss } from "@/libs/utils";
import {
  getCachedRegions,
  setCachedRegions,
  getCachedApiResult,
  setCachedApiResult,
  hasCachedApiResult,
  isValidRegion,
  getInFlightRequest,
  setInFlightRequest,
  hasInFlightRequest
} from "@/libs/apis/cache";

// Get Main Menu with region support
export const getMenu = async (preview = false, region = "default") => {
  try {
    // Check cache first
    const cacheKey = `getMenu_${preview}_${region}`;
    if (hasCachedApiResult("getMenu", preview, region)) {
      logCacheHit("getMenu", preview, region);
      return getCachedApiResult("getMenu", preview, region);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getMenu", preview, region)) {
      console.log('🔀 Reusing in-flight request: getMenu', { preview, region });
      return await getInFlightRequest("getMenu", preview, region);
    }

    logCacheMiss("getMenu", preview, region);

    // Smart region validation - skip invalid region call if we know it's invalid
    let effectiveRegion = region;
    if (region !== "default") {
      const regionValid = isValidRegion(region);
      if (regionValid === false) {
        // We know this region is invalid, go straight to default
        effectiveRegion = "default";
      }
    }

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus?populate[menu][populate][subMenu][populate]=subSubMenu&populate=regions`;

      if (preview) url += `&status=draft`;

      // Multi-region filtering: include both selected region and default as fallback
      if (effectiveRegion !== "default") {
        url += `&filters[regions][slug][$in]=${effectiveRegion}&filters[regions][slug][$in]=default`;
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

      // Cache the result
      setCachedApiResult("getMenu", result, preview, region);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getMenu", apiPromise, preview, region);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getMenu", errorResult, preview, region);
    return errorResult;
  }
};

// Get Legal Menu with region support
export const getLegalMenu = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getLegalMenu", preview, region)) {
      logCacheHit("getLegalMenu", preview, region);
      return getCachedApiResult("getLegalMenu", preview, region);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getLegalMenu", preview, region)) {
      console.log('🔀 Reusing in-flight request: getLegalMenu', { preview, region });
      return await getInFlightRequest("getLegalMenu", preview, region);
    }

    logCacheMiss("getLegalMenu", preview, region);

    // Smart region validation
    let effectiveRegion = region;
    if (region !== "default" && isValidRegion(region) === false) {
      effectiveRegion = "default";
    }

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/legal-menus/?populate[menu][populate][subMenu][populate]=subSubMenu&populate=regions`;

      if (preview) url += `&status=draft`;

      // Multi-region filtering: include both selected region and default as fallback
      if (effectiveRegion !== "default") {
        url += `&filters[regions][slug][$in]=${effectiveRegion}&filters[regions][slug][$in]=default`;
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

      setCachedApiResult("getLegalMenu", result, preview, region);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getLegalMenu", apiPromise, preview, region);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getLegalMenu", errorResult, preview, region);
    return errorResult;
  }
};

// Get Quick Links with region support
export const getQuickLinks = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getQuickLinks", preview, region)) {
      logCacheHit("getQuickLinks", preview, region);
      return getCachedApiResult("getQuickLinks", preview, region);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getQuickLinks", preview, region)) {
      console.log('🔀 Reusing in-flight request: getQuickLinks', { preview, region });
      return await getInFlightRequest("getQuickLinks", preview, region);
    }

    logCacheMiss("getQuickLinks", preview, region);

    // Smart region validation
    let effectiveRegion = region;
    if (region !== "default" && isValidRegion(region) === false) {
      effectiveRegion = "default";
    }

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/quick-links/?populate[menu][populate][subMenu][populate]=subSubMenu&populate=regions`;

      if (preview) url += `&status=draft`;

      // Multi-region filtering: include both selected region and default as fallback
      if (effectiveRegion !== "default") {
        url += `&filters[regions][slug][$in]=${effectiveRegion}&filters[regions][slug][$in]=default`;
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

      setCachedApiResult("getQuickLinks", result, preview, region);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getQuickLinks", apiPromise, preview, region);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getQuickLinks", errorResult, preview, region);
    return errorResult;
  }
};


// Get Secondary Menu with region support
export const getSecondaryMenu = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getSecondaryMenu", preview, region)) {
      logCacheHit("getSecondaryMenu", preview, region);
      return getCachedApiResult("getSecondaryMenu", preview, region);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getSecondaryMenu", preview, region)) {
      console.log('🔀 Reusing in-flight request: getSecondaryMenu', { preview, region });
      return await getInFlightRequest("getSecondaryMenu", preview, region);
    }

    logCacheMiss("getSecondaryMenu", preview, region);

    // Smart region validation
    let effectiveRegion = region;
    if (region !== "default" && isValidRegion(region) === false) {
      effectiveRegion = "default";
    }

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/secondary-menus?populate[menu][populate][subMenu][populate]=subSubMenu&populate=regions`;

      if (preview) url += `&status=draft`;

      // Multi-region filtering: include both selected region and default as fallback
      if (effectiveRegion !== "default") {
        url += `&filters[regions][slug][$in]=${effectiveRegion}&filters[regions][slug][$in]=default`;
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

      setCachedApiResult("getSecondaryMenu", result, preview, region);
      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getSecondaryMenu", apiPromise, preview, region);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getSecondaryMenu", errorResult, preview, region);
    return errorResult;
  }
};


export const getRegions = async (preview = false) => {
  try {
    // Check cache first - this eliminates 5 out of 6 redundant calls
    const cached = getCachedRegions();
    if (cached) {
      logCacheHit("getRegions", preview);
      return cached;
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getRegions", preview)) {
      console.log('🔀 Reusing in-flight request: getRegions', { preview });
      return await getInFlightRequest("getRegions", preview);
    }

    logCacheMiss("getRegions", preview);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      const response = await debugFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/regions`,
        { next: { revalidate: getRevalidateTime(preview) } }
      );

      const finalResponse = await response.json();

      let result;
      if (
        finalResponse?.data === null &&
        finalResponse?.error &&
        Object.keys(finalResponse?.error).length > 0
      ) {
        result = { data: null, error: finalResponse?.error?.message || "Unknown error" };
      } else {
        result = { data: finalResponse?.data, error: null };
      }

      // Cache the result for this request lifecycle
      setCachedRegions(result);

      return result;
    })();

    // Store this promise as an in-flight request
    setInFlightRequest("getRegions", apiPromise, preview);

    return await apiPromise;
  } catch (error) {
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedRegions(errorResult);
    return errorResult;
  }
};
