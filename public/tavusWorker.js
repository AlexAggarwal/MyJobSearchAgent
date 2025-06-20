// Tavus API Worker
// This worker handles all Tavus API calls in a background thread

let currentConversationId = null;
let apiKey = null;

// Worker message handler
self.onmessage = async function(e) {
  const { type, payload } = e.data;
  
  try {
    switch (type) {
      case 'SET_API_KEY':
        apiKey = payload.apiKey;
        self.postMessage({ type: 'API_KEY_SET' });
        break;
        
      case 'CREATE_CONVERSATION':
        await handleCreateConversation(payload);
        break;
        
      case 'END_CONVERSATION':
        await handleEndConversation(payload);
        break;
        
      default:
        self.postMessage({
          type: 'ERROR',
          error: `Unknown message type: ${type}`
        });
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message || 'Worker error occurred'
    });
  }
};

async function handleCreateConversation(payload) {
  try {
    if (!apiKey) {
      throw new Error('API key not set');
    }

    self.postMessage({
      type: 'CREATE_CONVERSATION_START'
    });

    const requestPayload = {
      "persona_id": "pe13ed370726",
      "conversation_name": "AI Interview"
    };

    // Make the API call to create conversation
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const conversationData = await response.json();
    
    // Store the conversation ID for potential cleanup
    currentConversationId = conversationData.conversation_id;

    self.postMessage({
      type: 'CREATE_CONVERSATION_SUCCESS',
      data: conversationData
    });

  } catch (error) {
    self.postMessage({
      type: 'CREATE_CONVERSATION_ERROR',
      error: error.message || 'Failed to create conversation'
    });
  }
}

async function handleEndConversation(payload) {
  try {
    if (!apiKey) {
      throw new Error('API key not set');
    }

    const conversationId = payload?.conversationId || currentConversationId;
    
    if (!conversationId) {
      self.postMessage({
        type: 'END_CONVERSATION_SUCCESS',
        data: { message: 'No conversation to end' }
      });
      return;
    }

    self.postMessage({
      type: 'END_CONVERSATION_START'
    });

    // Make the API call to end conversation
    const response = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}/end`, {
      method: 'POST',
      headers: {
        "x-api-key": apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear the stored conversation ID
    currentConversationId = null;

    self.postMessage({
      type: 'END_CONVERSATION_SUCCESS',
      data: { message: 'Conversation ended successfully' }
    });

  } catch (error) {
    self.postMessage({
      type: 'END_CONVERSATION_ERROR',
      error: error.message || 'Failed to end conversation'
    });
  }
}

// Handle worker termination
self.onclose = function() {
  // Clean up any resources if needed
  if (currentConversationId && apiKey) {
    // Attempt to end conversation on worker termination
    handleEndConversation({ conversationId: currentConversationId });
  }
};
