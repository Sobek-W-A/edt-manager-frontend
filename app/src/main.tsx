import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import LoginVue from "./Vues/LoginVue.tsx";
import AddRole from "./Vues/AddRole.tsx";
import Layout from "./Components/Utils/Layout.tsx";
import './index.css';
import AddAccount from "./Vues/AddAccount.tsx";
import ModifyUser from "./Vues/ModifyUser.tsx";
import ManageHumanResources from "./Vues/ManageHumanResources.tsx";
import AddProfile from "./Vues/AddProfile.tsx";

// Configuration des routes
const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
        <Route path="add-role" element={<AddRole />} />
        <Route path="accountcreation" element={<AddAccount />} />
        <Route path="profileCreation" element={<AddProfile/>} />
        <Route path="modify/:id" element={<ModifyUser />} />
        <Route path="management" element={<ManageHumanResources/>}/>
        <Route path="login" element={<LoginVue />} />
        <Route path="professor" element={<ProfessorVue />} />
    </Route>
);

// Création du routeur avec les routes
const router = createBrowserRouter(routes);

// Point d'entrée de l'application React
ReactDOM.createRoot(document.getElementById('root') ?? new HTMLElement())
    .render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
