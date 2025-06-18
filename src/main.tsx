import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import { DatabaseProvider } from './contexts/DatabaseContext.tsx';

createRoot(document.getElementById('root')!).render(
  <DatabaseProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </DatabaseProvider>
)
