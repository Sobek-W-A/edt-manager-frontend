import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import Example from "./Vues/Example.tsx";
<<<<<<< HEAD
import LoginVue from "./Vues/LoginVue.tsx";
import AddRole from "./Vues/AddRole.tsx";
=======
>>>>>>> 13-add-register-page
import Layout from "./Components/Utils/Layout.jsx";
import './index.css';
import Register from "./Vues/Register.tsx";
import LoginVue from "./Vues/LoginVue.tsx";

// Configuration des routes
const routes = createRoutesFromElements(
        <Route path="/" element={<Layout/>}>
            <Route path="example" element={<Example/>} />
            <Route path="login" element={<LoginVue/>} />
<<<<<<< HEAD
            <Route path="add-role" element={<AddRole/>} />
=======
            <Route path="accountcreation" element={<Register/>} />
>>>>>>> 13-add-register-page
        </Route>
);

// Création du routeur avec les routes
const router = createBrowserRouter(routes);

// Point d'entrée de l'application React
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);