import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import apiConfig from '../apiConfig';


export function TripImagePicker({onClose, onResult, title}) {

  const [userImageUrl, setUserImageUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(()=>{findGoogleImage()}, []);

  const [openAiImageUrl, setOpenAiImageUrl] = useState("");
  const [googleImageLoading, setGoogleImageLoading] = useState(false);
  const [openAILoading, setOpenAILoading] = useState(false);

  const generateImage = async () => {
    setOpenAILoading(true);
    try {
        const generateImageResponse = await axios.post(`${apiConfig.proxyServerUrl}/generate-image`, {
            title: title,
        });
        const base64String = generateImageResponse.data.base64Image;
        const formattedBase64 = `data:image/png;base64,${base64String}`;
          
        const uploadResponse = await axios.post(`${apiConfig.proxyServerUrl}/upload-image`, {
            imageBinary: formattedBase64,
            fileName: `user-${Date.now()}.png`,
        });
    
        setOpenAiImageUrl(uploadResponse.data.url);
        setOpenAILoading(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setOpenAILoading(false);
    }
  };

  const findGoogleImage = () => {
    setGoogleImageLoading(true);
    const query = title;
    axios.get(`${apiConfig.proxyServerUrl}/get-image`, { params: {query} }).then(response => {
      const image_url = response.data.images_results[imageIndex].thumbnail;
      setImageUrl(image_url);
      setGoogleImageLoading(false);
    })
    setImageIndex(imageIndex + 1);
  }

  return (
    <div>
      <h1 className='text-xl'>Choose an image for your Trip</h1>
      <hr className='my-4'/> 
      <div className='flex justify-between mb-10'>
        <div className='flex flex-col'>
          {imageUrl && <div className='border-2 border-gray-400 rounded-md shadow-md cursor-pointer'>
            <div onClick={()=>onResult(imageUrl)} >
              <img src={imageUrl} alt="Results" width="240px"/>
            </div>
          </div>}
          <Button className="bg-blue-700 w-full flex items-center h-7 rounded-md text-white" onClick={()=>onResult(imageUrl)} disabled={googleImageLoading}>Select</Button>
          <Button className="bg-blue-700 w-full flex items-center h-7 mt-2 rounded-md text-white" onClick={()=>{findGoogleImage()}} disabled={googleImageLoading}>{googleImageLoading ? "Searching..." : "Next"}</Button>
        </div>
        <div className='flex flex-col'>
          {openAiImageUrl && <div className='border-2 border-gray-400 rounded-md shadow-md cursor-pointer'>
            <div onClick={()=>onResult(openAiImageUrl)}>
              <img src={openAiImageUrl} alt="Generated" width="240px"/>
            </div>
          </div>}
          <Button className="bg-blue-700 w-full flex items-center h-7 rounded-md text-white" onClick={()=>onResult(openAiImageUrl)} disabled={openAILoading}>Select</Button>
          <Button className="bg-blue-700 w-full flex items-center h-7 mt-2 rounded-md text-white" onClick={()=>{generateImage()}} disabled={openAILoading}>{openAILoading ? "Generating..." : (openAiImageUrl ? "Generate new AI image" : "Generate AI image")}</Button>
        </div>
        <div className='flex flex-col w-1/4'>
          <p>Add your own image</p>
           <div>
            <div className="mb-2 block">
              <Label htmlFor="user_image_url" value="URL of trip image" className='text-white'/>
            </div>
            <TextInput id="user_image_url" name="user_image_url" type="text" placeholder="http://" shadow value={userImageUrl} onChange={(e) => setUserImageUrl(e.target.value)}/>
            <Button className="bg-blue-700 px-2 flex items-center h-7 mt-2 rounded-md text-white" onClick={()=>{onResult(userImageUrl)}}>Submit</Button>
          </div>
        </div>
      </div>
      <hr />
      <div className='flex flex-row-reverse gap-2 mt-2'>
        <Button className="bg-blue-700 px-2 py-0 rounded-md text-white" onClick={()=>onClose()}>Cancel</Button>
      </div>
    </div>
  );
}