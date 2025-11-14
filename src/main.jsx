import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css'

import App from './App.jsx'
import FormPage from './pages/FormPage/FormPage.jsx';
import SuccessApp from './pages/SuccessPage/SuccessApp.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "form",
    element: <FormPage />,
  },
  {
    path: "success",
    element: <SuccessApp />,
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
