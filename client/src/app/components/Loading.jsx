import React from "react";
import {CircularProgress} from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex gap-4">
      <CircularProgress color="default" aria-label="Loading..."/>
    </div> 
  );
}
