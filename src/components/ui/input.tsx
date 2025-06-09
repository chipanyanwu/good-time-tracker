// Input component extends from shadcnui - https://ui.shadcn.com/docs/components/input
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useMotionTemplate, useMotionValue, motion } from "motion/react"
import { LucideIcon } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hoverGrad?: boolean
  hoverGradRadius?: number
  hoverGradColor?: string
  startIcon?: LucideIcon
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, ...props }, ref) => {
    const StartIcon = startIcon

    const radius = props.hoverGradRadius || 250 // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = ({
      currentTarget,
      clientX,
      clientY,
    }: {
      currentTarget: EventTarget & HTMLElement
      clientX: number
      clientY: number
    }) => {
      const { left, top } = currentTarget.getBoundingClientRect()

      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    }

    return (
      <motion.div
        style={{
          background:
            props.hoverGrad == true || props.hoverGrad == undefined
              ? useMotionTemplate`radial-gradient(${
                  visible ? radius + "px" : "0px"
                } circle at ${mouseX}px ${mouseY}px, ${
                  props.hoverGradColor || "#7d4dc6"
                }, transparent 80%)`
              : ``,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input rounded-lg p-[1px] transition duration-300 w-full relative"
      >
        {StartIcon && (
          <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
            <StartIcon size={18} className="text-muted-foreground" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            `shadow-input placeholder:text-muted-foreground flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
            startIcon ? "pl-9" : "",
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)
Input.displayName = "Input"

export { Input }
