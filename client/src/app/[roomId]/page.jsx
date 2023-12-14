'use client'
import React, { useEffect ,useCallback, useState} from 'react'
import VideoCallCard from '../components/card'
import { useSocket } from '../providers/SocketProvider'
import PeerService from '../service/peer'
import { Button } from '@nextui-org/react'
import { IoIosCall } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { AiOutlineAudioMuted } from "react-icons/ai";
export default function page({ params }) {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ Email, id }) => {
    console.log('User joined:', Email, 'Socket ID:', id);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(async (from, offer) => {
    console.log('Incoming call from', from, 'with offer', offer);
    setRemoteSocketId(from);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('getUserMedia success');
      setMyStream(stream);

      const ans = await PeerService.getAnswer(offer);
      console.log('Answer generated', ans);

      socket.emit('call-accepted', { to: from, answer: ans });
      console.log('Sent call-accepted');
      
    } catch (error) {
      console.error('Error handling incoming call:', error);
    }
  }, [socket, ]);

  const handleCallAccepted = useCallback(async ({ from, answer }) => {
   console.log('Call accepted from', from, 'with answer', answer);
    try {
      await PeerService.setLocalDescription(answer);
      console.log('Call accepted');
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  }, []);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const offer = await PeerService.getOffer();

        if (remoteSocketId) {
          socket.emit('user-call', { to: remoteSocketId, offer });
          console.log('User call sent');
        }

        setMyStream(stream);
      } catch (error) {
        console.error('Error fetching stream:', error);
      }
    };

    fetchStream();
  }, [remoteSocketId, socket]);

  useEffect(() => {
    socket.on('user-joined', handleUserJoined);
    socket.on('incoming-call', ({ from, offer }) => handleIncomingCall(from, offer));
    socket.on('call-accepted', handleCallAccepted);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
    };
  }, [socket,handleUserJoined,handleIncomingCall.handCallAccepeted]);

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
