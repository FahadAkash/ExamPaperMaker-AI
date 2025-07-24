// app/test-gemini/page.tsx
"use client";

import { useState } from "react";
import { AIService } from "@/lib/ai-service";

export default function TestGeminiPage() {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testGemini = async () => {
    setIsLoading(true);
    try {
      const aiService = AIService.getInstance();
      const result = await aiService.generateResponseAI();

      setResponse(result.response);
    } catch (error) {
      setResponse(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Gemini AI Service Test
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={testGemini}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Test Gemini Response"}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">AI Response:</h2>
          <div className="bg-gray-100 p-4 rounded-md min-h-[200px]">
            {response ? (
              <div className="whitespace-pre-wrap text-gray-800">
                {response}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                {isLoading
                  ? "Generating response..."
                  : "Click the button to test Gemini AI"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
