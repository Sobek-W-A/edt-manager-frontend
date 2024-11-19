import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import LoginVue from "./Vues/LoginVue.tsx";
import AddRole from "./Vues/AddRole.tsx";
import Layout from "./Components/Utils/Layout.tsx";
import './index.css';
import Register from "./Vues/Register.tsx";
import ModifyUser from "./Vues/ModifyUser.tsx";

// Configuration des routes
const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginVue />} />
        <Route path="add-role" element={<AddRole />} />
        <Route path="accountcreation" element={<Register />} />
        <Route path="modify/:id" element={<ModifyUser />} />
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
