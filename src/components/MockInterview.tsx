import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, User, Calendar, Clock } from 'lucide-react';
import { createConversation, endConversation } from '../api';
import { IConversation } from '../types';

const MockInterview: React.FC = () => {
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEnding, setIsEnding] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  
  // Use ref to prevent double API calls in React Strict Mode
  const hasInitialized = useRef(false);
  const conversationIdRef = useRef<string>('');

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (hasInitialized.current) {
      return;
    }
    
    hasInitialized.current = true;
    initializeInterview();
    
    // Cleanup function to end conversation when component unmounts
    return () => {
      if (conversationIdRef.current) {
        endConversation(conversationIdRef.current).catch(console.error);
      }
    };
  }, []); // Empty dependency array - runs only once

  const initializeInterview = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Creating Tavus conversation...');
      const conversationData = await createConversation();
      
      console.log('Conversation created:', conversationData);
      
      if (conversationData.conversation_url && conversationData.conversation_id) {
        setConversation(conversationData);
        conversationIdRef.current = conversationData.conversation_id; // Store in ref for cleanup
      } else {
        throw new Error('Invalid conversation data received from Tavus API');
      }
    } catch (err: unknown) {
      console.error('Error creating conversation:', err);
      setError((err as Error).message || 'Failed to initialize interview');
    } finally {
      setLoading(false);
    }
  };
  const handleEndInterview = async () => {
    try {
      setIsEnding(true);
      
      if (conversation?.conversation_id || conversationIdRef.current) {
        const idToEnd = conversation?.conversation_id || conversationIdRef.current;
        console.log('Ending conversation:', idToEnd);
        await endConversation(idToEnd);
        conversationIdRef.current = ''; // Clear the ref
      }
      
      // Show ending screen instead of immediately navigating
      setHasEnded(true);
    } catch (err) {
      console.error('Error ending conversation:', err);
      // Still show ending screen even if ending fails
      setHasEnded(true);
    } finally {
      setIsEnding(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleRetry = () => {
    // Reset the initialization flag and try again
    hasInitialized.current = false;
    setError('');
    setConversation(null);
    conversationIdRef.current = '';
    
    // Re-initialize
    hasInitialized.current = true;
    initializeInterview();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (hasEnded) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Interview Complete!</h2>
            <p className="text-gray-300 mb-6">
              Great job! Your mock interview session has been completed successfully. 
              Use this experience to improve your interview skills.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-semibold mb-3 text-center">Session Summary</h3>
            <div className="space-y-2 text-sm text-gray-300">
              {conversation && (
                <>
                  <div className="flex justify-between">
                    <span>Session ID:</span>
                    <span className="text-blue-400">{conversation.conversation_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Started:</span>
                    <span>{formatDate(conversation.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>Session completed</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleBackToDashboard}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Back to Dashboard
            </button>
            <p className="text-xs text-gray-400">
              Your interview session has been saved and can be reviewed in your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-500" />
          <h2 className="text-2xl font-bold mb-2">Preparing Your Interview</h2>
          <p className="text-gray-300 mb-4">Connecting to Tavus AI...</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Setting up your personalized interview experience</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-6">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Interview Setup Failed</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Header Bar */}
      <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleEndInterview}
              disabled={isEnding}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">
                {conversation?.conversation_name || 'Mock Interview - Tavus AI'}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleEndInterview}
            disabled={isEnding}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isEnding ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Ending...
              </>
            ) : (
              'End Interview'
            )}
          </button>
        </div>
      </div>

      {/* Interview Context Info */}
      {conversation && (
        <div className="bg-gray-800/50 border-b border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Session: {conversation.conversation_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Started: {formatDate(conversation.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="capitalize">Status: {conversation.status}</span>
              </div>
            </div>
            <div className="text-gray-400">
              <span>Replica: {conversation.replica_id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tavus AI Interview iframe */}
      <div className="flex-1 relative">
        {conversation?.conversation_url ? (
          <iframe
            src={conversation.conversation_url}
            allow="camera; microphone; fullscreen; display-capture"
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              backgroundColor: '#1f2937'
            }}
            title="Tavus AI Mock Interview"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">No Interview URL Available</h3>
              <p className="text-gray-300">Please try refreshing or contact support.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span>Powered by Tavus AI</span>
            <span>•</span>
            <span>Real-time AI Interview Coaching</span>
            {conversation?.persona_id && (
              <>
                <span>•</span>
                <span>Persona: {conversation.persona_id}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>

      {/* Ending Overlay */}
      {isEnding && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-500" />
            <h2 className="text-2xl font-bold mb-2">Ending Interview</h2>
            <p className="text-gray-300">Saving your session...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;