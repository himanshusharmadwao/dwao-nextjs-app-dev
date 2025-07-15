import { getRevalidateTime } from "@/libs/utils";

// getHome
export const getHome = async (device = "desktop", preview = false) => {
  try {
    const url =
      device === "mobile"
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/home?populate[0]=banner.mobileImg&populate[1]=storyOverlay.image&populate[2]=insightMobileImg&populate[3]=seo&populate[4]=seo.openGraph&populate[5]=seo.openGraph.ogImage&populate[6]=clientsSlides&populate[7]=clientsSlides.entity&populate[8]=clientsSlides.entity.logo&${preview ? "status=draft" : ""}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/home?populate[0]=banner.deskImg&populate[1]=storyOverlay.image&populate[2]=insightDeskImg&populate[3]=seo&populate[4]=seo.openGraph&populate[5]=seo.openGraph.ogImage&populate[6]=clientsSlides&populate[7]=clientsSlides.entity&populate[8]=clientsSlides.entity.logo&${preview ? "status=draft" : ""}`;

    const response = await fetch(url, {
      next: { revalidate: getRevalidateTime(preview) },
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

// getClients
export const getClients = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients?populate[entity][populate]=logo&pagination[page]=1&pagination[pageSize]=100`,
      { next: { revalidate: getRevalidateTime(preview) } }
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

// getClientTestimonials
export const getClientTestimonials = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/client-testimonials?populate=*`,
      { next: { revalidate: getRevalidateTime(preview) } }
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

// getJoinTheTeam
export const getJoinTheTeam = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/join-the-teams?populate=*`,
      { next: { revalidate: getRevalidateTime(preview) } }
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
