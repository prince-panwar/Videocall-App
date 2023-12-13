'use client'
import React, { useEffect ,useCallback, useState} from 'react'
import VideoCallCard from '../components/card'
import { useSocket } from '../providers/SocketProvider'
import { Button } from '@nextui-org/react'
import { IoIosCall } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";

export default function page({params}) {
  const socket = useSocket();
  const [remoteSocketId,setRemoteSocketId]= useState(null);
  const [myStream, setMyStream] = useState(null);
  
  const handleUserJoined=useCallback(({Email,id})=>{
    console.log("email",Email,"Socket",id);
    setRemoteSocketId(id);
    console.log( "remoatesocketId",remoteSocketId);
  },[remoteSocketId])

  useEffect(()=>{
    const fetchStream = async()=>{
      const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      setMyStream(stream);
    }
    fetchStream();
  },[]);

  useEffect(()=>{
    socket.on("user-joined",handleUserJoined);
    return ()=>socket.off("user-joined",handleUserJoined);
  },[socket,handleUserJoined]);

  return (
   
    
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex  items-center justify-center relative">
        <VideoCallCard videoSrc={remoteSocketId?myStream:myStream} height="100%" width="100%" className="absolute inset-0 object-cover m-auto" />
      </div>
      {remoteSocketId&&<div className="p-4 absolute bottom-0 right-0">
        <VideoCallCard videoSrc={myStream} height="230px" width="230px" className="w-24 h-24 object-cover rounded-full border-4 border-white" />
      </div>}
      {!remoteSocketId&&<h4 className='flex items-center justify-center m-2'>No One in this room </h4>}
      
      <div className="fixed inset-x-0 bottom-0 flex justify-center space-x-4 p-4">
        <Button color='danger' radius='lg' className="m-2 mr-2" ><AiFillAudio/></Button>
        <Button color='danger' className="m-2 mr-2"><FaVideo/></Button>
        <Button color='danger' className="m-2 " ><IoIosCall/></Button>
      </div>
    </div>
  )
}
