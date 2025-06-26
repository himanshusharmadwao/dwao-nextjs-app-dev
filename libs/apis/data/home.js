import { getRevalidateTime } from "@/libs/utils";

// getHome
export const getHome = async (device = "desktop", preview = false) => {
  try {
    const url = device === "mobile"
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/home?populate[0]=banner.mobileImg&populate[1]=storyOverlay.image&populate[2]=insightMobileImg&populate[3]=seo&populate[4]=seo.openGraph&populate[5]=seo.openGraph.ogImage&${preview ? 'status=draft' : ''}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/home?populate[0]=banner.deskImg&populate[1]=storyOverlay.image&populate[2]=insightDeskImg&&populate[3]=seo&populate[4]=seo.openGraph&populate[5]=seo.openGraph.ogImage&${preview ? 'status=draft' : ''}`;

    const response = await fetch(url, { next: { revalidate: getRevalidateTime(preview) } });
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// getClients
export const getClients = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients?populate=logo&pagination[page]=1&pagination[pageSize]=100`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// getClientTestimonials
export const getClientTestimonials = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/client-testimonials?populate=*`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// getJoinTheTeam
export const getJoinTheTeam = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/join-the-teams?populate=*`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
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
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
