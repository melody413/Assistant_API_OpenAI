/**
 * API Route - Get Imagefile with file id
 * Path: /api/getFileImage
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import axios from 'axios';

export async function POST(req: NextRequest) {
  console.log('GET image file api started!');
  if (req.method === 'POST') {
    try {
      const formData = await req.formData();
      const fileId = formData.get('fileId') as string;

      // Überprüfen, ob die Eingabemessage vorhanden und ein String ist
      if (!fileId || typeof fileId !== 'string') {
        throw new Error('fileId is missing or not a string');
      }

      const openAiOptions = {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        // responseType: 'stream'
      };

      const imageURL = `https://api.openai.com/v1/files/${fileId}/content`;

      try{
        const response = await axios.get(imageURL, openAiOptions);
        console.log("-------Image FILE", response.data);
      }catch(err){
        console.log("error :", err);
      }
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json({ error: (error as Error).message });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}
