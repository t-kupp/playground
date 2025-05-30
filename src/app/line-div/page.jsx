"use client";

import { useEffect, useState, useRef } from "react";

export default function LineDiv() {
  const [horLine, setHorLine] = useState(0);
  const [verLine, setVerLine] = useState(0);
  const [touchedColor, setTouchedColor] = useState("");
  const cardRefs = useRef([]);

  useEffect(() => {
    let currentMouseX = 0;
    let currentMouseY = 0;

    const updateIntersection = () => {
      const newHorLine = (currentMouseY / window.innerHeight) * 100;
      const newVerLine = (currentMouseX / window.innerWidth) * 100;

      setHorLine(newHorLine);
      setVerLine(newVerLine);

      // Calculate the actual pixel position of the horizontal line
      const clampedTop = Math.max(
        100,
        Math.min(currentMouseY, window.innerHeight - 100),
      );

      checkIntersection(clampedTop);
    };

    const handleMouse = (e) => {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
      updateIntersection();
    };

    const handleScroll = () => {
      updateIntersection();
    };

    const checkIntersection = (lineY) => {
      for (let i = 0; i < cardRefs.current.length; i++) {
        const card = cardRefs.current[i];
        if (card) {
          const rect = card.getBoundingClientRect();
          // Check if the horizontal line intersects with this card
          if (lineY >= rect.top && lineY <= rect.bottom) {
            setTouchedColor(cards[i].color);
          }
        }
      }
      return null;
    };
    updateIntersection();

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const cards = [
    { color: "red" },
    { color: "green" },
    { color: "blue" },
    { color: "red" },
    { color: "green" },
    { color: "blue" },
    { color: "red" },
    { color: "green" },
    { color: "blue" },
  ];

  return (
    <div className="flex w-screen justify-end">
      <div className="pointer-events-none fixed top-0 left-0 h-screen w-screen">
        <div className="relative flex h-full w-full">
          {/* Howl image  */}
          <img
            src="/howl.png"
            className="absolute top-0 left-0 object-cover object-center"
            style={{
              width: `clamp(100px, ${verLine}%, 30%)`,
              height: `clamp(100px, ${horLine}%, (100vh - 100px))`,
            }}
            alt="Howl"
          />
          {/* Mononoke image  */}
          <img
            src="/mononoke.png"
            className="absolute bottom-0 left-0 object-cover"
            style={{
              width: `clamp(100px, ${verLine}%, 30%)`,
              height: `clamp(100px, (100% - ${horLine}%), (100vh - 100px))`,
            }}
            alt="Howl"
          />
          {/* Horizontal line  */}
          <div
            className={`absolute h-[1px] w-full bg-black`}
            style={{ top: `clamp(100px, ${horLine}%, (100vh - 100px))` }}
          >
            <p className="absolute bottom-0 left-1/2">
              Target square color:{" "}
              <span className="capitalize">{touchedColor}</span>
            </p>
          </div>
          {/* Vertical line  */}
          <div
            className={`absolute h-full w-[1px] bg-black`}
            style={{ left: `clamp(100px, ${verLine}%, 30%)` }}
          ></div>
        </div>
      </div>
      <ul className="mr-16 flex flex-col gap-16 py-[100px]">
        {cards.map((card, index) => (
          <li
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`h-32 w-64`}
            style={{ backgroundColor: `${card.color}` }}
          ></li>
        ))}
      </ul>
    </div>
  );
}
