import React from "react";
import {Card, CardHeader, CardBody} from "@nextui-org/react";

export default function VideoCallCard({ videoSrc }) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">Video Call</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <video
          className="object-cover rounded-xl"
          src={videoSrc}
          autoPlay
          controls
          width="100%"
          height="100%"
        />
      </CardBody>
    </Card>
  );
}
