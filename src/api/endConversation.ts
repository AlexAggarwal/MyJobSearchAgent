export const endConversation = async (conversationId: string) => {
  // Get API key from environment
  const token = import.meta.env.VITE_TAVUS_API_KEY;
  
  if (!token) {
    throw new Error('VITE_TAVUS_API_KEY is not configured in environment variables');
  }

  try {
    const response = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}/end`,
      {
        method: "POST",
        headers: {
          "x-api-key": token,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to end conversation");
    }

    return null;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};