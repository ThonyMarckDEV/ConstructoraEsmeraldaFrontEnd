import React from "react";

const ErrorState = ({ error }) => {
  return (
    <div className="max-w-4xl mx-auto font-sans p-4 border rounded-md bg-red-50 text-red-700">
      <p>Error cargando los datos del módulo: {error || "Datos no disponibles"}</p>
    </div>
  );
};

export default ErrorState;