import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import TasksPage from './pages/TasksPage';
import TaskFormPage from './pages/TaskFormPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import HomeIndexPage from './pages/HomeIndexPage'
import PeoplePage from './pages/PeoplePage'
import ProtectedRoute from './ProtectedRoute';
import { TaskProvider } from './context/TasksContext';
import Navbar from './components/Navbar';
import { PeopleProvider } from './context/PeopleContext';
import PeopleClientePage from './pages/PeopleClientesPage';
import AddPeopleForm from './pages/AddPeopleForm';
import TestsFormPage from './pages/TestsFormPage'
import EditTestPage from './pages/EditTestPage';
import EditPeoplePage from './pages/EditPeoplePage';
import TestsPage from './pages/TestsPage'
import TestDetail from './pages/TextDetail';
import { TestsProvider } from './context/TestsContext';
import VerRegister from './pages/VerRegister'
import EditarRegister from './pages/EditarRegister'
import GraficaPowerBi from './pages/Excel y Graficos/GraficoPowerBi'






function App() {
  return (
      <AuthProvider>
          <TaskProvider>
              <PeopleProvider>
                  <TestsProvider>
                      <BrowserRouter>
                          <Navbar />
                          <Routes>
                              <Route path='/' element={<HomePage />} />
                              <Route path='/login' element={<LoginPage />} />
                              <Route path='/add-people' element={<PeopleClientePage />} />

                              
                              <Route element={<ProtectedRoute/>}>
                                  <Route path='/home' element={<HomeIndexPage />} />
                                  <Route path='/register' element={<RegisterPage />} />
                                  <Route path='/VerRegister' element={<VerRegister />} />   
                                  <Route path='/registers/:id' element={<EditarRegister />} /> 
                                  <Route path='/tasks' element={<TasksPage />} />
                                  <Route path='/add-task' element={<TaskFormPage />} />
                                  <Route path='/tasks/:id' element={<TaskFormPage />} />
                                  <Route path='/people' element={<PeoplePage />} />
                                  <Route path='/people/:id' element={<EditPeoplePage />} />
                                  <Route path='/add-people2' element={<AddPeopleForm />} />
                                  <Route path='/tests' element={<TestsPage />} />
                                  <Route path='/tests/:id' element={<EditTestPage />} />
                                  <Route path='/tests/:id/detail' element={<TestDetail />} />
                                  <Route path='/add-tests' element={<TestsFormPage />} />
                                  <Route path='/profile' element={<ProfilePage />} />
                                  <Route path='/PowerBi' element={<GraficaPowerBi/>} /> 
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
