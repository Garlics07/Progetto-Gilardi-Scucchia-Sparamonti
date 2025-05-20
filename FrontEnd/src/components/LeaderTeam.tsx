import React from 'react';
import styled from 'styled-components';

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TeamLogo = styled.div`
  width: 80px;
  height: 80px;
  background-color: #e0e0e0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TeamInfo = styled.div`
  flex: 1;
`;

const TeamName = styled.h3`
  margin: 0;
  color: #333;
`;

const TeamStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 5px;
  text-align: center;
`;

interface LeaderTeamProps {
  name?: string;
  points?: number;
  wins?: number;
  podiums?: number;
}

const LeaderTeam: React.FC<LeaderTeamProps> = ({ name, points, wins, podiums }) => {
  return (
    <TeamContainer>
      <TeamHeader>
        <TeamLogo>
          {/* Qui andrà il logo del team */}
          <span>Logo</span>
        </TeamLogo>
        <TeamInfo>
          <TeamName>{name || 'Nome Team'}</TeamName>
          <p>{points ? `${points} punti` : 'Punti in arrivo...'}</p>
        </TeamInfo>
      </TeamHeader>
      <TeamStats>
        <StatItem>
          <h4>Vittorie</h4>
          <p>{wins || '0'}</p>
        </StatItem>
        <StatItem>
          <h4>Podio</h4>
          <p>{podiums || '0'}</p>
        </StatItem>
      </TeamStats>
    </TeamContainer>
  );
};

export default LeaderTeam; 