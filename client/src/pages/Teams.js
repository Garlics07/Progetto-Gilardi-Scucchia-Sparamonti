import React, { useState, useEffect } from 'react';
import { teamService } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await teamService.getAll();
        setTeams(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamClick = async (team) => {
    try {
      const stats = await teamService.getStats(team._id);
      setSelectedTeam({ ...team, stats: stats.data });
    } catch (error) {
      console.error('Error fetching team stats:', error);
    }
  };

  const chartData = selectedTeam ? {
    labels: ['Vittorie', 'Pareggi', 'Sconfitte'],
    datasets: [
      {
        label: 'Risultati',
        data: [
          selectedTeam.stats.wins,
          selectedTeam.stats.draws,
          selectedTeam.stats.losses
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
      <h1 className="text-3xl font-bold text-gray-900">Squadre</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Squadre */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Lista Squadre</h2>
              <div className="space-y-2">
                {teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() => handleTeamClick(team)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      selectedTeam?._id === team._id
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dettagli Squadra */}
        <div className="lg:col-span-2">
          {selectedTeam ? (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Statistiche {selectedTeam.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Risultati</h3>
                    {chartData && <Bar data={chartData} />}
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Dettagli</h3>
                    <div className="space-y-2">
                      <p>Gol fatti: {selectedTeam.stats.goalsScored}</p>
                      <p>Gol subiti: {selectedTeam.stats.goalsConceded}</p>
                      <p>Punti: {selectedTeam.stats.points}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-gray-500">Seleziona una squadra per vedere le statistiche</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams; 