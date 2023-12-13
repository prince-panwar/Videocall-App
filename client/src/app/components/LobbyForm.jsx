'use client'
import React, { useCallback ,useEffect} from "react";
import { useRouter } from "next/navigation";
import { Input, Tabs, Tab, Card, CardBody, Button } from "@nextui-org/react";
import { useSocket } from "../providers/SocketProvider";

export default function LobbyFrom() {
  const [Email, setEmail] = React.useState("");  
  const [roomNO, setNO] = React.useState(""); 
  const socket = useSocket();
  const Router = useRouter();
  

  const validateEmail = (value) =>
    Email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (Email === "") return false;

    return validateEmail(Email) ? false : true;
  }, [Email]);
  
  const handleJoinbutton=useCallback((e)=>{
    socket.emit("join-room",{roomNO,Email});
   
   
  },[Email,roomNO,socket]);
  
  const joinRoom = useCallback((data)=>{
    Router.push(`/${data.roomNO}`);
   //console.log(data.Email,data.roomNO);

  },[])
 
  useEffect(() => {
    socket.on("join-room",joinRoom);
    return () => socket.off("join-room",joinRoom);
  }, [socket,joinRoom]);

  return (
  <div className="flex  flex-col items-center justify-center w-screen ">
  <Tabs aria-label="Options" >
    <Tab key="Join" title="Join Room" >
      <Card >
        <CardBody >
          <Input
            value={Email}
            type="email"
            label="Email"
            variant="bordered"
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : "success"}
            errorMessage={isInvalid && "Please enter a valid email"}
            onValueChange={setEmail}
           
           
          />
          <br/>
           <Input
            value={roomNO}
            type="number"
            label="Room Code"
            variant="bordered"
            onValueChange={setNO}
           
          />
          <br/>
          <Button onClick={handleJoinbutton}> Join</Button>
        </CardBody>
      </Card>
    </Tab>
    <Tab key="Create" title="Create room">
      <Card>
        <CardBody>
          <Input
            value={Email}
            type="email"
            label="Email"
            variant="bordered"
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : "success"}
            errorMessage={isInvalid && "Please enter a valid email"}
            onValueChange={setEmail}
           
          />
           <br/>
           <Input
            value={roomNO}
            type="number"
            label="Room Code"
            variant="bordered"
            onValueChange={setNO}
          
          />
          <br/>
          <Button> Create</Button>
        </CardBody>
      </Card>
    </Tab>
  </Tabs>
</div>
  );
}
