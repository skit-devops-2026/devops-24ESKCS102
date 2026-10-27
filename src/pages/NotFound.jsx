import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

export default function NotFound() {
  return (
    <main>
      <div className="container-max py-16 text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Icon name="alert-triangle" size={32} />
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    </main>
  )
}
