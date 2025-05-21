import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: linear-gradient(90deg, var(--racing-light-bg), var(--racing-card-bg));
  padding: 1rem 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-bottom: 2px solid var(--racing-border);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--racing-stripe);
    background-size: 20px 20px;
    animation: racing-stripe 0.5s linear infinite;
  }
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled(Link)`
  color: var(--racing-black);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 1rem;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--racing-stripe);
    background-size: 10px 10px;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    color: var(--racing-gray);
    transform: scale(1.05);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  position: relative;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? 'var(--racing-gray)' : 'var(--racing-text)'};
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--racing-stripe);
    background-size: 10px 10px;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: var(--racing-hover);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &::before {
      transform: scaleX(1);
    }
  }

  ${props => props.$isActive && `
    &::before {
      transform: scaleX(1);
    }
  `}
`;

// Aggiungi l'animazione racing-stripe
const keyframes = `
  @keyframes racing-stripe {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 20px 0;
    }
  }
`;

const StyleSheet = styled.style`
  ${keyframes}
`;

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <StyleSheet />
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
    </>
  );
};

export default Navbar; 