import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const SortableHeader = styled(TableHeaderCell)`
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 2rem;

  &:hover {
    background: var(--racing-hover);
  }

  &::after {
    content: '↕';
    position: absolute;
    right: 0.5rem;
    opacity: 0.5;
  }

  &.asc::after {
    content: '↑';
    opacity: 1;
  }

  &.desc::after {
    content: '↓';
    opacity: 1;
  }
`;

const ClickableTableRow = styled(TableRow)`
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--racing-hover);
    transform: translateX(5px);
  }
`;

const SeasonSelector = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid var(--racing-border);
  background: var(--racing-card-bg);
  color: var(--racing-text);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--racing-gray);
  }

  &:focus {
    outline: none;
    border-color: var(--racing-black);
  }
`;

const Label = styled.label`
  color: var(--racing-text);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

interface Driver {
  _id: string;
  nome: string;
  numero_auto: number;
  punti_totali: number;
  vittorie: number;
  podi: number;
  gare_disputate: number;
  championshipPosition?: number;
}

type SortField = 'position' | 'nome' | 'numero_auto' | 'punti_totali' | 'vittorie' | 'podi' | 'gare_disputate';
type SortDirection = 'asc' | 'desc';

const DriversPage: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('punti_totali');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedSeason, setSelectedSeason] = useState('2025');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/drivers?season=${selectedSeason}`);
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati');
        }
        const data = await response.json();
        const driversWithPosition = data.map((driver: Driver, index: number) => ({
          ...driver,
          championshipPosition: index + 1
        }));
        setDrivers(driversWithPosition);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, [selectedSeason]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedDrivers = () => {
    return [...drivers].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'position') {
        comparison = (a.championshipPosition || 0) - (b.championshipPosition || 0);
      } else {
        const valueA = a[sortField];
        const valueB = b[sortField];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          comparison = valueA.localeCompare(valueB);
        } else {
          comparison = (valueA as number) - (valueB as number);
        }
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const handleRowClick = (driverId: string) => {
    navigate(`/drivers/${driverId}`);
  };

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

  const sortedDrivers = getSortedDrivers();

  return (
    <Container>
      <Title>Classifica Piloti IndyCar</Title>
      <SeasonSelector>
        <Label>Stagione:</Label>
        <Select 
          value={selectedSeason} 
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          <option value="all">Classifica Generale</option>
          {Array.from({ length: 9 }, (_, i) => 2025 - i).map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </Select>
      </SeasonSelector>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader 
                onClick={() => handleSort('position')}
                className={sortField === 'position' ? sortDirection : ''}
              >
                Pos
              </SortableHeader>
              <SortableHeader 
                onClick={() => handleSort('nome')}
                className={sortField === 'nome' ? sortDirection : ''}
              >
                Pilota
              </SortableHeader>
              <SortableHeader 
                onClick={() => handleSort('numero_auto')}
                className={sortField === 'numero_auto' ? sortDirection : ''}
              >
                N°
              </SortableHeader>
              <SortableHeader 
                onClick={() => handleSort('punti_totali')}
                className={sortField === 'punti_totali' ? sortDirection : ''}
              >
                Punti
              </SortableHeader>
              <SortableHeader 
                onClick={() => handleSort('vittorie')}
                className={sortField === 'vittorie' ? sortDirection : ''}
              >
                Vittorie
              </SortableHeader>
              <SortableHeader 
                onClick={() => handleSort('podi')}
                className={sortField === 'podi' ? sortDirection : ''}
              >
                Podi
              </SortableHeader>
              <SortableHeader 
                onClick={() => handleSort('gare_disputate')}
                className={sortField === 'gare_disputate' ? sortDirection : ''}
              >
                Gare
              </SortableHeader>
            </TableRow>
          </TableHeader>
          <tbody>
            {sortedDrivers.map((driver) => (
              <ClickableTableRow 
                key={driver._id} 
                onClick={() => handleRowClick(driver._id)}
              >
                <PositionCell>{driver.championshipPosition}</PositionCell>
                <TableCell>{driver.nome}</TableCell>
                <TableCell>{driver.numero_auto}</TableCell>
                <PointsCell>{driver.punti_totali}</PointsCell>
                <WinsCell>{driver.vittorie}</WinsCell>
                <PodiumsCell>{driver.podi}</PodiumsCell>
                <TableCell>{driver.gare_disputate}</TableCell>
              </ClickableTableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DriversPage; 