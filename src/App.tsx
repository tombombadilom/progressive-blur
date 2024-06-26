import React, { useState } from "react";
import { LinearBlur, RadialBlur } from "../lib/main";
import { motion, useSpring, useTransform } from "framer-motion";
import { useControls } from "leva";

function App() {
  return (
    <div className="mainContainer">
      <div className="main">
        <RadialExample />
        <LinearExample />
      </div>
      {/* @ts-ignore */}
      {window.chrome && (
        <div>
          (Setting both <code>overflow: hidden</code> and border radius on
          ancestors of masked backdrop filters breaks in Chrome. Let them know{" "}
          <a href="https://issues.chromium.org/issues/40778541">here</a>.)
        </div>
      )}
      <div className="rounded-rectangle" />
    </div>
  );
}

function RadialExample() {
  const { strength, steps, falloffPercentage, size, tint } = useControls(
    "Radial blur",
    {
      strength: { value: 64, min: 0, max: 128 },
      steps: { value: 8, min: 2, max: 16 },
      falloffPercentage: { value: 85, min: 0, max: 100 },
      size: { value: 130, min: 0, max: 200 },
      tint: { r: 200, b: 125, g: 106, a: 0 },
    }
  );

  const tintString = `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tint.a})`;

  const xSpring = useSpring(0, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(0, { stiffness: 300, damping: 30 });
  const backgroundSize = useSpring(105, { stiffness: 300, damping: 30 });

  const handleMouseMove = (event) => {
    const { left, width, top, height } = event.target.getBoundingClientRect();
    const offsetX = ((event.clientX - left) / width) * 100;
    const offsetY = ((event.clientY - top) / height) * 100;
    xSpring.set(offsetX);
    ySpring.set(offsetY);
  };

  const backgroundPosMV = useTransform(
    () => `${xSpring.get()}% ${ySpring.get()}%`
  );

  const backgroundSizeMV = useTransform(() => `${backgroundSize.get()}%`);

  return (
    <motion.div
      className="radialContainer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => backgroundSize.set(160)}
      onMouseLeave={() => backgroundSize.set(105)}
      style={{
        backgroundPosition: backgroundPosMV,
        backgroundSize: backgroundSizeMV,
        // settng overflow: hidden + border radius on ancestors of masked backdrop filters breaks in Chrome
        // https://issues.chromium.org/issues/40778541
        // @ts-ignore
        borderRadius: window.chrome ? undefined : 40,
      }}
    >
      <div className="description">
        <RadialBlur
          className="radialBlur"
          steps={steps}
          strength={strength}
          falloffPercentage={falloffPercentage}
          tint={tintString}
          style={{
            transform: `scale(${size / 100})`,
          }}
        />
        <div className="text">Hover me</div>
      </div>
    </motion.div>
  );
}

function LinearExample() {
  const { strength, steps, falloffPercentage, size, tint, side } = useControls(
    "Linear blur",
    {
      strength: { value: 64, min: 0, max: 128 },
      steps: { value: 8, min: 2, max: 16 },
      falloffPercentage: { value: 95, min: 0, max: 100 },
      size: { value: 120, min: 0, max: 200 },
      tint: { r: 69, g: 69, b: 69, a: 0 },
      side: {
        value: "top",
        options: ["top", "bottom", "left", "right"],
      },
    }
  );

  const tintString = `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tint.a})`;

  const oppositeSide = {
    left: "right",
    right: "left",
    top: "bottom",
    bottom: "top",
  };

  return (
    <div
      className="linearContainer"
      style={{
        // settng overflow: hidden + border radius on ancestors of masked backdrop filters breaks in Chrome
        // https://issues.chromium.org/issues/40778541
        // @ts-ignore
        borderRadius: window.chrome ? undefined : 40,
      }}
    >
      <div className="scrollContainer">
        <div className="bigChild">
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
          <div className="text2">Scroll me</div>
        </div>
      </div>

      <LinearBlur
        className="linearBlur"
        steps={steps}
        strength={strength}
        falloffPercentage={falloffPercentage}
        tint={tintString}
        // @ts-ignore
        side={side}
        style={{
          [oppositeSide[side]]: "auto",
          [side === "top" || side === "bottom" ? "height" : "width"]: size,
        }}
      />

      <div className="titleBar">Perfectly Readable Title</div>
    </div>
  );
}

export default App;
