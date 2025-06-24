"use client";
import dynamic from "next/dynamic";
import React from "react";
const UnityPlayer = dynamic(
  () => import("../../../src/components/unity-player"),
  { ssr: false }
);
const VRPage: React.FC = () => {
  return (
    <div className="dashboard-panel">
        <h1>Your VR Session</h1>
      <div className="w-full h-full rounded-xl">
        <iframe src="https://mello-vr-web-gl-application.vercel.app/" className="w-full h-full"></iframe>
      </div>
    </div>
  );
};

export default VRPage;
