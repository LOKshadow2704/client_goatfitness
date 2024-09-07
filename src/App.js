import React from 'react';
import { RouterProvider, createBrowserRouter, Route, createRoutesFromElements, Navigate } from 'react-router-dom';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import NavigationScroll from './components/MainLayout/NavigationScroll';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnnouncementProvider } from './contexts/Announcement';
import { PublicRoutes, AdminRoutes, EmployeeRoutes, PrivateRoutes } from './routes';

// Tạo router từ các routes
const createRouter = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Render public routes */}
        {PublicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {/* Render private routes */}
        {PrivateRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<PrivateRoute allowedRoles={route.allowedRoles} isLogin={route.isLogin} element={route.element} />}
          />
        ))}

        {/* Render admin routes */}
        {AdminRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<PrivateRoute allowedRoles={['admin']} isLogin={route.isLogin} element={route.element} />}
          >
            {route.children && route.children.map((childRoute, childIndex) => (
              <Route
                key={childIndex}
                path={childRoute.path}
                element={<PrivateRoute allowedRoles={childRoute.allowedRoles} isLogin={childRoute.isLogin} element={childRoute.element} />}
              />
            ))}
          </Route>
        ))}

        {/* Render employee routes */}
        {EmployeeRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<PrivateRoute allowedRoles={['employee']} isLogin={route.isLogin} element={route.element} />}
          />
        ))}
      </>
    )
  );
};

// Component kiểm tra quyền truy cập
const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, isLogin } = useAuth();
  const [redirectToLogin, setRedirectToLogin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isLogin && user) {
      setLoading(false);
      if (allowedRoles && !allowedRoles.includes(user.TenVaiTro)) {
        alert("Người dùng không có quyền truy cập");
        setRedirectToLogin(true);
      }
    }
  }, [isLogin, user, allowedRoles]);

  if (loading) {
    return "loading";
  }

  if (redirectToLogin || !isLogin || !user) {
    return <Navigate to="/login" />;
  }

  return element;
};

const App = () => {
  const router = createRouter(); // Tạo router từ các routes

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <AuthProvider>
        <AnnouncementProvider>
          <NavigationScroll>
            <RouterProvider router={router} />
          </NavigationScroll>
        </AnnouncementProvider>
      </AuthProvider>
    </StyledEngineProvider>
  );
};

export default App;
