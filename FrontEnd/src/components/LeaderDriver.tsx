import React from 'react';
import styled from 'styled-components';

const DriverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const DriverImage = styled.div`
  width: 150px;
  height: 150px;
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
  font-size: 1.5rem;
  margin: 0;
  color: #333;
`;

const DriverPoints = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0.5rem 0;
`;

interface LeaderDriverProps {
  name?: string;
  points?: number;
}

const LeaderDriver: React.FC<LeaderDriverProps> = ({ name, points}) => {
  return (
    <DriverContainer>
      <DriverImage>
        {/* Qui andrà l'immagine del pilota */}
        <span>Foto Pilota</span>
      </DriverImage>
      <DriverInfo>
        <DriverName>{name || 'Nome Pilota'}</DriverName>
        <DriverPoints>{points ? `${points} punti` : 'Punti in arrivo...'}</DriverPoints>
      </DriverInfo>
    </DriverContainer>
  );
};

export default LeaderDriver; 