import { NextResponse, type NextRequest } from "next/server";
import { gemini } from "@/app/config/geminiConfig";

export async function GET() {
  // Example response, customize as needed
  return NextResponse.json({
    message: "GET endpoint for task-generator is working!",
  });
}

export async function POST(request: NextRequest) {
  const { message, context } = await request.json();
  const response = await gemini.generateContent(
    `${context && `Context: ${context}`}  
    Objective: ${message}`
  );
  const res = response.response.text();
  // Example response, customize as needed
  return NextResponse.json({
    message: res,
  });
}
