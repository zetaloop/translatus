import { kebabCase } from "case-anything"
import * as React from "react"

import { Toaster } from "sonner"
import { BrandLogo } from "@/components/brand-logo"
import { APP_NAME } from "@/utils/constants/app"

const frogIconElement = (
  <BrandLogo className="h-5 w-5" alt="🐸" />
)

function FrogToast({ position = "bottom-left", toastOptions, ...props }: React.ComponentProps<typeof Toaster>) {
  return (
    <Toaster
      {...props}
      position={position}
      richColors
      icons={{
        warning: frogIconElement,
        success: frogIconElement,
        error: frogIconElement,
        info: frogIconElement,
        loading: frogIconElement,
      }}
      toastOptions={{
        ...toastOptions,
        className: [`${kebabCase(APP_NAME)}-toaster`, toastOptions?.className].filter(Boolean).join(" "),
      }}
      className="z-[2147483647] notranslate"
    />
  )
}

export default FrogToast
