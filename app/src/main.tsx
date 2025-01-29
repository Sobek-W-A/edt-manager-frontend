import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import LoginVue from "./Vues/LoginVue.tsx";
import AddRole from "./Vues/AddRole.tsx";
import Layout from "./Components/Utils/Layout.tsx";
import './index.css';
import AddAccount from "./Vues/AddAccount.tsx";
import ManageHumanResources from "./Vues/ManageHumanResources.tsx";
import AddProfile from "./Vues/AddProfile.tsx";
import AssignedCoursesPage from './Vues/AssignedCoursesPage.tsx';
import Guard from "./Components/Utils/Guard.tsx";
import AdminGuard from "./Components/Utils/AdminGuard.tsx"; // Add this import

// Configuration des routes
const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
        {/* Public route */}
        <Route path="login" element={<LoginVue />} />

        {/* Admin-protected routes */}
        <Route path="add-role" element={
            <AdminGuard>
                <AddRole />
            </AdminGuard>
        } />
        
        <Route path="accountcreation" element={
            <AdminGuard>
                <AddAccount />
            </AdminGuard>
        } />

        <Route path="profileCreation" element={
            <AdminGuard>
                <AddProfile />
            </AdminGuard>
        } />

        <Route path="management" element={
            <AdminGuard>
                <ManageHumanResources />
            </AdminGuard>
        } />

        {/* Regular authenticated routes */}
        <Route path="assigned-courses" element={
            <Guard>
                <AssignedCoursesPage />
            </Guard>
        } />
    </Route>
);

// Création du routeur avec les routes
const router = createBrowserRouter(routes);

// Point d'entrée de l'application React
ReactDOM.createRoot(document.getElementById('root') ?? new HTMLElement())
    .render(
        <RouterProvider router={router} />
);