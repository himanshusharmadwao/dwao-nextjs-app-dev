export const submitSubscriber = async (formData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        data: {
          email: formData,
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
