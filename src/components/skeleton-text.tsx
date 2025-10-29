import { useTimeline } from "@opentui/react"
import { useEffect, useState } from "react"

const color = {
  start: "#333333",
  end: "#1c1c1c",
}

export function SkeletonText({ text }: { text: string }) {
  const [progress, setProgress] = useState(0)
  const timeline = useTimeline({
    duration: 2000,
    loop: true,
  })

  useEffect(() => {
    // Step 1: forward (0 → 100)
    timeline.add(
      {
        progress: 0,
      },
      {
        progress: 100,
        duration: 1000,
        ease: "linear",
        onUpdate: (anim) => setProgress(anim.targets[0].progress),
      },
    )

    // Step 2: backward (100 → 0)
    timeline.add(
      {
        progress: 100,
      },
      {
        progress: 0,
        duration: 1000,
        ease: "linear",
        onUpdate: (anim) => setProgress(anim.targets[0].progress),
      },
      1000,
    )
  }, [])

  return (
    <box
      maxWidth={text.length}
      backgroundColor={interpolateHexColor(color.start, color.end, progress)}
    >
      <text>{text.replace(/./g, " ")}</text>
    </box>
  )
}

export function interpolateHexColor(
  color1: string,
  color2: string,
  percentage: number,
): string {
  const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max)

  const p = clamp(percentage, 0, 100) / 100

  const parseHex = (hex: string): [number, number, number] => {
    const c = hex.replace("#", "")
    if (c.length !== 6) {
      throw new Error(`Invalid hex color: ${hex}`)
    }
    const r = parseInt(c.slice(0, 2), 16)
    const g = parseInt(c.slice(2, 4), 16)
    const b = parseInt(c.slice(4, 6), 16)
    return [r, g, b]
  }

  const toHex = (r: number, g: number, b: number): string =>
    `#${[r, g, b]
      .map((x) => Math.round(x).toString(16).padStart(2, "0"))
      .join("")}`

  const [r1, g1, b1] = parseHex(color1)
  const [r2, g2, b2] = parseHex(color2)

  const r = r1 + (r2 - r1) * p
  const g = g1 + (g2 - g1) * p
  const b = b1 + (b2 - b1) * p

  return toHex(r, g, b)
}

export function Test() {
  const [width, setWidth] = useState(0)

  const timeline = useTimeline({
    duration: 2000,
    loop: false,
  })

  useEffect(() => {
    timeline.add(
      {
        width,
      },
      {
        width: 50,
        duration: 2000,
        ease: "linear",
        onUpdate: (animation) => {
          setWidth(animation.targets[0].width)
        },
      },
    )
  }, [])

  return <box style={{ width, backgroundColor: "#6a5acd" }} />
}
