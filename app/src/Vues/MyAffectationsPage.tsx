// MyAffectationsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AffectationAPI from "../scripts/API/ModelAPIs/AffectationAPI"; // Ajuste le chemin

const MyAffectationsPage: React.FC = () => {
  const [idProfile, setIdProfile] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await AffectationAPI.getProfile();
        if (profileResponse.isError()) {
          setError(`Erreur : ${profileResponse.errorMessage()}`);
        } else {
          const profile = profileResponse.responseObject();
          if (profile && profile.id) {
            setIdProfile(profile.id);
            // Rediriger vers la route existante /affectation/{idProfile}
            navigate(`/affectation/${profile.id}`);
          } else {
            setError("ID du profil non trouvé.");
          }
        }
      } catch (err) {
        setError("Erreur lors de la récupération du profil.");
      }
    };
    fetchProfile();
  }, [navigate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!idProfile) {
    return <div>Chargement...</div>;
  }

  // Retourne un message temporaire pendant la redirection
  return <div>Redirection vers vos affectations...</div>;
};

export default MyAffectationsPage;