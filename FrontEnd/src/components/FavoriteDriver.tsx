import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FavoriteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding: 1rem;

  &:hover {
    transform: translateY(-5px);
  }
`;

const DriverInfo = styled.div`
  text-align: center;
  width: 100%;
`;

const DriverName = styled.h3`
  margin: 0;
  color: var(--racing-text);
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  padding: 1rem;
  background: var(--racing-light-bg);
  border-radius: 8px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--racing-text);
`;

const StatLabel = styled.span`
  font-size: 0.9rem;
  color: var(--racing-text-light);
  text-transform: uppercase;
`;

interface FavoriteDriverProps {
  name?: string;
  probability?: number;
  wins?: number;
  podiums?: number;
  driverId?: string;
}

const FavoriteDriver: React.FC<FavoriteDriverProps> = ({
  name,
  probability,
  wins,
  podiums,
  driverId
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (driverId) {
      navigate(`/drivers/${driverId}`);
    }
  };

  return (
    <FavoriteContainer onClick={handleClick}>
      <DriverInfo>
        <DriverName>{name || 'Nome Pilota'}</DriverName>
        <WinProbability>
          {probability ? `${probability}% probabilità di vittoria` : 'Probabilità in arrivo...'}
        </WinProbability>
      </DriverInfo>
      <DriverStats>
        <StatItem>
          <StatValue>{wins || 0}</StatValue>
          <StatLabel>Vittorie</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{podiums || 0}</StatValue>
          <StatLabel>Podi</StatLabel>
        </StatItem>
      </DriverStats>
    </FavoriteContainer>
  );
};

export default FavoriteDriver; 