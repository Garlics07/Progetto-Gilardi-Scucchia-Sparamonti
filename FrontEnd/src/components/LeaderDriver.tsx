import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DriverContainer = styled.div`
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
  font-size: 1.8rem;
  margin: 0;
  color: var(--racing-text);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DriverStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
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

interface LeaderDriverProps {
  name?: string;
  points?: number;
  driverId?: string;
  wins?: number;
  podiums?: number;
}

const LeaderDriver: React.FC<LeaderDriverProps> = ({ 
  name, 
  points, 
  driverId,
  wins,
  podiums 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (driverId) {
      navigate(`/drivers/${driverId}`);
    }
  };

  return (
    <DriverContainer onClick={handleClick}>
      <DriverInfo>
        <DriverName>{name || 'Nome Pilota'}</DriverName>
        <DriverStats>
          <StatItem>
            <StatValue>{points || 0}</StatValue>
            <StatLabel>Punti</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{wins || 0}</StatValue>
            <StatLabel>Vittorie</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{podiums || 0}</StatValue>
            <StatLabel>Podi</StatLabel>
          </StatItem>
        </DriverStats>
      </DriverInfo>
    </DriverContainer>
  );
};

export default LeaderDriver; 