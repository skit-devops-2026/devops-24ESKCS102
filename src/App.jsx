import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Gases from './pages/Gases'
import GasDetail from './pages/GasDetail'
import Soil from './pages/Soil'
import SoilDetail from './pages/SoilDetail'
import Water from './pages/Water'
import WaterDetail from './pages/WaterDetail'
import Government from './pages/Government'
import Industrial from './pages/Industrial'
import ClimateAdvisor from './pages/ClimateAdvisor'
import CropAdviser from './pages/CropAdviser'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="index.html" element={<Navigate to="/" replace />} />
          <Route path="gases.html" element={<Navigate to="/gases" replace />} />
          <Route path="gas-detail.html" element={<Navigate to="/gas-detail" replace />} />
          <Route path="soil.html" element={<Navigate to="/soil" replace />} />
          <Route path="soil-detail.html" element={<Navigate to="/soil-detail" replace />} />
          <Route path="water.html" element={<Navigate to="/water" replace />} />
          <Route path="water-detail.html" element={<Navigate to="/water-detail" replace />} />
          <Route path="government.html" element={<Navigate to="/government" replace />} />
          <Route path="industrial.html" element={<Navigate to="/industrial" replace />} />
          <Route path="advisor.html" element={<Navigate to="/advisor" replace />} />
          <Route path="crop-adviser.html" element={<Navigate to="/crop-adviser" replace />} />
          <Route path="gases" element={<Gases />} />
          <Route path="gas-detail" element={<GasDetail />} />
          <Route path="soil" element={<Soil />} />
          <Route path="soil-detail" element={<SoilDetail />} />
          <Route path="water" element={<Water />} />
          <Route path="water-detail" element={<WaterDetail />} />
          <Route path="government" element={<Government />} />
          <Route path="industrial" element={<Industrial />} />
          <Route path="advisor" element={<ClimateAdvisor />} />
          <Route path="crop-adviser" element={<CropAdviser />} />
          <Route path="404.html" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
