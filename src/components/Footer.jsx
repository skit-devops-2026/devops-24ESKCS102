import { Link } from 'react-router-dom'
import { iconMarkup } from './Icon'

export default function Footer() {
  return (
    <footer className="clima-footer mt-10">
      <div className="container-max py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="logo-badge" style={{width:'2.2rem',height:'2.2rem',borderRadius:'0.625rem'}} dangerouslySetInnerHTML={{ __html: iconMarkup("cloud", 20) }} />
          <div>
            <p className="text-sm font-bold text-slate-800">© 2026 ClimaPulse</p>
            <p className="text-xs text-slate-500">Phase 1 data is simulated for demonstration purposes.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-800 hover:underline">Dashboard</Link>
          <Link to="/government" className="hover:text-slate-800 hover:underline">Government</Link>
          <Link to="/advisor" className="hover:text-slate-800 hover:underline">Climate Advisor</Link>
        </div>
      </div>
    </footer>
  )
}
