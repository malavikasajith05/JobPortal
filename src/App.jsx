import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import AppLayout from './Layouts/app-layout';
import LandingPage from './pages/landing';
import Onboarding from './pages/onboarding';
import JobListings from './pages/job-listings';

import MyJobs from './pages/my-jobs';
import PostJob from './pages/post-job';
import Savedjob from './pages/saved-jobs';
import { ThemeProvider } from './components/theme-provider';
import ProtectedRoute from './components/protected-route';
import JobPage from './pages/job';


const router = createBrowserRouter([
  {
    element:<AppLayout />,
    children:[
      {
        path:'/',
        element:<LandingPage />
      },

      {
        path:'/onboarding',
        element:(
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
        ),
      },

      {
        path:'/jobs',
        element:(
          <ProtectedRoute>
            <JobListings />
          </ProtectedRoute>
        ),

      },

      {
        path:'/job/:id',
        element:(
        <ProtectedRoute>
         <JobPage /> 
        </ProtectedRoute>
        ),
      },

      {
        path:'/my-jobs',
        element:(
        <ProtectedRoute>
         <MyJobs /> 
        </ProtectedRoute>
        ),
      },

      {
        path:'/post-job',
        element:(
        <ProtectedRoute>
         <PostJob /> 
        </ProtectedRoute>
        ),
      },

      {
        path:'/saved-jobs',
        element:(
        <ProtectedRoute>
          <Savedjob />
        </ProtectedRoute>
        ),
      },


    ]

  }
])

function App() {
  

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
    
    
  );
}

export default App
