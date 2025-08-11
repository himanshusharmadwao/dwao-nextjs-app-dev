import { getRevalidateTime } from "@/libs/utils";

// Get Main Menu with region support
export const getMenu = async (preview = false, region = "default") => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus?populate[menu][populate][subMenu][populate]=subSubMenu&populate=regions`;

    if (preview) url += `&status=draft`;
    if (region) url += `&filters[regions][slug][$eq]=${region}`;

    let response = await fetch(url, {
      next: { revalidate: getRevalidateTime(preview) },
    });

    let finalResponse = await response.json();

    if (!finalResponse?.data || finalResponse?.data?.length === 0) {
      response = await fetch(url.replace(region, "default"), {
        next: { revalidate: getRevalidateTime(preview) },
      });
      finalResponse = await response.json();
    }

    if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
      return { data: null, error: finalResponse?.error?.message || "Unknown error" };
    }

    return { data: finalResponse?.data || null, error: null };
  } catch (error) {
    console.error("Error:", error);
    return { data: null, error: error.message || "Something went wrong" };
  }
};

// Get Secondary Menu with region support
export const getSecondaryMenu = async (preview = false, region = "default") => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/secondary-menus?populate[menu][populate][subMenu][populate]=subSubMenu&populate=regions`;

    if (preview) url += `&status=draft`;
    if (region) url += `&filters[regions][slug][$eq]=${region}`;

    let response = await fetch(url, {
      next: { revalidate: getRevalidateTime(preview) },
    });

    let finalResponse = await response.json();

    if (!finalResponse?.data || finalResponse?.data?.length === 0) {
      response = await fetch(url.replace(region, "default"), {
        next: { revalidate: getRevalidateTime(preview) },
      });
      finalResponse = await response.json();
    }

    if (finalResponse?.error && Object.keys(finalResponse?.error).length > 0) {
      return { data: null, error: finalResponse?.error?.message || "Unknown error" };
    }

    return { data: finalResponse?.data || null, error: null };
  } catch (error) {
    console.error("Error:", error);
    return { data: null, error: error.message || "Something went wrong" };
  }
};


export const getRegions = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/regions`,
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
