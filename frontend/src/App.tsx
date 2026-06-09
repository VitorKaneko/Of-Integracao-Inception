import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { FilesPage } from "./pages/FilesPage";
import { FolderDetailPage } from "./pages/FolderDetailPage";
import { CoursesPage } from "./pages/CoursesPage";
import { RequestsPage } from "./pages/RequestsPage";
import { NewRequestPage } from "./pages/NewRequestPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UsersPage } from "./pages/UsersPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="projetos/:id" element={<ProjectDetailPage />} />
        <Route path="arquivos" element={<FilesPage />} />
        <Route path="arquivos/:folderId" element={<FolderDetailPage />} />
        <Route path="cursos" element={<CoursesPage />} />
        <Route path="solicitacoes" element={<RequestsPage />} />
        <Route path="solicitacoes/nova" element={<NewRequestPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route
          path="usuarios"
          element={
            <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
