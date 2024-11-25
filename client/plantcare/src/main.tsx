import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx';
import PlantCareProvider from './context/index.tsx';


createRoot(document.getElementById('root')!).render(
  <PlantCareProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
 </PlantCareProvider>

)
