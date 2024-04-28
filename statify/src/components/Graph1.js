import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Graph1.css"; 

function Graph1({ genres }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const genreLabels = Object.keys(genres);
    const genreData = Object.values(genres).map(value => parseFloat(value));

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: genreLabels,
        datasets: [{
          label: "Genres musicaux",
          data: genreData,
          backgroundColor: [
            "rgba(112, 150, 255)",
            "rgba(79, 105, 179)",
            "rgba(61, 81, 138)",
            "rgba(43, 57, 97)",
            // Autres couleurs pour les genres supplémentaires
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    return () => chartInstance.current?.destroy();
  }, [genres]);

  return <canvas ref={chartRef} />;
}

export default Graph1;
