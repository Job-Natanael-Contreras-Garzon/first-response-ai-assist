import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-cyan-100 to-teal-100">
      <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-cyan-200">
        <h1 className="text-4xl font-bold mb-4 text-slate-700">404</h1>
        <p className="text-xl text-slate-600 mb-6">Página no encontrada</p>
        <a 
          href="/" 
          className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-md"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
