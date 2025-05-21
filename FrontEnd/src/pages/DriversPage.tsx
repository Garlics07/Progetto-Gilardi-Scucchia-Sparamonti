import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--racing-light-bg), var(--racing-card-bg));
  min-height: 100vh;
`;

const Title = styled.h1`
  color: var(--racing-text);
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const TableContainer = styled.div`
  background: var(--racing-card-bg);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: var(--racing-text);
`;

const TableHeader = styled.thead`
  background: var(--racing-stripe);
  color: var(--racing-text);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: var(--racing-light-bg);
  }
  
  &:hover {
    background: var(--racing-hover);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--racing-border);
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--racing-border);
`;

const PositionCell = styled(TableCell)`
  font-weight: bold;
  color: var(--racing-gray);
  text-align: center;
`;

const PointsCell = styled(TableCell)`
  font-weight: bold;
  color: var(--racing-text);
`;

const WinsCell = styled(TableCell)`
  color: #4CAF50;
  font-weight: bold;
`;

const PodiumsCell = styled(TableCell)`
  color: #2196F3;
  font-weight: bold;
`;

interface Driver {
  _id: string;
  nome: string;
  numero_auto: number;
  punti_totali: number;
  vittorie: number;
  podi: number;
  gare_disputate: number;
}

const DriversPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:3000/drivers');
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati');
        }
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <Container>
        <Title>Piloti IndyCar</Title>
        <p>Caricamento dati in corso...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Piloti IndyCar</Title>
        <p>Errore: {error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Classifica Piloti IndyCar</Title>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Pos</TableHeaderCell>
              <TableHeaderCell>Pilota</TableHeaderCell>
              <TableHeaderCell>N°</TableHeaderCell>
              <TableHeaderCell>Punti</TableHeaderCell>
              <TableHeaderCell>Vittorie</TableHeaderCell>
              <TableHeaderCell>Podi</TableHeaderCell>
              <TableHeaderCell>Gare</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {drivers.map((driver, index) => (
              <TableRow key={driver._id}>
                <PositionCell>{index + 1}</PositionCell>
                <TableCell>{driver.nome}</TableCell>
                <TableCell>{driver.numero_auto}</TableCell>
                <PointsCell>{driver.punti_totali}</PointsCell>
                <WinsCell>{driver.vittorie}</WinsCell>
                <PodiumsCell>{driver.podi}</PodiumsCell>
                <TableCell>{driver.gare_disputate}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DriversPage; 