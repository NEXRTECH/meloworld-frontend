"use client";
import Script from "next/script";
import Button from "./ui/button/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsFullscreen } from "react-icons/bs";
import { AiOutlineFullscreen } from "react-icons/ai";

export default function UnityPlayer() {
  const [loaded, setLoaded] = useState(false);
  const [pointerOver, setPointerOver] = useState(false);

  const handleFullscreen = () => {
    const container = document.getElementById("unity-container");

    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    }
  }

  return (
    <>
      {/* 1) Container & loading UI */}
      <div
        onPointerOver={() => setPointerOver(true)}
        onPointerLeave={() => setPointerOver(false)}
        id="unity-container"
        className="w-full h-full relative"
      >
        <canvas
          id="unity-canvas"
          className="w-full h-full rounded-xl shadow-lg"
        />
        {!loaded && (
          <div
            id="unity-loading-bar"
            className="absolute top-0 mx-3 left-0 right-0"
          >
            <div id="unity-progress-bar-empty" className="w-full bg-[#333]">
              <div
                id="unity-progress-bar-full"
                className="w-0 h-1 bg-sky-900"
              />
            </div>
          </div>
        )}
        <AnimatePresence>
          {pointerOver && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute p-2 bottom-0 w-full h-14 bg-secondary/80"
            >
              <Button onClick={handleFullscreen} variant="outline" size="xs">
              <AiOutlineFullscreen/>
              Enter Fullscreen
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2) Load the Unity loader script on the client */}
      <Script
        src="/unity/Build/MelloVRWEBGL.loader.js"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-ignore: createUnityInstance is injected by the loader
          createUnityInstance(
            document.getElementById("unity-canvas"),
            {
              dataUrl: "/unity/Build/MelloVRWEBGL.data",
              frameworkUrl: "/unity/Build/MelloVRWEBGL.framework.js",
              codeUrl: "/unity/Build/MelloVRWEBGL.wasm",
              streamingAssetsUrl: "/unity/StreamingAssets",
              companyName: "DefaultCompany",
              productName: "MelloVRWEBGL",
              productVersion: "1.0",
            },
            (progress: number) => {
              const bar = document.getElementById("unity-progress-bar-full");
              if (bar) bar.style.width = `${100 * progress}%`;
              console.log(progress);
              if (progress == 1) {
                setTimeout(() => {
                  setLoaded(true);
                }, 2000);
              }
            }
          ).then((instance: any) => {
            console.log("Unity loaded!", instance);
          });
        }}
      />
    </>
  );
}
