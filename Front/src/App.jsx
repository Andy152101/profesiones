// Importaciones principales de React Router, contextos y páginas
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import TestEmpresa from "./pages/TextEmpresa";
import TestEmpleado from "./pages/TextEmpleado";
import GraficaPowerBi from "./pages/Excel y Graficos/GraficoPowerBi";

// Nuevas páginas del sistema mejorado
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
import { CompanyProvider } from "./context/CompanyContext";
import AccessCodePage from "./pages/AccessCodePage";

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <TaskProvider>
          <PeopleProvider>
            <TestsProvider>
              <BrowserRouter>
                <Navbar />

                {/* Contenedor global de Toastify */}
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />

                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/acceso" element={<AccessCodePage />} />
                  <Route path="/add-people" element={<PeopleClientePage />} />

                  {/* Rutas protegidas */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<HomeIndexPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/VerRegister" element={<VerRegister />} />
                    <Route path="/registers/:id" element={<EditarRegister />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/add-task" element={<TaskFormPage />} />
                    <Route path="/tasks/:id" element={<TaskFormPage />} />
                    <Route path="/people" element={<PeoplePage />} />
                    <Route path="/people/:id" element={<EditPeoplePage />} />
                    <Route path="/add-people2" element={<AddPeopleForm />} />
                    <Route path="/tests" element={<TestsPage />} />
                    <Route path="/tests/:id" element={<EditTestPage />} />
                    <Route
                      path="/tests/:id/detailEmpresa"
                      element={<TestEmpresa />}
                    />
                    <Route
                      path="/tests/:id/detailEmpleado"
                      element={<TestEmpleado />}
                    />
                    <Route path="/add-tests" element={<TestsFormPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/PowerBi" element={<GraficaPowerBi />} />
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
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
