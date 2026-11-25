"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const messages = [
  {
    title: "Continue construindo.",
    subtitle: "o resultado vem com o tempo",
  },
  {
    title: "Tudo funcionando por aqui.",
    subtitle: "seu projeto está online",
  },
  {
    title: "Bora criar algo incrível?",
    subtitle: "seu próximo projeto te espera",
  },
  {
    title: "Um passo de cada vez.",
    subtitle: "o importante é continuar",
  },
  {
    title: "O NIMO acredita em você.",
    subtitle: "agora vai lá e codifica!",
  },
  {
    title: "Bug encontrado?",
    subtitle: "café e paciência resolvem",
  },
];

interface NimoDeviceProps {
  visitors?: number;
  online?: boolean;
  className?: string;
}

export function NimoDevice({
  visitors = 2,
  online = true,
  className = "",
}: NimoDeviceProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [blink, setBlink] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Movimento 3D
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 100,
    damping: 20,
  });

  const springY = useSpring(mouseY, {
    stiffness: 100,
    damping: 20,
  });

  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const rotateY = useTransform(springX, [-1, 1], [-12, 12]);

  // Alternar mensagens
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Piscar olhos
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    let active = true;

    function scheduleBlink() {
      timeout = setTimeout(() => {
        if (!active) return;

        setBlink(true);

        setTimeout(() => {
          if (!active) return;

          setBlink(false);
          scheduleBlink();
        }, 160);
      }, 2500 + Math.random() * 3500);
    }

    scheduleBlink();

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, []);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    mouseX.set((x - 0.5) * 2);
    mouseY.set((y - 0.5) * 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const message = messages[messageIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex min-h-[400px] w-full items-center justify-center overflow-hidden ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full "
      />

      {/* Orb */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute h-[350px] w-[350px] rounded-full "
      />

      {/* Floating device */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="relative z-10 w-[min(88vw,460px)]"
      >
        {/* Device body */}
        <div
          className="relative rounded-[30px] border border-[#414a42] bg-[#202622] p-[17px] "
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Speaker */}
          <div className="absolute bottom-[36px] left-[8px] flex gap-[3px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[24px] w-[3px] rounded-full bg-[#080b09] shadow-[1px_0_1px_#ffffff12]"
              />
            ))}
          </div>

          {/* Screen */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border-[5px] border-[#090d0a] bg-[#070a09] shadow-[inset_0_0_35px_#000]">
            {/* Screen header */}
            <div className="absolute top-[7%] right-[7%] left-[7%] z-10 flex items-center justify-between">
              <strong className="text-[clamp(10px,2vw,13px)] font-bold tracking-tight text-white">
                nimo <span className="font-normal text-[#8b978c]">/dev</span>
              </strong>

              <span className="flex items-center gap-1.5 text-[clamp(8px,1.5vw,10px)] text-[#a0aaa1]">
                <span
                  className={`h-[5px] w-[5px] rounded-full ${
                    online ? "bg-[#b8f36b]" : "bg-red-400"
                  }`}
                />

                {online ? "conectado" : "offline"}
              </span>
            </div>

            {/* Robot */}
            <div className="absolute inset-x-[10%] top-[19%] bottom-[22%] flex items-center justify-center">
              <motion.svg
                viewBox="0 0 246 146"
                role="img"
                aria-label="NIMO, robô com cabeça grafite e olhos verde-lima"
                className="h-full w-full overflow-visible"
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Antenna */}
                <rect
                  x="120"
                  y="5"
                  width="5"
                  height="26"
                  rx="2"
                  fill="#344139"
                />

                <motion.circle
                  cx="122"
                  cy="8"
                  r="7"
                  fill={online ? "#78ab41" : "#7f3030"}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                <circle
                  cx="122"
                  cy="8"
                  r="5"
                  fill={online ? "#b8f36b" : "#ff7777"}
                />

                {/* Ears */}
                <rect
                  x="10"
                  y="68"
                  width="25"
                  height="39"
                  rx="10"
                  fill="#344139"
                />

                <rect
                  x="12"
                  y="70"
                  width="21"
                  height="35"
                  rx="8"
                  fill="#161d19"
                />

                <rect
                  x="211"
                  y="68"
                  width="25"
                  height="39"
                  rx="10"
                  fill="#344139"
                />

                <rect
                  x="213"
                  y="70"
                  width="21"
                  height="35"
                  rx="8"
                  fill="#161d19"
                />

                {/* Head */}
                <rect
                  x="27"
                  y="28"
                  width="192"
                  height="116"
                  rx="48"
                  fill="#344139"
                />

                <rect
                  x="29"
                  y="30"
                  width="188"
                  height="112"
                  rx="46"
                  fill="#1b241f"
                />

                <rect
                  x="36"
                  y="36"
                  width="174"
                  height="101"
                  rx="43"
                  fill="none"
                  stroke="#28352d"
                />

                {/* Visor */}
                <rect
                  x="47"
                  y="47"
                  width="152"
                  height="83"
                  rx="33"
                  fill="#344139"
                />

                <rect
                  x="49"
                  y="49"
                  width="148"
                  height="79"
                  rx="31"
                  fill="#080d0b"
                />

                <path
                  d="M85 34h76"
                  stroke="#29352c"
                />

                {/* Eyes */}
                {[0, 1].map((eye) => {
                  const x = eye === 0 ? 68 : 132;

                  return (
                    <motion.g
                      key={eye}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                      }}
                      animate={{
                        scaleY: blink ? 0.08 : 1,
                      }}
                      transition={{
                        duration: 0.12,
                      }}
                    >
                      <rect
                        x={x}
                        y="67"
                        width="46"
                        height="42"
                        rx="15"
                        fill={online ? "#132214" : "#2b1515"}
                      />

                      <rect
                        x={x + 3}
                        y="70"
                        width="40"
                        height="36"
                        rx="14"
                        fill={online ? "#b8f36b" : "#ff7777"}
                      />

                      <ellipse
                        cx={x + 13}
                        cy="78"
                        rx="6"
                        ry="3"
                        fill={online ? "#e2ffae" : "#ffc0c0"}
                      />
                    </motion.g>
                  );
                })}

                {/* Smile */}
                <path
                  d={online ? "M111 116l6 3h13l6-3" : "M115 119h16"}
                  fill="none"
                  stroke={online ? "#b8f36b" : "#ff7777"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Chin */}
                <rect
                  x="111"
                  y="136"
                  width="24"
                  height="4"
                  rx="2"
                  fill="#394c2b"
                />
              </motion.svg>
            </div>

            {/* Message */}
            <div className="absolute right-3 bottom-[9%] left-3 text-center">
              <motion.div
                key={online ? messageIndex : "offline"}
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
                <p className="text-[clamp(10px,2vw,13px)] font-medium text-white">
                  {online ? message.title : "Site indisponível."}
                </p>

                <p className="mt-1 text-[clamp(8px,1.5vw,10px)] text-[#7f8c80]">
                  {online ? message.subtitle : "verifique a conexão"}
                </p>
              </motion.div>
            </div>

            {/* Pagination */}
            <div className="absolute bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-2">
              <span className="h-[3px] w-[15px] rounded-full bg-[#b8f36b]" />
              <span className="h-[4px] w-[4px] rounded-full bg-[#465448]" />
            </div>
          </div>
        </div>

        {/* Shadow */}
        <div className="absolute -bottom-10 left-[10%] h-10 w-[80%] rounded-full bg-black/60 blur-[25px]" />
      </motion.div>

    

      {/* Floating visitors card */}
   
    </div>
  );
}