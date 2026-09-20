import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import data from './data/checklists.json'
import type { ChecklistData } from './types'
import { HomePage } from './pages/HomePage'
import { JobPage } from './pages/JobPage'
import { DayBaselinePage } from './pages/DayBaselinePage'

const checklist = data as ChecklistData

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<HomePage data={checklist} />} />
          <Route path="/day" element={<DayBaselinePage data={checklist} />} />
          <Route path="/job/:jobId" element={<JobPage data={checklist} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
