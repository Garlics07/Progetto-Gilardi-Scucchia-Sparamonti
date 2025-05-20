import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const TeamsPage: React.FC = () => {
  return (
    <Container>
      <Title>Team IndyCar</Title>
      {/* Qui andrà la lista dei team */}
      <p>Lista team in arrivo...</p>
    </Container>
  );
};

export default TeamsPage; 