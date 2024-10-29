import React, { useState } from "react";
import AuthModel from "../scripts/Models/AuthModel";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            const auth = new AuthModel(email, password);
            const response = await auth.login();
            
            if (response.isError()) {
                setError("Identifiants incorrects");
                return;
            }
            
            // Redirection après connexion réussie
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
                        <label htmlFor="email" className="block text-sm font-medium text-green-700">
                            Adresse e-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 mt-1 text-green-900 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="exemple@domaine.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                name="remember_me"
                                type="checkbox"
                                className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="remember_me" className="block ml-2 text-sm text-green-700">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                Mot de passe oublié ?
                            </a>
                        </div>
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
