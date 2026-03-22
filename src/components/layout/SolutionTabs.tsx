import { NavLink } from 'react-router-dom';
import { SOLUTIONS } from '@/config/problem';
import './SolutionTabs.css';

function SolutionTabs() {
  return (
    <nav className="solution-tabs">
      {SOLUTIONS.map((item) => (
        <NavLink
          key={item.key}
          to={item.route}
          className={({ isActive }) => (isActive ? 'solution-tab active' : 'solution-tab')}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default SolutionTabs;
