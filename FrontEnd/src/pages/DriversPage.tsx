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

const DriversPage: React.FC = () => {
  return (
    <Container>
      <Title>Piloti IndyCar</Title>
      {/* Qui andrà la lista dei piloti */}
      <p>Lista piloti in arrivo...</p>
    </Container>
  );
};

export default DriversPage; 