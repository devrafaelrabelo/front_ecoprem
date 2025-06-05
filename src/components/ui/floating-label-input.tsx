"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: boolean
  showPasswordToggle?: boolean
  icon?: React.ReactNode
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, id, type = "text", error, showPasswordToggle, icon, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Combine refs
    const handleRef = (el: HTMLInputElement) => {
      inputRef.current = el
      if (typeof ref === "function") {
        ref(el)
      } else if (ref) {
        ref.current = el
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      // Atualiza o estado hasValue ao perder o foco
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Atualiza o estado hasValue quando o valor muda
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    // Efeito para sincronizar o estado hasValue com o valor do input
    React.useEffect(() => {
      if (inputRef.current) {
        setHasValue(!!inputRef.current.value)
      }
    }, [props.value])

    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type

    return (
      <div className="relative">
        <div
          className={cn(
            "relative flex items-center rounded-md border bg-background transition-all duration-200",
            error
              ? "border-red-500 dark:border-red-400"
              : focused
                ? "border-custom-secondary ring-1 ring-custom-secondary"
                : "",
            className,
          )}
        >
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
          <input
            id={id}
            type={inputType}
            className={cn(
              "peer h-10 w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm placeholder-transparent focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-9",
              showPasswordToggle && "pr-10",
            )}
            ref={handleRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={label}
            {...props}
          />
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute left-3 z-10 origin-[0] transform text-sm text-muted-foreground duration-300 px-1",
              // When not focused and no value, center the label vertically with transparent background
              !focused && !hasValue && "top-1/2 -translate-y-1/2 scale-100",
              // When focused or has value, move the label to the top border WITH background
              (focused || hasValue) && "left-3 top-0 -translate-y-1/2 scale-75 text-sm font-medium bg-background",
              focused && !error && "text-custom-secondary",
              error && "text-red-500 dark:text-red-400",
              icon && "left-9",
            )}
          >
            {label}
          </label>

          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent focus:outline-none focus:ring-0"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground transition-opacity duration-200 hover:text-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground transition-opacity duration-200 hover:text-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    )
  },
)

FloatingLabelInput.displayName = "FloatingLabelInput"
