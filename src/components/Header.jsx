import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon, iconMarkup } from './Icon'

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "cloud" },
  { href: "/gases", label: "Gas Intelligence", icon: "wind" },
  { href: "/soil", label: "Soil Intelligence", icon: "sprout" },
  { href: "/water", label: "Water Intelligence", icon: "droplets" },
  { href: "/government", label: "Government", icon: "landmark" },
  { href: "/industrial", label: "Industrial Zones", icon: "factory" },
  { href: "/crop-adviser", label: "Crop Adviser", icon: "leaf" },
  { href: "/advisor", label: "Climate Advisor", icon: "sparkles" },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="clima-header">
      <div className="container-max flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3" aria-label="ClimaPulse home">
          <span className="logo-badge" dangerouslySetInnerHTML={{ __html: iconMarkup("cloud", 24) }} />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">Clima<span className="text-gradient">Pulse</span></span>
            <span className="logo-subtitle text-[11px] font-medium text-slate-500 -mt-0.5">Climate Intelligence</span>
          </span>
        </Link>

        <nav className="desktop-nav items-center gap-0.5" aria-label="Primary">
          {NAV_ITEMS.map((n) => (
            <NavLink 
              key={n.href} 
              to={n.href} 
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              end={n.href === "/"}
            >
              <Icon name={n.icon} size={18} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="icon-btn mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu">
          <Icon name="menu" size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu open" role="dialog" aria-modal="true" aria-label="Mobile navigation" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu-panel flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="logo-badge" style={{width:'2.3rem',height:'2.3rem',borderRadius:'0.625rem'}} dangerouslySetInnerHTML={{ __html: iconMarkup("cloud", 22) }} />
                <span className="font-extrabold text-slate-900 text-lg">Clima<span className="text-gradient">Pulse</span></span>
              </div>
              <button className="icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close navigation menu">
                <Icon name="x" size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile primary">
              {NAV_ITEMS.map((n) => (
                <NavLink 
                  key={n.href} 
                  to={n.href} 
                  className={({ isActive }) => `nav-link nav-link-full ${isActive ? "active" : ""}`}
                  end={n.href === "/"}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon name={n.icon} size={20} />
                  <span>{n.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
