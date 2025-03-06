import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import LoginVue from './Vues/LoginVue.tsx';
import ManageHumanResources from './Vues/ManageHumanResources.tsx';
import AddRole from './Vues/UserList.tsx';
import AddAccount from './Vues/AddAccount.tsx';
import AddProfile from './Vues/AddProfile.tsx';
import ModifyProfile from './Vues/ModifyProfile.tsx';
import UserAffectation from './Vues/UserAffectation.tsx';
import MyAffectationsPage from './Vues/MyAffectationsPage.tsx'; // Ajoute cette importation
import Guard from './Components/Utils/Guard.tsx';
import Layout from './Components/Utils/Layout.tsx';
import './index.css';
import AffectationsManquantes from "./Vues/AffectationsManquantes.tsx";

// Define routes with role-based access
const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    {/* Public route */}
    <Route path="login" element={<LoginVue />} />

    {/* Admin-only routes */}
    <Route
      path="userList"
      element={<Guard allowedRoles={['Administrateur']}><AddRole /></Guard>}
    />
    <Route
      path="accountcreation"
      element={<Guard allowedRoles={['Administrateur']}><AddAccount /></Guard>}
    />
    <Route
      path="profileCreation"
      element={<Guard allowedRoles={['Administrateur']}><AddProfile /></Guard>}
    />
    <Route
      path="modify/:id"
      element={<Guard allowedRoles={['Administrateur']}><ModifyProfile /></Guard>}
    />
    <Route
      path="affectation/:idProfile"
      element={<Guard allowedRoles={['Professeur', 'Administrateur', 'Responsable de département', 'Responsable de formation', 'Secrétariat']}><UserAffectation /></Guard>}
    />

    {/* Management routes */}
    <Route
      path="management"
      element={
        <Guard
          allowedRoles={[
            'Responsable de département',
            'Responsable de formation',
            'Secrétariat',
            'Administrateur',
          ]}
        >
          <ManageHumanResources />
        </Guard>
      }
    />

    {/* Assigned courses */}
    <Route
      path="assigned-courses"
      element={
        <Guard allowedRoles={['Professeur', 'Administrateur', 'Responsable de département', 'Responsable de formation', 'Secrétariat']}>
          <AffectationsManquantes />
        </Guard>
      }
    />

    {/* Nouvelle page pour "Mes affectations" */}
    <Route
      path="my-affectations"
      element={
        <Guard allowedRoles={['Professeur', 'Administrateur', 'Responsable de département', 'Responsable de formation', 'Secrétariat']}>
          <MyAffectationsPage />
        </Guard>
      }
    />

    {/* Unauthorized access page */}
    <Route path="unauthorized" element={<div>Access Denied</div>} />
  </Route>
);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
);