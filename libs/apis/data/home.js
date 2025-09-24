import { getRevalidateTime, debugFetch, logCacheHit, logCacheMiss } from "@/libs/utils";
import {
  getCachedApiResult,
  setCachedApiResult,
  hasCachedApiResult,
  isValidRegion,
  hasInFlightRequest,
  getInFlightRequest,
  setInFlightRequest
} from "@/libs/apis/cache";

// getHome
export const getHome = async (device = "desktop", preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getHome", device, preview, region)) {
      logCacheHit("getHome", device, preview, region);
      return getCachedApiResult("getHome", device, preview, region);
    }

    // Check if there's already an in-flight request for the same data
    if (hasInFlightRequest("getHome", device, preview, region)) {
      console.log('🔀 Reusing in-flight request: getHome', { device, preview, region });
      return await getInFlightRequest("getHome", device, preview, region);
    }

    logCacheMiss("getHome", device, preview, region);

    // Create a promise for the actual API call
    const apiPromise = (async () => {
      // Smart region validation
      let effectiveRegion = region;
      if (region !== "default" && isValidRegion(region) === false) {
        effectiveRegion = "default";
      }

      const basePopulate = device === "mobile"
        ? `populate[0]=banner.mobileImg&populate[1]=storyOverlay.image&populate[2]=insightMobileImg`
        : `populate[0]=banner.deskImg&populate[1]=storyOverlay.image&populate[2]=insightDeskImg`;

      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/homes?${basePopulate}&populate[3]=seo&populate[4]=seo.openGraph&populate[5]=seo.openGraph.ogImage&populate[6]=clientsSlides&populate[7]=clientsSlides.entity&populate[8]=clientsSlides.entity.logo&populate[9]=regions`;

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
        result = { data: finalResponse.data || null, error: null };
      }

      setCachedApiResult("getHome", result, device, preview, region);
      return result;
    })();

    // Register this request as in-flight
    setInFlightRequest("getHome", apiPromise, device, preview, region);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getHome", errorResult, device, preview, region);
    return errorResult;
  }
};

// getClients
export const getClients = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getClients", preview, region)) {
      logCacheHit("getClients", preview, region);
      return getCachedApiResult("getClients", preview, region);
    }
    logCacheMiss("getClients", preview, region);

    // Smart region validation
    let effectiveRegion = region;
    if (region !== "default" && isValidRegion(region) === false) {
      effectiveRegion = "default";
    }

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients?populate[entity][populate]=logo&pagination[page]=1&pagination[pageSize]=100`;

    if (preview) url += `&status=draft`;

    // Multi-region filtering: include both selected region and default as fallback
    if (effectiveRegion !== "default") {
      url += `&filters[regions][slug][$in]=${effectiveRegion}&filters[regions][slug][$in]=default`;
    } else {
      url += `&filters[regions][slug][$eq]=default`;
    }

    let response = await debugFetch(url, { next: { revalidate: getRevalidateTime(preview) } });

    let finalResponse = await response.json();

    let result;
    if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
      result = { data: null, error: finalResponse?.error?.message || "Unknown error" };
    } else {
      result = { data: finalResponse?.data || null, error: null };
    }

    setCachedApiResult("getClients", result, preview, region);
    return result;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getClients", errorResult, preview, region);
    return errorResult;
  }
};

// getClientTestimonials
export const getClientTestimonials = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getClientTestimonials", preview, region)) {
      logCacheHit("getClientTestimonials", preview, region);
      return getCachedApiResult("getClientTestimonials", preview, region);
    }
    logCacheMiss("getClientTestimonials", preview, region);

    // Smart region validation
    let effectiveRegion = region;
    if (region !== "default" && isValidRegion(region) === false) {
      effectiveRegion = "default";
    }

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/client-testimonials?populate[0]=entity.image`;

    // Multi-region filtering: include both selected region and default as fallback
    if (effectiveRegion !== "default") {
      url += `&filters[regions][slug][$in]=${effectiveRegion}&filters[regions][slug][$in]=default`;
    } else {
      url += `&filters[regions][slug][$eq]=default`;
    }

    let response = await debugFetch(url, { next: { revalidate: getRevalidateTime(preview) } });

    let finalResponse = await response.json();

    let result;
    if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
      result = { data: null, error: finalResponse?.error?.message || "Unknown error" };
    } else {
      result = { data: finalResponse?.data || null, error: null };
    }

    setCachedApiResult("getClientTestimonials", result, preview, region);
    return result;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getClientTestimonials", errorResult, preview, region);
    return errorResult;
  }
};

// getJoinTheTeam
export const getJoinTheTeam = async (preview = false, region = "default") => {
  try {
    // Check cache first
    if (hasCachedApiResult("getJoinTheTeam", preview, region)) {
      logCacheHit("getJoinTheTeam", preview, region);
      return getCachedApiResult("getJoinTheTeam", preview, region);
    }
    logCacheMiss("getJoinTheTeam", preview, region);

    // Smart region validation
    let effectiveRegion = region;
    if (region !== "default" && isValidRegion(region) === false) {
      effectiveRegion = "default";
    }

    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/join-the-teams?populate=*`;

    // Multi-region filtering: include both selected region and default as fallback
    if (effectiveRegion !== "default") {
      url += `&filters[regions][slug][$in]=${effectiveRegion}&filters[regions][slug][$in]=default`;
    } else {
      url += `&filters[regions][slug][$eq]=default`;
    }

    let response = await debugFetch(url, { next: { revalidate: getRevalidateTime(preview) } });

    let finalResponse = await response.json();

    let result;
    if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
      result = { data: null, error: finalResponse?.error?.message || "Unknown error" };
    } else {
      result = { data: finalResponse?.data || null, error: null };
    }

    setCachedApiResult("getJoinTheTeam", result, preview, region);
    return result;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult("getJoinTheTeam", errorResult, preview, region);
    return errorResult;
  }
};



// reachOut (POST request - no caching)
export const reachOut = async (formData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reach-outs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        data: {
          phone: formData.phone,
          email: formData.email,
        },
      }),
    });
    const finalResponse = await response.json();

    if (
      finalResponse?.data === null &&
      finalResponse?.error &&
      Object.keys(finalResponse?.error).length > 0
    ) {
      return { data: null, error: finalResponse?.error?.message || "Unknown error" };
    }

    return { data: finalResponse?.data, error: null };
  } catch (error) {
    return { data: null, error: error.message || "Something went wrong" };
  }
};
