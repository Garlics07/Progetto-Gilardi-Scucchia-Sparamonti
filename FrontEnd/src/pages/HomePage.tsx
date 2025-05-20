import React from 'react';
import styled from 'styled-components';
import LeaderDriver from '../components/LeaderDriver';
import LeaderTeam from '../components/LeaderTeam';
import NextRace from '../components/NextRace';
import FavoriteDriver from '../components/FavoriteDriver';

const HomeContainer = styled.div`
  display: flex;
  padding: 2rem;
  gap: 2rem;
  min-height: 100vh;
  background-color: #f5f5f5;
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
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <LeftSection>
        <Card>
          <h2>Pilota Leader</h2>
          <LeaderDriver />
        </Card>
        <Card>
          <h2>Team Leader</h2>
          <LeaderTeam />
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