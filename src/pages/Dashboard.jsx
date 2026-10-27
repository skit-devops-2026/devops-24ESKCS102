import { useState, useEffect } from 'react'
import { getCurrent as getWeather } from '../services/weatherService'
import { getCurrent as getAQI, getClimateSnapshot } from '../services/airQualityService'
import { geocode } from '../services/geocodeService'
import { createLocationSearch } from '../components/LocationSearch'
import { renderWeatherWidget } from '../components/dashboard/WeatherWidget'
import { renderAqiGauge } from '../components/dashboard/AqiGauge'
import { renderTrendChart } from '../components/dashboard/TrendChart'
import { renderGasBreakdown } from '../components/dashboard/GasBreakdown'
import { renderClimateSnapshot } from '../components/dashboard/ClimateSnapshot'
import { showLoading, showError, buildEmailSummaryTemplate } from '../utils/utils'
import { Icon } from '../components/Icon'
import { toast } from '../utils/toast'

const DEFAULT_LOCATION = "New York"

export default function Dashboard() {
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [userSelected, setUserSelected] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const [period, setPeriod] = useState("daily")
  const [metric, setMetric] = useState("temperature")
  const [alertBanner, setAlertBanner] = useState([])
  const [loading, setLoading] = useState(true)

  const searchRef = { current: null }
  
  useEffect(() => {
    // Setup location search
    const container = document.getElementById('location-search')
    if (container && !container.dataset.init) {
      container.dataset.init = 'true'
      const ctrl = createLocationSearch(container, {
        value: "",
        onSelect: (loc) => {
          setUserSelected(true)
          const resolved = geocode(loc.name)
          setLocation(resolved.name)
        },
      })
    }

    // Geolocate
    detectLocation().then((resolved) => {
      if (userSelected) return
      setLocation(resolved.name)
    })
  }, [])

  useEffect(() => {
    loadAll()
  }, [location])

  useEffect(() => {
    // Re-render trend chart
    const chartWrap = document.getElementById('trend-chart')
    if (chartWrap && location) {
      renderTrendChart(chartWrap, location, period, metric)
    }
  }, [period, metric, location])

  async function loadAll() {
    setLoading(true)
    try {
      const [weather, airQuality, snapshot] = await Promise.all([
        getWeather(location),
        getAQI(location),
        getClimateSnapshot(location),
      ])
      setCurrentData({ weather, airQuality, snapshot })
      setAlertBanner(renderAlerts(weather, airQuality))
      setLoading(false)
      
      // Render components
      setTimeout(() => {
        renderWeatherWidget(document.getElementById('weather-widget'), weather)
        renderAqiGauge(document.getElementById('aqi-gauge'), airQuality)
        renderTrendChart(document.getElementById('trend-chart'), location, period, metric)
        renderGasBreakdown(document.getElementById('gas-breakdown'), airQuality.pollutants)
        renderClimateSnapshot(document.getElementById('climate-snapshot'), snapshot)
      }, 0)
    } catch (e) {
      setLoading(false)
      const content = document.getElementById('dashboard-content')
      if (content) showError(content, "Unable to load climate data.", loadAll)
    }
  }

  function detectLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(geocode(DEFAULT_LOCATION))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ name: DEFAULT_LOCATION })
        },
        () => resolve(geocode(DEFAULT_LOCATION)),
        { timeout: 5000, maximumAge: 0 }
      )
    })
  }

  function renderAlerts(weather, airQuality) {
    const alerts = []
    const aqiInfo = { Good: 0, Moderate: 1, "Unhealthy for Sensitive Groups": 2, Unhealthy: 3, "Very Unhealthy": 4, Hazardous: 5 }
    
    if (weather.uvIndex >= 6) {
      alerts.push({ level: "warning", color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", title: "High UV Warning", msg: `UV index is ${weather.uvIndex} (${weather.uvLabel}). Limit direct sun exposure between 10am–4pm and use SPF 30+.` })
    }
    if (weather.rainProbability >= 70) {
      alerts.push({ level: "info", color: "#0284c7", bg: "#f0f9ff", border: "#bae6fd", title: "Rain Warning", msg: `${weather.rainProbability}% chance of rain. Carry an umbrella and allow extra travel time.` })
    }
    if (weather.windSpeed >= 30) {
      alerts.push({ level: "warning", color: "#f97316", bg: "#fff7ed", border: "#fdba74", title: "Strong Wind Advisory", msg: `Winds of ${Math.round(weather.windSpeed)} km/h. Secure loose outdoor items and expect travel delays.` })
    }
    
    const aqiLevel = aqiInfo[airQuality.category] ?? 0
    if (aqiLevel >= 3) {
      alerts.push({ level: "danger", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", title: `Air Quality Warning — ${airQuality.category}`, msg: `Reduce prolonged or strenuous outdoor exertion. Sensitive groups should stay indoors when possible.` })
    } else if (aqiLevel === 2) {
      alerts.push({ level: "warning", color: "#f97316", bg: "#fffbeb", border: "#fcd34d", title: "Air Quality Advisory", msg: `AQI is ${airQuality.aqi} (${airQuality.category}). Sensitive groups should limit outdoor exertion.` })
    }
    
    if (!alerts.length) {
      return [{
        level: "success",
        bg: "#f0fdf4",
        border: "#bbf7d0",
        color: "#166534",
        title: "No active alerts",
        msg: "Conditions are generally favorable today. Stay aware of any evening air quality shifts.",
        icon: "check-circle"
      }]
    }
    
    return alerts.map(a => ({
      ...a,
      icon: a.level === "danger" ? "alert-triangle" : "cloud-rain"
    }))
  }

  function handleEmailSummary() {
    if (!currentData) return
    const btn = document.getElementById("email-summary-btn")
    if (!btn) return
    btn.disabled = true
    const original = btn.innerHTML
    btn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" style="animation:spin 0.8s linear infinite"></span> Preparing…`
    
    setTimeout(() => {
      const template = buildEmailSummaryTemplate(location, currentData)
      btn.disabled = false
      btn.innerHTML = original
      const preview = document.getElementById("email-preview-template")
      if (preview) preview.value = template
      toast.success("Daily climate summary prepared successfully.", "Email Ready")
    }, 1400)
  }

  return (
    <main>
      <div className="container-max py-8">
        <div className="page-hero rounded-3xl p-8 mb-8 bg-white border border-slate-200 relative">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-sky-600 mb-1">Hyper-Local Climate Intelligence</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Climate Dashboard for <span className="text-gradient" id="location-label">{location}</span>
              </h1>
              <p className="text-slate-500 mt-2 max-w-xl">Real-time climate, air quality, and environmental indicators for your location.</p>
            </div>
            <div id="location-search" className="w-full md:w-96"></div>
          </div>
        </div>

        <div id="alert-banner" className="space-y-3 mb-8">
          {alertBanner.map((a, i) => (
            <div key={i} className="alert-banner" style={{background:a.bg, borderColor:a.border, color:a.color}}>
              <span><Icon name={a.icon || "check-circle"} size={22} /></span>
              <div>
                <p className="font-bold">{a.title}</p>
                <p className="text-sm">{a.msg}</p>
              </div>
            </div>
          ))}
        </div>

        <div id="dashboard-content" className={`${loading ? '' : 'hidden'} space-y-8`}>
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 clima-card p-6 h-64 animate-pulse bg-slate-100"></div>
              <div className="clima-card p-6 h-64 animate-pulse bg-slate-100"></div>
            </div>
          )}
        </div>

        <div className={`${loading ? 'hidden' : ''} space-y-8`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div id="weather-widget" className="lg:col-span-2"></div>
            <div id="aqi-gauge" className="clima-card"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 clima-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="section-title">Climate Trend</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex rounded-lg overflow-hidden border border-slate-200">
                    <button type="button" className={`btn btn-sm rounded-none ${period === 'daily' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod('daily')}>Daily</button>
                    <button type="button" className={`btn btn-sm rounded-none ${period === 'weekly' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod('weekly')}>Weekly</button>
                  </div>
                  <div className="flex rounded-lg overflow-hidden border border-slate-200">
                    <button type="button" className={`btn btn-sm rounded-none ${metric === 'temperature' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMetric('temperature')}>Temp</button>
                    <button type="button" className={`btn btn-sm rounded-none ${metric === 'humidity' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMetric('humidity')}>Humidity</button>
                    <button type="button" className={`btn btn-sm rounded-none ${metric === 'aqi' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMetric('aqi')}>AQI</button>
                  </div>
                </div>
              </div>
              <div id="trend-chart" className="relative h-72"></div>
            </div>
            <div className="clima-card p-5">
              <h3 className="section-title mb-4">Gas Breakdown</h3>
              <div id="gas-breakdown"></div>
              <button type="button" id="email-summary-btn" className="btn btn-primary w-full mt-4" onClick={handleEmailSummary}>
                Email me today's summary
              </button>
              <textarea id="email-preview-template" className="hidden"></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div id="climate-snapshot" className="lg:col-span-1"></div>
            <div className="lg:col-span-2 hero-card-gradient-sky rounded-2xl border border-sky-100 p-5">
              <h3 className="section-title mb-3">How the climate is changing here</h3>
              <p className="text-sm text-slate-600">The climate snapshot compares current temperatures against the 20th-century baseline to surface long-term warming signals in your region. Combined with live weather and air quality, this gives you a complete picture for planning your day.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
