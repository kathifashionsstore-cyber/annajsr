import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiHome, HiUser, HiBriefcase, HiFolder, HiEnvelope } from 'react-icons/hi2';

const MobileBottomNavigation = () => {
  return (
    <nav
      className="mobile-bottom-nav md:hidden"
      aria-label="Primary mobile navigation"
    >
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        <HiHome />
        <span>Home</span>
      </NavLink>

      <NavLink to="/professional-profile" className={({ isActive }) => (isActive ? 'active' : '')}>
        <HiUser />
        <span>Profile</span>
      </NavLink>

      <NavLink to="/experience" className={({ isActive }) => (isActive ? 'active' : '')}>
        <HiBriefcase />
        <span>Experience</span>
      </NavLink>

      <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
        <HiFolder />
        <span>Projects</span>
      </NavLink>

      <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
        <HiEnvelope />
        <span>Contact</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNavigation;
