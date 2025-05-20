import React from 'react';
import styled from 'styled-components';

const FavoriteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const DriverImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const DriverInfo = styled.div`
  text-align: center;
`;

const DriverName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.3rem;
`;

const WinProbability = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin: 1rem 0;
  font-weight: bold;
`;

const DriverStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 5px;
  text-align: center;
`;

interface FavoriteDriverProps {
  name?: string;
  probability?: number;
  team?: string;
  wins?: number;
  podiums?: number;
}

const FavoriteDriver: React.FC<FavoriteDriverProps> = ({
  name,
  probability,
  team,
  wins,
  podiums
}) => {
  return (
    <FavoriteContainer>
      <DriverImage>
        {/* Qui andrà l'immagine del pilota */}
        <span>Foto Pilota</span>
      </DriverImage>
      <DriverInfo>
        <DriverName>{name || 'Nome Pilota'}</DriverName>
        <p>{team || 'Team in arrivo...'}</p>
        <WinProbability>
          {probability ? `${probability}% probabilità di vittoria` : 'Probabilità in arrivo...'}
        </WinProbability>
      </DriverInfo>
      <DriverStats>
        <StatItem>
          <h4>Vittorie</h4>
          <p>{wins || '0'}</p>
        </StatItem>
        <StatItem>
          <h4>Podio</h4>
          <p>{podiums || '0'}</p>
        </StatItem>
      </DriverStats>
    </FavoriteContainer>
  );
};

export default FavoriteDriver; 