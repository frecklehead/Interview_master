import React, { useState } from 'react';
import { Briefcase, X, Check } from 'lucide-react';

const BeforeInterviewDash = () => {
  const [interviewField, setInterviewField] = useState('');
  const [interviewTitle, setInterviewTitle] = useState('');
  const [interviewDescription, setInterviewDescription] = useState('');
  const [isFieldSelected, setIsFieldSelected] = useState(false);

  const startInterviewSetup = () => {
    if (interviewField) setIsFieldSelected(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {!isFieldSelected ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Set Up Your Interview
          </h1>

          <div className="mb-4">
            <label htmlFor="field" className="block text-gray-700 font-medium mb-2">
              Interview Field
            </label>
            <input
              type="text"
              id="field"
              placeholder="e.g., Software Engineering"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={interviewField}
              onChange={(e) => setInterviewField(e.target.value)}
            />
          </div>

        

          {/* <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Interview Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Provide a brief description of the interview"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={interviewDescription}
              onChange={(e) => setInterviewDescription(e.target.value)}
            ></textarea>
          </div> */}

          <button
            onClick={startInterviewSetup}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Start Interview
          </button>
        </div>
      ) : (
        window.location.href = "/interview"
      )}
    </div>
  );
};


export default BeforeInterviewDash;