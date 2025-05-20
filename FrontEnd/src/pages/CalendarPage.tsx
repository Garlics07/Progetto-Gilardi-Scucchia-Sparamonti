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

const CalendarPage: React.FC = () => {
  return (
    <Container>
      <Title>Calendario Gare IndyCar</Title>
      {/* Qui andrà il calendario delle gare */}
      <p>Calendario gare in arrivo...</p>
    </Container>
  );
};

export default CalendarPage; 