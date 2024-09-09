import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PublicRoutes, AdminRoutes, EmployeeRoutes, PrivateRoutes } from "./routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { AnnouncementProvider } from "./contexts/Announcement";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, isLogin } = useAuth();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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



function App() {

  return (
    <AuthProvider>
      <AnnouncementProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Render public routes */}
              {PublicRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={<route.component />} />
              ))}

              {/* Render private routes */}
              {PrivateRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<PrivateRoute allowedRoles={route.allowedRoles} isLogin={route.isLogin} element={<route.component />} />}
                />
              ))}

              {/* Render admin routes */}
              {AdminRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<PrivateRoute allowedRoles={['admin']} isLogin={route.isLogin} element={<route.component />} />}
                />
              ))}

              {/* Render employee routes */}
              {EmployeeRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<PrivateRoute allowedRoles={['employee']} isLogin={route.isLogin} element={<route.component />} />}
                />
              ))}
            </Routes>
          </div>
        </Router>
      </AnnouncementProvider>
    </AuthProvider>
  );
}

export default App;
