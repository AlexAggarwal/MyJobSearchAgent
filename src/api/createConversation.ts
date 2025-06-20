import { IConversation } from "@/types";

export const createConversation = async (): Promise<IConversation> => {
  // Get API key from environment
  const token = import.meta.env.VITE_TAVUS_API_KEY;
  
  if (!token) {
    throw new Error('VITE_TAVUS_API_KEY is not configured in environment variables');
  }

  const response = await fetch('https://tavusapi.com/v2/conversations', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token
    },
    body: JSON.stringify({
      "persona_id": "pe13ed370726"
    }),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};