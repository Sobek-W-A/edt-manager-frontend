import {
    createBrowserRouter, Outlet,
    RouterProvider,
} from "react-router-dom"
import './index.css'
import {createRoot} from "react-dom/client";

import Example from "./Vues/Example.tsx";
import {StrictMode} from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div><Outlet/></div>,
        errorElement: <div></div>,
        children : [
            {
                path: "/example",
                element: <div><Example/></div>,
            }
        ]
    },
]);




createRoot(document.getElementById('root')).render(
    <StrictMode>
            <RouterProvider router={router} />
    </StrictMode>
)
