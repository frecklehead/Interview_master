import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const EvaluateInterview = ({ questions, responses }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const genAI = new GoogleGenerativeAI("YOUR-API-KEY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const evaluateResponses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create a structured prompt for the API
      const prompt = `You are an expert technical interviewer. Please evaluate the following interview responses for a software developer position.
      
For each question and answer pair:
1. Rate the answer on a scale of 1-5
2. Provide specific feedback on what was good
3. Point out what could be improved
4. Give an example of an ideal answer

Here are the questions and candidate's responses:

${questions.map((question, index) => `
Question ${index + 1}: ${question}
Candidate's Response: ${responses[index]?.response || 'No response provided'}
`).join('\n\n')}

Please provide a structured evaluation with:
1. Individual feedback for each question
2. Overall assessment
3. Areas for improvement
4. Final score out of 100`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const evaluationText = response.text();

      setEvaluation({
        timestamp: new Date().toISOString(),
        details: evaluationText,
      });
    } catch (error) {
      console.error("Evaluation error:", error);
      setError("Failed to evaluate interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!questions.length || !responses.length) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <p className="text-gray-600">No interview data available for evaluation.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Interview Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!evaluation && !isLoading && (
          <button
            onClick={evaluateResponses}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Evaluate Interview
          </button>
        )}

        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Evaluating responses...</span>
          </div>
        )}

        {error && (
          <div className="text-red-500 mt-4">
            {error}
          </div>
        )}

        {evaluation && (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {evaluation.details}
              </pre>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Evaluation completed at: {new Date(evaluation.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold mb-4">Interview Responses</h3>
          {questions.map((question, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">Q{index + 1}: {question}</p>
              <p className="mt-2 text-gray-600">
                A: {responses[index]?.response || 'No response provided'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluateInterview;