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

export const getInsightBlog = async (preview = false, industry = '', slug = '') => {
  try {
    // Use Promise.all to fetch main and related content in parallel
    const mainResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?populate[0]=brandLogo&populate[1]=category&populate[2]=sub_category&populate[3]=thumbnail&populate[4]=featuredImage&populate[5]=stats&populate[6]=background&populate[7]=valueVisual&populate[8]=objective&populate[9]=solution&populate[10]=insightVisual&populate[11]=result.resultStats&populate[12]=insightTestimonial&populate[13]=insightTestimonial.image&populate[14]=seo&populate[15]=seo.openGraph&populate[16]=seo.openGraph.ogImage&filters[slug][$eq]=${slug}&filters[stats][industry][$eqi]=${industry.replace(/-/g, ' ')}&${preview ? 'status=draft' : ''}`,
      { 
        next: { revalidate: getRevalidateTime(preview) },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }
    );

    if (!mainResponse.ok) throw new Error(`Failed: ${mainResponse.status}`);

    const insight = await mainResponse.json();
    const mainInsight = insight?.data?.[0];
    if (!mainInsight) return null;

    // Extract the category slug of the main capability
    const categorySlug = mainInsight?.category?.slug;

    // Fetch related insights in parallel if we have a category
    let related = [];
    if (categorySlug) {
      try {
        // Only fetch basic fields for related items to reduce payload
        const relatedResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/insight-blogs?populate[0]=thumbnail&populate[1]=stats&populate[2]=category&fields[0]=title&fields[1]=slug&fields[2]=createdAt&pagination[pageSize]=4&filters[category][slug][$eq]=${categorySlug}&filters[slug][$ne]=${slug}`,
          {
            next: { revalidate: getRevalidateTime(preview) },
            signal: AbortSignal.timeout(5000) // 5 second timeout for related
          }
        );

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          related = relatedData?.data || [];
        }
      } catch (relatedError) {
        // Don't fail the main request if related items fail
        console.warn('Failed to fetch related insights:', relatedError);
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
