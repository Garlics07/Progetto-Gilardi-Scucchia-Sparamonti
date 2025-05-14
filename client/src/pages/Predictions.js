import React, { useState, useEffect } from 'react';
import { matchService } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Predictions = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      try {
        const response = await matchService.getUpcoming();
        setUpcomingMatches(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, []);

  const handleMatchClick = async (match) => {
    try {
      const predictions = await matchService.getPredictions(match._id);
      setSelectedMatch({ ...match, predictions: predictions.data });
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const chartData = selectedMatch?.predictions ? {
    labels: ['Vittoria Casa', 'Pareggio', 'Vittoria Trasferta'],
    datasets: [
      {
        data: [
          selectedMatch.predictions.homeWin,
          selectedMatch.predictions.draw,
          selectedMatch.predictions.awayWin
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  } : null;

  if (loading) {
    return <div className="text-center py-10">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Previsioni</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Partite */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Prossime Partite</h2>
              <div className="space-y-2">
                {upcomingMatches.map((match) => (
                  <button
                    key={match._id}
                    onClick={() => handleMatchClick(match)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      selectedMatch?._id === match._id
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{match.homeTeam} vs {match.awayTeam}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(match.date).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dettagli Previsioni */}
        <div className="lg:col-span-2">
          {selectedMatch ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Previsioni: {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Probabilità</h3>
                    {chartData && <Pie data={chartData} />}
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Fattori Considerati</h3>
                    <div className="space-y-2">
                      <p>Forma recente: {selectedMatch.predictions.formFactor}</p>
                      <p>Vantaggio casa: {selectedMatch.predictions.homeAdvantage}</p>
                      <p>Confronti diretti: {selectedMatch.predictions.headToHead}</p>
                      <p>Disponibilità giocatori: {selectedMatch.predictions.playerAvailability}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-gray-500">Seleziona una partita per vedere le previsioni</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions; 