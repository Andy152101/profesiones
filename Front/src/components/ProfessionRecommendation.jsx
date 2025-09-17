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
    return <p className="text-black">Cargando recomendaciones...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!recommendations || recommendations.recommendedProfessions.length === 0) {
    return (
      <p className="text-black">
        No se encontraron profesiones recomendadas para este test.
      </p>
    );
  }

  return (
    <div className="bg-transparent p-6 rounded-md mt-4">
      <h3 className="text-xl font-bold text-black mb-4">
        Profesiones Recomendadas
      </h3>
      <p className="text-black mb-2">
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
          <li key={profession._id} className="bg-gray-200 p-4 rounded-md">
            <h4 className="text-lg font-bold text-black">{profession.name}</h4>
            <p className="text-black">{profession.description}</p>
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
