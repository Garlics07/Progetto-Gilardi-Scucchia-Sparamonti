import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LeaderDriver from '../components/LeaderDriver';
import NextRace from '../components/NextRace';
import FavoriteDriver from '../components/FavoriteDriver';

const HomeContainer = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--racing-light-bg), var(--racing-card-bg));
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: var(--racing-card-bg);
  border: 1px solid var(--racing-border);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  color: var(--racing-text);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: var(--racing-gray);
  }

  h2 {
    color: var(--racing-black);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const TopDriversList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--racing-light-bg);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--racing-gray);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--racing-black);
  }
`;

const DriverItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  border-bottom: 1px solid var(--racing-border);
  color: var(--racing-text);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--racing-light-bg);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const DriverRank = styled.span<{ $position: number }>`
  font-weight: bold;
  min-width: 2rem;
  color: ${props => {
    switch (props.$position) {
      case 1:
        return '#FFD700'; // Oro
      case 2:
        return '#C0C0C0'; // Argento
      case 3:
        return '#CD7F32'; // Bronzo
      default:
        return 'var(--racing-gray)';
    }
  }};
`;

const DriverName = styled.span`
  flex: 1;
  color: var(--racing-text);
`;

const DriverWins = styled.span`
  color: var(--racing-text-light);
  font-weight: bold;
  display: flex;
  gap: 1rem;
`;

const DriverPoints = styled.span`
  color: var(--racing-text);
  font-weight: bold;
`;

interface HomeData {
  leader: {
    _id: string;
    nome: string;
    punti_totali: number;
    vittorie: number;
    podi: number;
  };
  topDrivers: Array<{
    _id: string;
    nome: string;
    punti_totali: number;
    vittorie: number;
    podi: number;
  }>;
  favoriteDriver: {
    _id: string;
    nome: string;
    vittorie_totali: number;
    podi_totali: number;
    victory_probability: number;
  };
  nextRace: {
    description: string;
    scheduled: string;
    venue: {
      name: string;
      city: string;
      country: string;
    };
  };
}

const HomePage: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch('http://localhost:3000/drivers/homepage/2025');
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati');
        }
        const data = await response.json();
        setHomeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <HomeContainer>
        <p>Caricamento dati in corso...</p>
      </HomeContainer>
    );
  }

  if (error || !homeData) {
    return (
      <HomeContainer>
        <p>Errore: {error || 'Nessun dato disponibile'}</p>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <LeftSection>
        <Card>
          <h2>Pilota Leader 2025</h2>
          <LeaderDriver 
            name={homeData.leader.nome}
            points={homeData.leader.punti_totali}
            driverId={homeData.leader._id}
            wins={homeData.leader.vittorie}
            podiums={homeData.leader.podi}
          />
        </Card>
        <Card>
          <h2>Top Piloti 2025</h2>
          <TopDriversList>
            {homeData.topDrivers.map((driver, index) => (
              <DriverItem key={driver._id}>
                <DriverRank $position={index + 1}>#{index + 1}</DriverRank>
                <DriverName>{driver.nome}</DriverName>
                <DriverWins>
                  <DriverPoints>{driver.punti_totali} punti</DriverPoints>
                  {driver.vittorie} vittorie
                </DriverWins>
              </DriverItem>
            ))}
          </TopDriversList>
        </Card>
      </LeftSection>
      <RightSection>
        <Card>
          <h2>Prossima Gara</h2>
          <NextRace 
            name={homeData.nextRace.description}
            date={new Date(homeData.nextRace.scheduled).toLocaleDateString('it-IT', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            circuit={homeData.nextRace.venue.name}
            location={`${homeData.nextRace.venue.city}, ${homeData.nextRace.venue.country}`}
          />
        </Card>
        <Card>
          <h2>Favorito alla Vittoria</h2>
          <FavoriteDriver 
            name={homeData.favoriteDriver.nome}
            probability={Math.round(homeData.favoriteDriver.victory_probability)}
            wins={homeData.favoriteDriver.vittorie_totali}
            podiums={homeData.favoriteDriver.podi_totali}
            driverId={homeData.favoriteDriver._id}
          />
        </Card>
      </RightSection>
    </HomeContainer>
  );
};

export default HomePage; 