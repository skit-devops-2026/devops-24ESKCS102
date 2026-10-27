import { ICON_PATHS } from './icons'

export function Icon({ name, size = 20, className = '' }) {
  const svg = ICON_PATHS[name] || ICON_PATHS.cloud
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: svg.replace('width="24"', `width="${size}"`).replace('height="24"', `height="${size}"`) 
      }} 
    />
  )
}

export function iconMarkup(name, size = 20) {
  const svg = ICON_PATHS[name] || ICON_PATHS.cloud
  return svg.replace('width="24"', `width="${size}"`).replace('height="24"', `height="${size}"`)
}

export { ICON_PATHS }
