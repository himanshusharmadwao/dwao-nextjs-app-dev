import { getRevalidateTime } from "@/libs/utils";

export const getInsightCategory = async (preview = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-categories?populate=*`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getInsightBlog = async (preview = false, slug) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?populate[brandLogo][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&populate[stats][populate]=*&populate[background][populate]=*&populate[valueVisual][populate]=*&populate[objective][populate]=*&populate[solution][populate]=*&populate[insightVisual][populate]=*&populate[result][fields]=title,heading,markdownContent&populate[result][populate][resultStats]=*&populate[insightTestimonial][populate]=*&populate[seo][populate]=*&filters[slug][$eq]=${slug}&${preview ? 'status=draft' : ''}`,
      { next: { revalidate: getRevalidateTime(preview) } }
    );

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    const insight = await response.json();

    const mainInsight = insight?.data?.[0];
    if (!mainInsight) return null;

    // 2. Extract the category slug of the main capability
    const categorySlug = mainInsight.category.slug;

    // 3. Fetch related capabilities (same category, different slug)
    let related = [];
    if (categorySlug) {
      const relatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?populate[brandLogo][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&populate[stats][populate]=*&populate[background][populate]=*&populate[valueVisual][populate]=*&populate[objective][populate]=*&populate[solution][populate]=*&populate[insightVisual][populate]=*&populate[result][fields]=title,heading,markdownContent&populate[result][populate][resultStats]=*&populate[insightTestimonial][populate]=*&populate[seo][populate]=*&filters[slug][$ne]=${slug}&filters[category][slug][$eq]=${categorySlug}`,
        {
          next: { revalidate: getRevalidateTime(preview) },
        }
      );

      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        related = relatedData?.data || [];
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

// export const getAllInsightBlogs = async (preview = false) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?populate[brandLogo][populate]=*&populate[category][populate]=*&populate[sub_category][populate]=*&populate[thumbnail][populate]=*&populate[featuredImage][populate]=*&populate[stats][populate]=*&populate[background][populate]=*&populate[valueVisual][populate]=*&populate[objective][populate]=*&populate[solution][populate]=*&populate[insightVisual][populate]=*&populate[result][fields]=title,heading,markdownContent&populate[result][populate][resultStats]=*&populate[insightTestimonial][populate]=*&populate[seo][populate]=*&${preview ? 'status=draft' : ''}`,
//       { next: { revalidate: getRevalidateTime(preview) } }
//     );

//     if (!response.ok) throw new Error(`Failed: ${response.status}`);

//     return await response.json();
//   } catch (error) {
//     console.error("Error:", error);
//     throw error;
//   }
// };


export const getAllInsightBlogs = async (
  page = 1,
  pageSize = 6,
  category = null,
  subCategory = null,
  preview = false
) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?` +
      'populate[brandLogo][populate]=*&' +
      'populate[category][populate]=*&' +
      'populate[sub_category][populate]=*&' +
      'populate[thumbnail][populate]=*&' +
      'populate[featuredImage][populate]=*&' +
      'populate[stats][populate]=*&' +
      'populate[background][populate]=*&' +
      'populate[valueVisual][populate]=*&' +
      'populate[objective][populate]=*&' +
      'populate[solution][populate]=*&' +
      'populate[insightVisual][populate]=*&' +
      'populate[result][fields]=title,heading,markdownContent&' +
      'populate[result][populate][resultStats]=*&' +
      'populate[insightTestimonial][populate]=*&' +
      'populate[seo][populate]=*&' +
      `pagination[page]=${page}&pagination[pageSize]=${pageSize}&` +
      `${preview ? 'status=draft' : ''}`;

    if (category) {
      url += `&filters[category][name][$eq]=${encodeURIComponent(category)}`;
    }
    if (subCategory) {
      url += `&filters[sub_category][name][$eq]=${encodeURIComponent(subCategory)}`;
    }

    // console.log('Fetching insight blogs with URL:', url); 
    // console.log("Preview value: ", preview)

    const response = await fetch(url, {
      next: { revalidate: getRevalidateTime(preview) },
    });

    if (!response.ok) {
      throw new Error(`Failed: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    // console.log('API response:', data); 
    // console.log("Preview value: ", preview)

    return {
      data: data.data || [],
      meta: data.meta || { pagination: { total: 0 } },
    };
  } catch (error) {
    console.error('Error fetching insight blogs:', error);
    throw error;
  }
};
