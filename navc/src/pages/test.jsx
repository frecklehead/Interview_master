import React from 'react'
import {GoogleGenerativeAI} from "@google/generative-ai"

export default function Test() {

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Explain how AI works";

const result = model.generateContent(prompt);
console.log(result.response.text());
  return (
   <>
   {result.response.text}
   </>
  )
}
