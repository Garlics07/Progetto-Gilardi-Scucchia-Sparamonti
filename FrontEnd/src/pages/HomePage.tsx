import React from 'react';
import styled from 'styled-components';
import LeaderDriver from '../components/LeaderDriver';
import NextRace from '../components/NextRace';
import FavoriteDriver from '../components/FavoriteDriver';

const HomeContainer = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--racing-black), var(--racing-gray));
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
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--racing-accent);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
  color: white;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
  }

  h2 {
    color: var(--racing-red);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const TopDriversList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DriverItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--racing-accent);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DriverRank = styled.span`
  font-weight: bold;
  color: var(--racing-red);
  min-width: 2rem;
`;

const DriverName = styled.span`
  flex: 1;
`;

const DriverWins = styled.span`
  color: var(--racing-accent);
  font-weight: bold;
`;

const HomePage: React.FC = () => {
  // Placeholder per i dati dei piloti
  const topDrivers = [
    { rank: 1, name: "Pilota 1", wins: 0 },
    { rank: 2, name: "Pilota 2", wins: 0 },
    { rank: 3, name: "Pilota 3", wins: 0 },
    { rank: 4, name: "Pilota 4", wins: 0 },
    { rank: 5, name: "Pilota 5", wins: 0 },
  ];

  return (
    <HomeContainer>
      <LeftSection>
        <Card>
          <h2>Pilota Leader</h2>
          <LeaderDriver />
        </Card>
        <Card>
          <h2>Top Piloti</h2>
          <TopDriversList>
            {topDrivers.map((driver) => (
              <DriverItem key={driver.rank}>
                <DriverRank>#{driver.rank}</DriverRank>
                <DriverName>{driver.name}</DriverName>
                <DriverWins>{driver.wins} vittorie</DriverWins>
              </DriverItem>
            ))}
          </TopDriversList>
        </Card>
      </LeftSection>
      <RightSection>
        <Card>
          <h2>Prossima Gara</h2>
          <NextRace />
        </Card>
        <Card>
          <h2>Favorito alla Vittoria</h2>
          <FavoriteDriver />
        </Card>
      </RightSection>
    </HomeContainer>
  );
};

export default HomePage; 