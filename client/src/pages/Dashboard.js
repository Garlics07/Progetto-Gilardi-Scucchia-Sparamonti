import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const chartData = {
    labels: ['Vittorie', 'Pareggi', 'Sconfitte'],
    datasets: [
      {
        data: [12, 5, 3],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Statistiche Squadra</h5>
              <Pie data={chartData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Prossime Partite</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Team A vs Team B - 01/01/2023</li>
                <li className="list-group-item">Team C vs Team D - 02/01/2023</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 