// Login.jsx
import React, { useState, useEffect } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import CompanyLogo from '../assets/logo.png';
import { loginUser } from "../services/auth"; // en haut de Login.jsx

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", general: "" };

    if (!form.email) {
      newErrors.email = "L'adresse e-mail est requise";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Adresse e-mail invalide";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (isSubmitted) validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) return;

    setIsLoading(true);
  try {
  const res = await loginUser(form.email, form.password);
  console.log("✅ Connexion réussie :", res);
  
  // Sauvegarder le token si reçu
  if (res.token) {
    localStorage.setItem("token", res.token);
  }

  // ✅ Redirection ou succès
  alert("Connexion réussie !");
  // navigate("/dashboard"); // si tu veux rediriger

} catch (error) {
  const errorMsg = error.response?.data?.message || "Erreur de connexion";
  setErrors({ ...errors, general: errorMsg });
} finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitted) validateForm();
  }, [form, isSubmitted]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative max-w-md w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-10 transform transition-all duration-500 hover:shadow-3xl">
        <div className="relative text-center mb-10">
          {/* Logo décalé légèrement à gauche avec -ml-2 */}
          <div className="flex justify-center mb-6 transform transition-transform duration-300 hover:scale-105 -ml-7">
            <img
              src={CompanyLogo}
              alt="Logo GPRO Consulting"
              className="h-28 w-auto object-contain drop-shadow-lg"
            />
          </div>
          {/* Titre avec dégradé sophistiqué */}
   <h2 className="text-4xl font-bold text-gray-800 mb-2">
    Bienvenue
  </h2>

  {/* Sous-titre discret */}
  <p className="text-lg text-gray-600">
    Connectez-vous à votre espace RH
  </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="group">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Adresse e-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-500 group-hover:text-blue-800 transition-colors" size={20} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="prenom.nom@entreprise.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 bg-white hover:bg-gray-50 placeholder-gray-400"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500 group-hover:text-blue-800 transition-colors" size={20} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 bg-white hover:bg-gray-50 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="sr-only peer"
                  disabled={isLoading}
                />
                <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center transition-all duration-300 peer-checked:bg-blue-800 peer-checked:border-blue-800 hover:border-blue-600">
                  {form.remember && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-blue-800 hover:text-blue-900 transition-colors font-medium hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          {/* Submit - Bouton en bleu très foncé */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-950 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connexion en cours...
              </>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Se connecter
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} GPRO Consulting. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}