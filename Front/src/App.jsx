// Importaciones principales de React Router, contextos y páginas
// React Router: para el manejo de rutas en la SPA
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Páginas principales de la aplicación
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/Login";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import HomeIndexPage from "./pages/HomeIndexPage";
import PeoplePage from "./pages/PeoplePage";
import VerRegister from "./pages/VerRegister";
import EditarRegister from "./pages/EditarRegister";
import PeopleClientePage from "./pages/PeopleClientesPage";
import AddPeopleForm from "./pages/AddPeopleForm";
import TestsFormPage from "./pages/TestsFormPage";
import EditTestPage from "./pages/EditTestPage";
import EditPeoplePage from "./pages/EditPeoplePage";
import TestsPage from "./pages/TestsPage";
import TestDetail from "./pages/TextDetail";
import GraficaPowerBi from "./pages/Excel y Graficos/GraficoPowerBi";

// Nuevas páginas del sistema mejorado
//import CompanyRegistrationPage from "./pages/CompanyRegistrationPage";
import CompaniesPage from "./pages/CompanyPage";
import CreateCompanyPage from "./pages/CreateCompanyPage";
import EditCompanyPage from "./pages/CompanyEdit";

// Componentes y rutas protegidas
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";

// Proveedores de contexto global
import { TestsProvider } from "./context/TestsContext";
import { TaskProvider } from "./context/TasksContext";
import { AuthProvider } from "./context/AuthContext";
import { PeopleProvider } from "./context/PeopleContext";
import AccessCodePage from "./pages/AccessCodePage";

// Componente principal de la aplicación.
// Envuelve toda la app con los contextos de autenticación, tareas, personas y tests.
// Define la estructura de rutas públicas y protegidas usando React Router.
function App() {
  return (
    // Proveedor global de autenticación
    <AuthProvider>
      {/* Proveedor global de tareas */}
      <TaskProvider>
        {/* Proveedor global de personas */}
        <PeopleProvider>
          {/* Proveedor global de tests */}
          <TestsProvider>
            {/* Configuración de rutas con React Router */}
            <BrowserRouter>
              {/* Barra de navegación visible en todas las páginas */}
              <Navbar />
              <Routes>
                {/* Rutas públicas: accesibles sin autenticación */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/acceso" element={<AccessCodePage />} />
                <Route path="/add-people" element={<PeopleClientePage />} />

                {/* Rutas protegidas: requieren autenticación */}
                <Route element={<ProtectedRoute />}>
                  {/* Página principal del usuario autenticado */}
                  <Route path="/home" element={<HomeIndexPage />} />
                  {/* Registro de usuarios */}
                  <Route path="/register" element={<RegisterPage />} />
                  {/* Visualización y edición de registros */}
                  <Route path="/VerRegister" element={<VerRegister />} />
                  <Route path="/registers/:id" element={<EditarRegister />} />
                  {/* Gestión de tareas */}
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/add-task" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskFormPage />} />
                  {/* Gestión de personas */}
                  <Route path="/people" element={<PeoplePage />} />
                  <Route path="/people/:id" element={<EditPeoplePage />} />
                  <Route path="/add-people2" element={<AddPeopleForm />} />
                  {/* Gestión de tests */}
                  <Route path="/tests" element={<TestsPage />} />
                  <Route path="/tests/:id" element={<EditTestPage />} />
                  <Route path="/tests/:id/detail" element={<TestDetail />} />
                  <Route path="/add-tests" element={<TestsFormPage />} />
                  {/* Perfil del usuario */}
                  <Route path="/profile" element={<ProfilePage />} />
                  {/* Perfil del usuario y grafica de PowerBI */}
                  <Route path="/PowerBi" element={<GraficaPowerBi />} />
                  {/* Nueva página para crear empresas */}
                  <Route
                    path="/create-company"
                    element={<CreateCompanyPage />}
                  />
                  <Route path="/companiesPage" element={<CompaniesPage />} />
                  <Route
                    path="/companies/:id/edit"
                    element={<EditCompanyPage />}
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </TestsProvider>
        </PeopleProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
