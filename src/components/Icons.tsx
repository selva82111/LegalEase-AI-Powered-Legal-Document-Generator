import type { ReactNode, SVGProps } from 'react'

export type IconName = 'grid' | 'file' | 'clock' | 'settings' | 'help' | 'plus' | 'arrow' | 'spark' | 'download' | 'edit' | 'close' | 'check' | 'chevron' | 'printer' | 'sun' | 'moon' | 'shield' | 'search' | 'more' | 'menu' | 'upload' | 'external'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

export function Icon({ name, width = 18, height = 18, ...props }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></>,
    file: <><path d="M6 3.75h8l4 4V20.5a1.75 1.75 0 0 1-1.75 1.75H6A1.75 1.75 0 0 1 4.25 20.5v-15A1.75 1.75 0 0 1 6 3.75Z"/><path d="M14 3.75v4h4M8 12h8M8 16h6"/></>,
    clock: <><circle cx="12" cy="12" r="8.75"/><path d="M12 7v5l3.25 2"/></>,
    settings: <><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"/><path d="m19.25 13.05 1.4 1.08-1.7 2.94-1.68-.62a8 8 0 0 1-1.55.9l-.26 1.77h-3.4l-.26-1.77a8 8 0 0 1-1.55-.9l-1.68.62-1.7-2.94 1.4-1.08a7.8 7.8 0 0 1 0-2.1l-1.4-1.08 1.7-2.94 1.68.62a8 8 0 0 1 1.55-.9l.26-1.77h3.4l.26 1.77a8 8 0 0 1 1.55.9l1.68-.62 1.7 2.94-1.4 1.08a7.8 7.8 0 0 1 0 2.1Z"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.7 9.4a2.45 2.45 0 1 1 4.14 1.76c-.9.83-1.84 1.2-1.84 2.6M12 16.9h.01"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h13M13 7l5 5-5 5"/></>,
    spark: <><path d="m12 2 1.55 6.45L20 10l-6.45 1.55L12 18l-1.55-6.45L4 10l6.45-1.55L12 2Z"/><path d="m19 16 .58 2.42L22 19l-2.42.58L19 22l-.58-2.42L16 19l2.42-.58L19 16Z"/></>,
    download: <><path d="M12 4v11M7.5 11.5 12 16l4.5-4.5M5 20h14"/></>,
    edit: <><path d="m4 16.75-.75 3.75L7 19.75 18.5 8.25 15.75 5.5 4 16.75Z"/><path d="m14.25 7 2.75 2.75"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12.5 4.5 4.5L19 7.5"/>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    printer: <><path d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7zM18 12h.01"/></>,
    sun: <><circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.72 5.28l-1.42 1.42M6.7 17.3l-1.42 1.42M18.72 18.72l-1.42-1.42M6.7 6.7 5.28 5.28"/></>,
    moon: <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z"/>,
    shield: <><path d="M12 3 20 6v5.5c0 5-3.5 8.4-8 9.5-4.5-1.1-8-4.5-8-9.5V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.5 4.5"/></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    upload: <><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 20h14"/></>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5.25A1.75 1.75 0 0 1 16.25 20H6.75A1.75 1.75 0 0 1 5 18.25v-9.5A1.75 1.75 0 0 1 6.75 7H12"/></>,
  }

  return <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>
}
