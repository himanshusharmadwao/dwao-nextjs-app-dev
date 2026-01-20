import { getRevalidateTime, logCacheHit, logCacheMiss } from "@/libs/utils";
import {
  getCachedApiResult,
  setCachedApiResult,
  hasCachedApiResult,
  getInFlightRequest,
  setInFlightRequest,
  hasInFlightRequest,
} from "@/libs/apis/cache";

export const getServiceData = async (preview = false, slug, region = "default") => {
  try {
    const cacheKey = `getServiceData_${slug}_${preview}_${region}`;

    // 1. Check cache first
    if (hasCachedApiResult(cacheKey)) {
      logCacheHit("getServiceData", preview, region);
      return getCachedApiResult(cacheKey);
    }

    // 2. Check in-flight request
    if (hasInFlightRequest(cacheKey)) {
      console.log("🔀 Reusing in-flight request: getServiceData", { slug, preview, region });
      return await getInFlightRequest(cacheKey);
    }

    logCacheMiss("getServiceData", preview, region);

    // 3. Create promise for actual API call
    const apiPromise = (async () => {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-pages?` +
        `populate[0]=banner.trustedBrands&populate[1]=section.card.icon&populate[2]=InfoPanel.InfoPanel.logo` +
        `&populate[3]=InfoPanel.InfoPanel.keyStats.icon&populate[4]=clientTestimonial.testimonial.image` +
        `&populate[5]=faq&populate[6]=faq.faq&populate[7]=seo&populate[8]=seo.openGraph` +
        `&populate[9]=seo.openGraph.ogImage&populate[10]=clientsSlide&populate[11]=clientsSlide.entity` +
        `&populate[12]=clientsSlide.entity.logo&populate[13]=textBlockOne&populate[14]=textBlockOne.image` +
        `&populate[15]=textBlockTwo&populate[16]=textBlockTwo.image&` +
        `filters[slug][$eq]=${slug}`;

      if (region) {
        url += `&filters[regions][slug][$eq]=${region}`;
      }

      if (preview) {
        url += `&status=draft`;
      }

      let response = await fetch(url, {
        next: { revalidate: getRevalidateTime(preview) },
      });

      let finalResponse = await response.json();

      // fallback to default region if none found
      if (!finalResponse?.data || finalResponse?.data?.length === 0) {
        url = url.replace(
          `filters[regions][slug][$eq]=${region}`,
          `filters[regions][slug][$eq]=default`
        );
        response = await fetch(url, { next: { revalidate: getRevalidateTime(preview) } });
        finalResponse = await response.json();
      }

      if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
        const errorResult = {
          data: null,
          error: finalResponse?.error?.message || "Unknown error",
        };
        setCachedApiResult(cacheKey, errorResult);
        return errorResult;
      }

      const result = { data: finalResponse?.data || null, error: null };
      setCachedApiResult(cacheKey, result);
      return result;
    })();

    // 4. Store this promise as in-flight request
    setInFlightRequest(cacheKey, apiPromise);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    const cacheKey = `getServiceData_${slug}_${preview}_${region}`;
    setCachedApiResult(cacheKey, errorResult);
    return errorResult;
  }
};

export const getAllServiceData = async (preview = false, region = "default") => {
  try {
    const cacheKey = `getAllServiceData_${preview}_${region}`;

    // 1. Check cache
    if (hasCachedApiResult(cacheKey)) {
      logCacheHit("getAllServiceData", preview, region);
      return getCachedApiResult(cacheKey);
    }

    // 2. Check in-flight request
    if (hasInFlightRequest(cacheKey)) {
      console.log("🔀 Reusing in-flight request: getAllServiceData", { preview, region });
      return await getInFlightRequest(cacheKey);
    }

    logCacheMiss("getAllServiceData", preview, region);

    // 3. Create actual API call promise
    const apiPromise = (async () => {
      let url =
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-pages?` +
        `fields[0]=slug&fields[1]=updatedAt&fields[2]=createdAt`;

      if (region) {
        url += `&filters[regions][slug][$eq]=${region}`;
      }

      if (preview) {
        url += `&status=draft`;
      }

      let response = await fetch(url, {
        next: { revalidate: getRevalidateTime(preview) },
      });
      let finalResponse = await response.json();
      let data = finalResponse?.data || [];

      // Fallback to default region if nothing found
      if ((!data || data.length === 0) && region !== "default") {
        const fallbackUrl = url.replace(
          `filters[regions][slug][$eq]=${region}`,
          `filters[regions][slug][$eq]=default`
        );

        response = await fetch(fallbackUrl, {
          next: { revalidate: getRevalidateTime(preview) },
        });
        finalResponse = await response.json();
        data = finalResponse?.data || [];
      }

      // Error handling
      if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
        const errorResult = {
          data: null,
          error: finalResponse?.error?.message || "Unknown error",
        };
        setCachedApiResult(cacheKey, errorResult);
        return errorResult;
      }

      const result = { data, error: null };
      setCachedApiResult(cacheKey, result);
      return result;
    })();

    // 4. Mark this API call as in-flight
    setInFlightRequest(cacheKey, apiPromise);

    return await apiPromise;
  } catch (error) {
    console.error("Error:", error);
    const cacheKey = `getAllServiceData_${preview}_${region}`;
    const errorResult = { data: null, error: error.message || "Something went wrong" };
    setCachedApiResult(cacheKey, errorResult);
    return errorResult;
  }
};



export const submitLeadForm = async (formData) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/lead-forms`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
        cache: 'no-store',
      }
    );

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
