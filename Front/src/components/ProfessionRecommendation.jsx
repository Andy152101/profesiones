import React, { useState, useEffect } from "react";
import { analyzeTestRequest } from "../api/test.js";
import PropTypes from "prop-types";

function ProfessionRecommendation({ testId }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await analyzeTestRequest(testId);
        setRecommendations(res.data);
      } catch (err) {
        setError("No se pudieron cargar las recomendaciones.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [testId]);

  if (loading) {
    return <p className="text-white">Cargando recomendaciones...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!recommendations || recommendations.recommendedProfessions.length === 0) {
    return (
      <p className="text-white">
        No se encontraron profesiones recomendadas para este test.
      </p>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-md mt-4">
      <h3 className="text-xl font-bold text-white mb-4">
        Profesiones Recomendadas
      </h3>
      <p className="text-gray-300 mb-2">
        Habilidad(es) más destacada(s):{" "}
        <span className="font-semibold">
          {recommendations.bestTestFields.join(", ")}
        </span>{" "}
        con un puntaje normalizado de{" "}
        <span className="font-semibold">
          {recommendations.normalizedScore.toFixed(2)}%
        </span>
        .
      </p>
      <ul className="space-y-4">
        {recommendations.recommendedProfessions.map((profession) => (
          <li key={profession._id} className="bg-gray-700 p-4 rounded-md">
            <h4 className="text-lg font-bold text-white">{profession.name}</h4>
            <p className="text-gray-300">{profession.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

ProfessionRecommendation.propTypes = {
  testId: PropTypes.string.isRequired,
};

export default ProfessionRecommendation;
