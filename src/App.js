import './App.css';
import * as tf from"@tensorflow/tfjs";
import React, {useRef, useState, useEffect} from 'react';
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { detect } from 'async';
import {drawRect} from "./utilities";

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  const runCoco = async () => {
    // load network from the pretrained model
    const net = await cocossd.load();
      
    //  Loop and detect 
    setInterval(() => {
      detect(net);
    }, 10);
  };
  

  const detect = async (net) => {
    // check if the data is available or not

    if ( typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null && 
    webcamRef.current.video.readyState === 4)
    {
       // Get Video Properties
       const video = webcamRef.current.video;
       const videoWidth = webcamRef.current.video.videoWidth;
       const videoHeight = webcamRef.current.video.videoHeight;
 
       // Set video width
       webcamRef.current.video.width = videoWidth;
       webcamRef.current.video.height = videoHeight;
 
       // Set canvas height and width
       canvasRef.current.width = videoWidth;
       canvasRef.current.height = videoHeight;
 
       // Make Detections
       const obj = await net.detect(video);
 
       // Draw mesh
       const ctx = canvasRef.current.getContext("2d");
       drawRect(obj, ctx); 
     }
    };
  
  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
      <header className="App-header">
      <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
