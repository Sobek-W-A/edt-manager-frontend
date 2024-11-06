import React, { useState } from "react";
import AuthModel from "../scripts/Models/AuthModel";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            const auth = new AuthModel(username, password);
            const response = await auth.login();
            
            if (response.isError()) {
                setError("Identifiants incorrects");
                return;
            }
            
            window.location.reload();
        } catch (err) {
            setError("Une erreur est survenue");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-green-800">Connexion</h2>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                    
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-green-700">
                            Nom d'utilisateur
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Votre nom d'utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-green-700">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Se connecter
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-green-600">
                    Pas encore de compte ?{" "}
                    <a href="#" className="font-medium text-green-700 hover:text-green-600">
                        S'inscrire
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
