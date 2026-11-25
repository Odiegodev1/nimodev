"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"

interface NimoPreviewProps {
  color: string
}

export function NimoPreview({
  color,
}: NimoPreviewProps) {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const interval = setInterval(() => {
      setBlink(true)

      timeout = setTimeout(() => {
        setBlink(false)
      }, 160)
    }, 4200)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-[#0B0E0C]">

      {/* Iluminação ambiente */}

      <div
        className="pointer-events-none absolute size-48 rounded-full opacity-10 blur-[80px] transition-colors duration-500"
        style={{ backgroundColor: color }}
      />

      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-[240px] sm:w-[280px]"
      >
        <svg
          viewBox="0 0 246 146"
          className="w-full overflow-visible"
          role="img"
          aria-label="Prévia do personagem NIMO"
        >
          {/* Antena */}

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
            r="8"
            fill={color}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          <circle
            cx="122"
            cy="8"
            r="5"
            fill={color}
          />

          {/* Orelhas */}

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
            fill="#161D19"
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
            fill="#161D19"
          />

          {/* Cabeça */}

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
            fill="#1B241F"
          />

          <rect
            x="36"
            y="36"
            width="174"
            height="101"
            rx="43"
            fill="none"
            stroke="#28352D"
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
            fill="#080D0B"
          />

          <path
            d="M85 34h76"
            stroke="#29352C"
          />

          {/* Olhos */}

          {[68, 132].map((x) => (
            <motion.g
              key={x}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
              animate={{
                scaleY: blink ? 0.08 : 1,
              }}
              transition={{ duration: 0.12 }}
            >
              <rect
                x={x}
                y="67"
                width="46"
                height="42"
                rx="15"
                fill={color}
                opacity="0.12"
              />

              <rect
                x={x + 3}
                y="70"
                width="40"
                height="36"
                rx="14"
                fill={color}
                className="transition-colors duration-500"
              />

              <ellipse
                cx={x + 13}
                cy="78"
                rx="6"
                ry="3"
                fill="#FFFFFF"
                opacity="0.5"
              />
            </motion.g>
          ))}

          {/* Sorriso */}

          <path
            d="M111 116l6 3h13l6-3"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Indicador inferior */}

          <rect
            x="111"
            y="136"
            width="24"
            height="4"
            rx="2"
            fill={color}
            opacity="0.3"
          />
        </svg>
      </motion.div>

      <div className="absolute bottom-5 flex items-center gap-2">
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />

        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Prévia em tempo real
        </span>
      </div>
    </div>
  )
}