import logoDark from '@/assets/icons/read-frog-dark.svg'
import logoLight from '@/assets/icons/read-frog.svg'

interface BrandLogoProps {
  className?: string
  alt?: string
}

export function BrandLogo({ className, alt }: BrandLogoProps) {
  return (
    <picture className={className}>
      <source srcSet={logoDark} media="(prefers-color-scheme: dark)" />
      <img src={logoLight} alt={alt ?? 'ReadFrog'} className="h-full w-full" />
    </picture>
  )
}
