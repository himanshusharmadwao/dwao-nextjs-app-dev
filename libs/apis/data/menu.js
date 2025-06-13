import { getRevalidateTime } from "@/libs/utils";

export const getMenu = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus?populate[menu][populate][subMenu][populate]=subSubMenu`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getSecondaryMenu = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/secondary-menus?populate[menu][populate][subMenu][populate]=subSubMenu`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
