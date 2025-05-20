import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: linear-gradient(90deg, var(--racing-black), var(--racing-gray));
  padding: 1rem 2rem;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
  border-bottom: 2px solid var(--racing-accent);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: var(--racing-red);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;

  &:hover {
    color: var(--racing-accent);
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? 'var(--racing-accent)' : '#fff'};
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">IndyCar Stats</Logo>
        <NavLinks>
          <NavLink to="/" $isActive={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/drivers" $isActive={location.pathname === '/drivers'}>
            Piloti
          </NavLink>
          <NavLink to="/calendar" $isActive={location.pathname === '/calendar'}>
            Calendario
          </NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 