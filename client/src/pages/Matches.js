import React, { useState, useEffect } from 'react';
import { matchService } from '../services/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'upcoming'

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const [allMatches, upcoming] = await Promise.all([
          matchService.getAll(),
          matchService.getUpcoming()
        ]);
        setMatches(allMatches.data);
        setUpcomingMatches(upcoming.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-10">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Partite</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Tutte le Partite
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Prossime Partite
          </button>
        </nav>
      </div>

      {/* Lista Partite */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {(activeTab === 'all' ? matches : upcomingMatches).map((match) => (
            <li key={match._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {match.homeTeam} vs {match.awayTeam}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(match.date)}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {match.status === 'completed' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {match.homeScore} - {match.awayScore}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {match.status}
                      </span>
                    )}
                  </div>
                </div>
                {match.status === 'completed' && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">
                      <p>Possesso palla: {match.stats.possession}%</p>
                      <p>Tiri: {match.stats.shots}</p>
                      <p>Calci d'angolo: {match.stats.corners}</p>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Matches; 