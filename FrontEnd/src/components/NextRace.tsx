import React from 'react';
import styled from 'styled-components';

const RaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RaceHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const RaceName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

const RaceDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const DetailItem = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
`;

const DetailLabel = styled.h4`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const DetailValue = styled.p`
  margin: 0.5rem 0 0;
  color: #333;
  font-size: 1.1rem;
`;

interface NextRaceProps {
  name?: string;
  date?: string;
  circuit?: string;
  location?: string;
}

const NextRace: React.FC<NextRaceProps> = ({ name, date, circuit, location }) => {
  return (
    <RaceContainer>
      <RaceHeader>
        <RaceName>{name || 'Nome Gara'}</RaceName>
      </RaceHeader>
      <RaceDetails>
        <DetailItem>
          <DetailLabel>Data</DetailLabel>
          <DetailValue>{date || 'Data in arrivo...'}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Circuito</DetailLabel>
          <DetailValue>{circuit || 'Circuito in arrivo...'}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Località</DetailLabel>
          <DetailValue>{location || 'Località in arrivo...'}</DetailValue>
        </DetailItem>
      </RaceDetails>
    </RaceContainer>
  );
};

export default NextRace; 