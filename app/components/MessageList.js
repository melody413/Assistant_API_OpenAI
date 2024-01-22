import axios from "axios";
import clsx from "clsx";
import { Bot, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Message = ({ message }) => {
  const [imageData, setImageData] = useState(null);

  const getImage = async (imageId) => {
    const openAIOption = {
      headers: {
        'Authorization' : 'Bearer',
      },
      'responseType' : 'arraybuffer'
    };
  
    const imageURL = `https://api.openai.com/v1/files/${imageId}/content`;
  
    try {
      const response = await axios.get(imageURL, openAIOption);
      
      // Set the image data in the state
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      setImageData(base64Image);
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error; // Rethrow the error to handle it in the calling component
    }
  };

  useEffect(() => {
    if (message.role === 'image') {
      getImage(message.content);
    }
  }, [message.content, message.role]);

  return (
    <div
      className={clsx(
        "flex w-full items-center justify-center border-b border-gray-200 py-8",
        message.role === "user" ? "bg-white" : "bg-gray-100"
      )}
    >
      <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
        <div
          className={clsx(
            "p-1.5 text-white",
            message.role === "assistant" ? "bg-green-500" : "bg-black"
          )}
        >
          {message.role === "user" ? <User width={20} /> : <Bot width={20} />}
        </div>

        {message.role === 'image' ? 
          <img src={`data:image/png;base64,${imageData}`} alt="Chart Image" /> 
          :
          <ReactMarkdown
          className="prose mt-1 w-full break-words prose-p:leading-relaxed"
          remarkPlugins={[remarkGfm]}
          components={{
            a: (props) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
        }

        
      </div>
    </div>
  );
};

const MessageList = ({ chatMessages }) => (
  <>
    {chatMessages.map((message, i) => (
      <Message key={i} message={message} />
    ))}
  </>
);

export default MessageList;
