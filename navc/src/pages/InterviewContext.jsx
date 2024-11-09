import React, { createContext, useContext, useState } from 'react';

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [interviewData, setInterviewData] = useState({
    questions: [],
    responses: [],
    evaluation: null
  });

  return (
    <InterviewContext.Provider value={{ interviewData, setInterviewData }}>
      {children}
    </InterviewContext.Provider>
  );
};