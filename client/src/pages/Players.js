import React, { useState, useEffect } from 'react';
import { playerService } from '../services/api';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await playerService.getAll();
        setPlayers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handlePlayerClick = async (player) => {
    try {
      const stats = await playerService.getStats(player._id);
      setSelectedPlayer({ ...player, stats: stats.data });
    } catch (error) {
      console.error('Error fetching player stats:', error);
    }
  };

  const chartData = selectedPlayer ? {
    labels: ['Velocità', 'Tiro', 'Passaggio', 'Difesa', 'Fisico'],
    datasets: [
      {
        label: 'Statistiche',
        data: [
          selectedPlayer.stats.speed,
          selectedPlayer.stats.shooting,
          selectedPlayer.stats.passing,
          selectedPlayer.stats.defense,
          selectedPlayer.stats.physical
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  } : null;

  if (loading) {
    return <div className="text-center py-10">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Giocatori</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Giocatori */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Lista Giocatori</h2>
              <div className="space-y-2">
                {players.map((player) => (
                  <button
                    key={player._id}
                    onClick={() => handlePlayerClick(player)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      selectedPlayer?._id === player._id
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{player.name}</span>
                      <span className="text-sm text-gray-500">{player.team}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dettagli Giocatore */}
        <div className="lg:col-span-2">
          {selectedPlayer ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Statistiche {selectedPlayer.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Caratteristiche</h3>
                    {chartData && <Radar data={chartData} />}
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Statistiche</h3>
                    <div className="space-y-2">
                      <p>Gol: {selectedPlayer.stats.goals}</p>
                      <p>Assist: {selectedPlayer.stats.assists}</p>
                      <p>Presenze: {selectedPlayer.stats.appearances}</p>
                      <p>Minuti giocati: {selectedPlayer.stats.minutesPlayed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-gray-500">Seleziona un giocatore per vedere le statistiche</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Players; 