import React, { useEffect, useState, useMemo } from 'react';
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

const RaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const RaceCard = styled.div<{ $status: string }>`
  background: var(--racing-card-bg);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'Closed':
        return '#4CAF50';
      case 'Open':
        return '#2196F3';
      case 'Scheduled':
        return '#FFC107';
      default:
        return 'var(--racing-border)';
    }
  }};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const RaceHeader = styled.div`
  margin-bottom: 1rem;
`;

const RaceName = styled.h2`
  color: var(--racing-text);
  margin: 0;
  font-size: 1.3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const RaceDate = styled.div`
  color: var(--racing-text-light);
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const RaceVenue = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: var(--racing-light-bg);
  border-radius: 5px;
`;

const VenueName = styled.h3`
  color: var(--racing-text);
  margin: 0;
  font-size: 1.1rem;
`;

const VenueLocation = styled.p`
  color: var(--racing-text-light);
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 0.5rem;
  background-color: ${props => {
    switch (props.$status) {
      case 'Finished':
        return '#D32F2F'; // Rosso per gare finite
      case 'Closed':
        return '#757575'; // Grigio per gare cancellate
      case 'Scheduled':
        return '#2E7D32'; // Verde per gare da fare
      case 'Open':
        return '#2196F3'; // Blu per gare in corso
      default:
        return '#9E9E9E';
    }
  }};
  color: white;
`;

const FilterBar = styled.div`
  background: linear-gradient(145deg, var(--racing-card-bg), var(--racing-light-bg));
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1.2rem;
  align-items: flex-end;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--racing-gray);
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--racing-text-light);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 160px;
  flex-shrink: 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--racing-gray), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const FilterLabel = styled.label`
  color: var(--racing-text);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &::before {
    content: '•';
    color: var(--racing-gray);
    font-size: 1.2rem;
  }
`;

const FilterSelect = styled.select`
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  color: var(--racing-text);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;

  &:hover {
    border-color: var(--racing-gray);
    background-color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    border-color: var(--racing-gray);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  option {
    background: white;
    color: var(--racing-text);
    padding: 0.5rem;
  }
`;

const FilterInput = styled.input`
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  color: var(--racing-text);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  width: 100%;

  &::placeholder {
    color: var(--racing-text-light);
    opacity: 0.7;
  }

  &:hover {
    border-color: var(--racing-gray);
    background-color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    border-color: var(--racing-gray);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
    background-color: white;
  }
`;

interface Race {
  _id: string;
  race_id: string;
  description: string;
  scheduled: string;
  scheduled_end: string;
  status: string;
  venue: {
    name: string;
    city: string;
    country: string;
    length: number;
    curves_left: number;
    curves_right: number;
  };
  season_year: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'Finished':
      return 'Finita';
    case 'Closed':
    case 'Cancelled':
      return 'Cancellata';
    case 'Scheduled':
      return 'Da Fare';
    case 'Open':
      return 'In Corso';
    default:
      return status;
  }
};

const CalendarPage: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('tutti');
  const [selectedMonth, setSelectedMonth] = useState<string>('tutti');
  const [selectedStatus, setSelectedStatus] = useState<string>('tutti');
  const [venueFilter, setVenueFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');

  // Estrai gli anni unici dalle gare
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(races.map(race => race.season_year)));
    return uniqueYears.sort((a, b) => b.localeCompare(a));
  }, [races]);

  // Estrai le città uniche dalle gare
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(races.map(race => race.venue.city)));
    return uniqueCities.sort();
  }, [races]);

  // Array dei mesi in italiano
  const months = [
    { value: 'tutti', label: 'Tutti i mesi' },
    { value: '1', label: 'Gennaio' },
    { value: '2', label: 'Febbraio' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Aprile' },
    { value: '5', label: 'Maggio' },
    { value: '6', label: 'Giugno' },
    { value: '7', label: 'Luglio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Settembre' },
    { value: '10', label: 'Ottobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Dicembre' }
  ];

  // Array degli stati possibili
  const statuses = [
    { value: 'tutti', label: 'Tutti gli stati' },
    { value: 'Open', label: 'In Corso' },
    { value: 'Scheduled', label: 'Da Fare' },
    { value: 'Finished', label: 'Finita' },
    { value: 'Cancelled', label: 'Cancellata' },
  ];

  // Filtra le gare in base ai criteri selezionati
  const filteredRaces = useMemo(() => {
    return races.filter(race => {
      const yearMatch = selectedYear === 'tutti' || race.season_year === selectedYear;
      
      const monthMatch = selectedMonth === 'tutti' || 
        new Date(race.scheduled).getMonth() + 1 === parseInt(selectedMonth);
      
      const statusMatch = selectedStatus === 'tutti' || 
        (selectedStatus === 'Cancelled' ? (race.status === 'Cancelled' || race.status === 'Closed') : race.status === selectedStatus);
      
      const venueMatch = !venueFilter || 
        race.venue.name.toLowerCase().includes(venueFilter.toLowerCase());
      
      const cityMatch = !cityFilter || 
        race.venue.city.toLowerCase().includes(cityFilter.toLowerCase());

      return yearMatch && monthMatch && statusMatch && venueMatch && cityMatch;
    });
  }, [races, selectedYear, selectedMonth, selectedStatus, venueFilter, cityFilter]);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch('http://localhost:3000/calendar');
        if (!response.ok) {
          throw new Error('Errore nel recupero dei dati');
        }
        const data = await response.json();
        setRaces(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  if (loading) {
    return (
      <Container>
        <Title>Calendario Gare IndyCar</Title>
        <p>Caricamento dati in corso...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Calendario Gare IndyCar</Title>
        <p>Errore: {error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Calendario Gare IndyCar</Title>
      
      <FilterBar>
        <FilterGroup>
          <FilterLabel>Anno</FilterLabel>
          <FilterSelect 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="tutti">Tutti gli anni</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Mese</FilterLabel>
          <FilterSelect
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Stato</FilterLabel>
          <FilterSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Tracciato</FilterLabel>
          <FilterInput
            type="text"
            placeholder="Cerca tracciato..."
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Città</FilterLabel>
          <FilterSelect
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">Tutte le città</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </FilterBar>

      <RaceGrid>
        {filteredRaces.map((race) => (
          <RaceCard key={race._id} $status={race.status}>
            <RaceHeader>
              <RaceName>{race.description}</RaceName>
              <RaceDate>
                {formatDate(race.scheduled)} - {formatDate(race.scheduled_end)}
              </RaceDate>
              <StatusBadge $status={race.status}>
                {getStatusText(race.status)}
              </StatusBadge>
            </RaceHeader>
            
            <RaceVenue>
              <VenueName>{race.venue.name}</VenueName>
              <VenueLocation>
                {race.venue.city}, {race.venue.country}
              </VenueLocation>
            </RaceVenue>
          </RaceCard>
        ))}
      </RaceGrid>
    </Container>
  );
};

export default CalendarPage; 