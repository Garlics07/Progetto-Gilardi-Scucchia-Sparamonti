import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: var(--racing-gray);
  color: var(--racing-accent);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: var(--racing-black);
    transform: translateX(-5px);
  }
`;

const DriverInfo = styled.div`
  background: var(--racing-card-bg);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const InfoItem = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  color: var(--racing-text-light);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
  color: var(--racing-text);
  font-size: 1.5rem;
  font-weight: bold;
`;

const RaceHistory = styled.div`
  background: var(--racing-card-bg);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const RaceTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: var(--racing-text);
  background: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background: #457b9d;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SortableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background: #457b9d;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 2rem;
  transition: background-color 0.2s;

  &:hover {
    background: #3a6a8c;
  }

  &::after {
    content: '↕';
    position: absolute;
    right: 0.5rem;
    opacity: 0.5;
    color: white;
  }

  &.asc::after {
    content: '↑';
    opacity: 1;
    color: white;
  }

  &.desc::after {
    content: '↓';
    opacity: 1;
    color: white;
  }
`;

const PositionCell = styled(TableCell)<{ $position: number }>`
  font-weight: bold;
  color: ${props => {
    switch (props.$position) {
      case 1:
        return '#FFD700'; // Oro
      case 2:
        return '#C0C0C0'; // Argento
      case 3:
        return '#CD7F32'; // Bronzo
      default:
        return 'var(--racing-text)';
    }
  }};
`;

const NotPresentCell = styled(TableCell)`
  color: var(--racing-text-light);
  font-style: italic;
`;

const DNFCell = styled(TableCell)`
  color: #ff4444;
  font-weight: bold;
`;

const InProgressCell = styled(TableCell)`
  color: #457b9d;
  font-weight: bold;
`;

const EmptyCell = styled(TableCell)`
  color: var(--racing-text-light);
  font-style: italic;
`;

interface DriverDetails {
  _id: string;
  nome: string;
  numero_auto: number;
  punti_totali: number;
  vittorie: number;
  podi: number;
  gare_disputate: number;
}

interface RaceResult {
  race_id: string;
  description: string;
  scheduled: string;
  scheduled_end: string;
  status: string;
  venue: {
    name: string;
    city: string;
    country: string;
  };
  position: number | null;
  points: number;
}

type SortField = 'scheduled' | 'description' | 'venue' | 'position' | 'points' | 'status';
type SortDirection = 'asc' | 'desc';

const DriverDetailsPage: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);
  const [raceHistory, setRaceHistory] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('scheduled');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching driver details for ID:', driverId);
      
      const response = await fetch(`http://localhost:3000/drivers/${driverId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Errore nel recupero dei dati del pilota: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Dati non validi ricevuti dal backend');
      }

      // Verifica che tutti i campi necessari siano presenti
      const requiredFields = ['_id', 'nome', 'numero_auto', 'punti_totali', 'vittorie', 'podi', 'gare_disputate', 'race_history'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        console.error('Campi mancanti:', missingFields);
        throw new Error(`Dati incompleti: campi mancanti: ${missingFields.join(', ')}`);
      }

      // Formatta i dati prima di salvarli nello state
      const formattedData = {
        _id: data._id,
        nome: data.nome,
        numero_auto: data.numero_auto,
        punti_totali: data.punti_totali,
        vittorie: data.vittorie,
        podi: data.podi,
        gare_disputate: data.gare_disputate
      };

      console.log('Formatted driver details:', formattedData);
      setDriverDetails(formattedData);

      // Formatta lo storico gare
      const formattedRaceHistory = Array.isArray(data.race_history) 
        ? data.race_history.map(race => ({
            race_id: race.race_id,
            description: race.description || 'N/A',
            scheduled: race.scheduled,
            scheduled_end: race.scheduled_end,
            status: race.status || 'N/A',
            venue: {
              name: race.venue?.name || 'N/A',
              city: race.venue?.city || 'N/A',
              country: race.venue?.country || 'N/A'
            },
            position: race.position === 'Non presente' ? null : Number(race.position),
            points: race.points || 0
          }))
        : [];

      console.log('Formatted race history:', formattedRaceHistory);
      setRaceHistory(formattedRaceHistory);
    } catch (err) {
      console.error('Errore nel recupero dei dati:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto nel recupero dei dati');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverDetails();
  }, [driverId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedRaceHistory = () => {
    return [...raceHistory].sort((a, b) => {
      if (sortField === 'position') {
        const aIsDNF = a.position === 0;
        const bIsDNF = b.position === 0;
        
        if (aIsDNF && !bIsDNF) return 1;
        if (!aIsDNF && bIsDNF) return -1;
        if (aIsDNF && bIsDNF) return 0;
      }

      let comparison = 0;
      
      switch (sortField) {
        case 'scheduled':
          comparison = new Date(a.scheduled).getTime() - new Date(b.scheduled).getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'venue':
          comparison = a.venue.name.localeCompare(b.venue.name);
          break;
        case 'position':
          comparison = (a.position || 0) - (b.position || 0);
          break;
        case 'points':
          comparison = a.points - b.points;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const isRaceInProgress = (scheduled: string, scheduled_end: string) => {
    const now = new Date();
    const startDate = new Date(scheduled);
    const endDate = new Date(scheduled_end);
    return now >= startDate && now <= endDate;
  };

  const renderPosition = (position: number | null, status: string, scheduled: string, scheduled_end: string) => {
    if (isRaceInProgress(scheduled, scheduled_end)) {
      return <EmptyCell>In corso</EmptyCell>;
    }
    if (position === 0) {
      return <DNFCell>DNF</DNFCell>;
    }
    if (position !== null) {
      return <PositionCell $position={position}>{position}°</PositionCell>;
    }
    return <NotPresentCell>Non presente</NotPresentCell>;
  };

  const renderPoints = (points: number, status: string, scheduled: string, scheduled_end: string) => {
    if (isRaceInProgress(scheduled, scheduled_end)) {
      return <EmptyCell>-</EmptyCell>;
    }
    return <TableCell>{points}</TableCell>;
  };

  const renderStatus = (status: string, scheduled: string, scheduled_end: string) => {
    if (isRaceInProgress(scheduled, scheduled_end)) {
      return <InProgressCell>In corso</InProgressCell>;
    }
    return <TableCell>{status}</TableCell>;
  };

  if (loading) {
    return (
      <Container>
        <Title>Dettagli Pilota</Title>
        <p>Caricamento dati in corso...</p>
      </Container>
    );
  }

  if (error || !driverDetails) {
    return (
      <Container>
        <Title>Dettagli Pilota</Title>
        <p>Errore: {error || 'Pilota non trovato'}</p>
        <BackButton onClick={() => navigate('/drivers')}>Torna alla Classifica</BackButton>
      </Container>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        <BackButton onClick={() => navigate('/drivers')}>
          ← Torna alla Classifica
        </BackButton>
        <Title>{driverDetails?.nome || 'Dettagli Pilota'}</Title>
        <div style={{ width: '120px' }} />
      </HeaderContainer>
      
      {loading ? (
        <div>Caricamento dati in corso...</div>
      ) : error ? (
        <div>
          <p>Errore: {error}</p>
          <BackButton onClick={() => navigate('/drivers')}>Torna alla Classifica</BackButton>
        </div>
      ) : !driverDetails ? (
        <div>
          <p>Nessun dato disponibile per questo pilota</p>
          <BackButton onClick={() => navigate('/drivers')}>Torna alla Classifica</BackButton>
        </div>
      ) : (
        <>
          <DriverInfo>
            <InfoItem>
              <InfoLabel>Numero</InfoLabel>
              <InfoValue>{driverDetails.numero_auto}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Punti Totali</InfoLabel>
              <InfoValue>{driverDetails.punti_totali}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Vittorie</InfoLabel>
              <InfoValue>{driverDetails.vittorie}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Podi</InfoLabel>
              <InfoValue>{driverDetails.podi}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Gare Disputate</InfoLabel>
              <InfoValue>{driverDetails.gare_disputate}</InfoValue>
            </InfoItem>
          </DriverInfo>

          <RaceHistory>
            <h2>Storico Gare</h2>
            {raceHistory.length === 0 ? (
              <p>Nessuna gara disponibile</p>
            ) : (
              <RaceTable>
                <thead>
                  <tr>
                    <SortableHeader 
                      onClick={() => handleSort('scheduled')}
                      className={sortField === 'scheduled' ? sortDirection : ''}
                    >
                      Data
                    </SortableHeader>
                    <SortableHeader 
                      onClick={() => handleSort('description')}
                      className={sortField === 'description' ? sortDirection : ''}
                    >
                      Gara
                    </SortableHeader>
                    <SortableHeader 
                      onClick={() => handleSort('venue')}
                      className={sortField === 'venue' ? sortDirection : ''}
                    >
                      Circuito
                    </SortableHeader>
                    <SortableHeader 
                      onClick={() => handleSort('position')}
                      className={sortField === 'position' ? sortDirection : ''}
                    >
                      Posizione
                    </SortableHeader>
                    <SortableHeader 
                      onClick={() => handleSort('points')}
                      className={sortField === 'points' ? sortDirection : ''}
                    >
                      Punti
                    </SortableHeader>
                    <SortableHeader 
                      onClick={() => handleSort('status')}
                      className={sortField === 'status' ? sortDirection : ''}
                    >
                      Stato
                    </SortableHeader>
                  </tr>
                </thead>
                <tbody>
                  {getSortedRaceHistory().map((race) => (
                    <tr key={race.race_id}>
                      <TableCell>{formatDate(race.scheduled)}</TableCell>
                      <TableCell>{race.description}</TableCell>
                      <TableCell>{`${race.venue.name} (${race.venue.city}, ${race.venue.country})`}</TableCell>
                      {renderPosition(race.position, race.status, race.scheduled, race.scheduled_end)}
                      {renderPoints(race.points, race.status, race.scheduled, race.scheduled_end)}
                      {renderStatus(race.status, race.scheduled, race.scheduled_end)}
                    </tr>
                  ))}
                </tbody>
              </RaceTable>
            )}
          </RaceHistory>
        </>
      )}
    </Container>
  );
};

export default DriverDetailsPage; 