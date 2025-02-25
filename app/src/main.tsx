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
import ModifyProfile from "./Vues/ModifyProfile.tsx";
import UserAffectation from './Vues/UserAffectation.tsx';


// Configuration des routes
const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
        <Route path="add-role" element={<Guard><AddRole /></Guard>} />
        <Route path="accountcreation" element={<Guard><AddAccount /></Guard>} />
        <Route path="profileCreation" element={<Guard><AddProfile /></Guard>} />
        <Route path="management" element={<Guard><ManageHumanResources /></Guard>} />
        <Route path="login" element={<LoginVue />} />
        <Route path="assigned-courses" element={<Guard><AssignedCoursesPage /></Guard>} />
        <Route path="modify/:id" element={<Guard><ModifyProfile/></Guard>} />
        <Route path="affectation/:idProfile" element={<Guard><UserAffectation /></Guard>} />
    </Route>
);

// Création du routeur avec les routes
const router = createBrowserRouter(routes);

// Point d'entrée de l'application React
ReactDOM.createRoot(document.getElementById('root') ?? new HTMLElement())
    .render(
        <RouterProvider router={router} />
);
