import { kebabCase } from 'case-anything'
import * as React from 'react'

import { Toaster } from 'sonner'
import { BrandLogo } from '@/components/brand-logo'
import { APP_NAME } from '@/utils/constants/app'

const frogIconElement = (
  <BrandLogo className="h-5 w-5" alt="🐸" />
)

function FrogToast(props: React.ComponentProps<typeof Toaster>) {
  return (
    <Toaster
      {...props}
      richColors
      icons={{
        warning: frogIconElement,
        success: frogIconElement,
        error: frogIconElement,
        info: frogIconElement,
        loading: frogIconElement,
      }}
      toastOptions={{
        className: `${kebabCase(APP_NAME)}-toaster`,
      }}
      className="z-[2147483647] notranslate"
    />
  )
}

export default FrogToast
