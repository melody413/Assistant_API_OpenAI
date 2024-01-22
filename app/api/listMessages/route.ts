/**
 * API Route - List Messages in a Thread
 *
 * This API route is responsible for retrieving messages from a specific chat thread using the OpenAI API.
 * It processes POST requests that include a 'threadId' in the form data. The route fetches the messages
 * associated with the provided thread ID and returns them in a structured JSON format. It's designed to
 * facilitate the tracking and review of conversation threads created and managed via OpenAI's GPT models.
 *
 * Path: /api/listMessages
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import axios from 'axios';
// Initialize OpenAI client using the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define an asynchronous POST function to handle incoming requests
export async function POST(req: NextRequest) {
  try {
    // Extract form data from the request
    const formData = await req.formData();

    // Retrieve 'threadId' from form data and cast it to string
    const threadId = formData.get('threadId') as string;

    // Log the received thread ID for debugging
    console.log(`Received request with threadId: ${threadId}`);

    // Retrieve messages for the given thread ID using the OpenAI API
    const messages = await openai.beta.threads.messages.list(threadId);
    
    messages.data.forEach((message, index) => {
      console.log(`Message ${index + 1} content:`, message.content);
    });
    // Log the count of retrieved messages for debugging
    console.log(`Retrieved ${messages.data.length} messages`);

    
    // Find the first assistant message
    const assistantMessage = messages.data.find(message => message.role === 'assistant');

    if (!assistantMessage) {
      return NextResponse.json({ error: "No assistant message found" });
    }
    
    if(assistantMessage.content.length == 1){
      const assistantMessageContent = assistantMessage.content.at(0);
      if (!assistantMessageContent) {
        return NextResponse.json({ error: "No assistant message content found" });
      }
      if(assistantMessageContent.type == 'text'){
        return NextResponse.json({ messages: assistantMessageContent.text.value });
      }
    }else{
      let messages: string = "";
      let file_ids: string[] = [];

      for(let i = 0 ; i < assistantMessage.content.length ; i++){
        const assistantMessageContent = assistantMessage.content.at(i);
        if (!assistantMessageContent) {
          return NextResponse.json({ error: "No assistant message content found" });
        }
        if(assistantMessageContent.type == 'text'){
          messages = assistantMessageContent.text.value;
        }else{
          file_ids.push(assistantMessageContent.image_file.file_id);
        }
      }
      return NextResponse.json({ messages: messages, file_ids: file_ids });
    }
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}
