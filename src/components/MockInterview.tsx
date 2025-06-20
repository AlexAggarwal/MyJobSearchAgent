import React, { useState } from "react";
import { createConversation } from "../api"; // Adjust the path as needed
import { IConversation } from "../types"; // Adjust the path as needed
import { Video, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ResultType = IConversation | { error: string } | null;

export default function MockInterview() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType>(null);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await createConversation();
      console.log("createConversation result:", res);
      setResult(res);
    } catch (err) {
      console.error("API error:", err);
      setResult({ error: (err as Error).message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Mock Interview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice your interview skills with our AI-powered interviewer
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {!result && !loading && (
            <div className="text-center py-8">
              <div className="mb-6">
                <Video size={64} className="mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to start your mock interview?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our AI interviewer will conduct a realistic interview session tailored to your needs.
                  You'll receive real-time feedback and suggestions for improvement.
                </p>
                <ul className="text-left max-w-md mx-auto text-gray-600 dark:text-gray-400 mb-8 space-y-2">
                  <li>• Realistic interview scenarios</li>
                  <li>• AI-powered feedback and analysis</li>
                  <li>• Practice with various question types</li>
                  <li>• Improve your confidence and skills</li>
                </ul>
              </div>
              <button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all"
              >
                <Video size={20} />
                Start Mock Interview
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Setting up your interview...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we prepare your AI interviewer
              </p>
            </div>
          )}

          {result && (
            <div className="py-8">
              {"error" in result ? (
                <div className="text-center">
                  <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Error starting interview</h3>
                    <p>{result.error}</p>
                  </div>
                  <button
                    onClick={() => setResult(null)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">Interview session created successfully!</h3>
                    <p>Your AI interviewer is ready. Click the link below to join.</p>
                  </div>
                  
                  {result.conversation_url && (
                    <div className="mb-6">
                      <a
                        href={result.conversation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium gap-2 transition-all"
                      >
                        <ExternalLink size={20} />
                        Join Mock Interview
                      </a>
                    </div>
                  )}
                  
                  <details className="mt-6 text-left">
                    <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      View technical details
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                  
                  <button
                    onClick={() => setResult(null)}
                    className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                  >
                    Start New Interview
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
