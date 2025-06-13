import { getRevalidateTime } from "@/libs/utils";

export const getAboutData = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/about?populate[0]=bannerDeskImage&populate[1]=bannerMobileImage&populate[2]=valueVisual&populate[3]=intro.image&populate[4]=workPlace.image&populate[5]=partner.image&populate[6]=service.image&populate[7]=industry.image&populate[8]=impact.image&populate[9]=expert.image&populate[10]=demoOverlay.image&populate[12]=client&${preview ? 'status=draft' : ''}`,
      {
        next: { revalidate: getRevalidateTime(preview) },
      }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getReachOutUI = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/reach-out-uis`,
      {
        next: { revalidate: getRevalidateTime(preview) },
      }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
