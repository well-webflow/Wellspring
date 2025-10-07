import { NavLink, Outlet } from 'react-router';
import { Tab } from '../../../components/Tabs';
import { faBox, faCirclePlus, faGear, faPencil } from '@fortawesome/free-solid-svg-icons';

export default function WaterfallHomeLayout() {
  const tabs = [
    { label: 'New', icon: faCirclePlus, path: '/waterfall', end: true },
    { label: 'Elements', icon: faBox, path: '/waterfall/create' },
    { label: 'Edit', icon: faPencil, path: '/waterfall/select' },
    { label: 'Setup', icon: faGear, path: '/waterfall/setup' },
  ];

  return (
    <>
      <div className="flex flex-row gap-2 px-3 py-2 border-b border-border1">
        {tabs.map(({ label, icon, path, end }) => (
          <NavLink key={path} to={path} end={end}>
            {({ isActive }) => <Tab label={label} icon={icon} active={isActive} />}
          </NavLink>
        ))}
      </div>
      <div className="p-3">
        <Outlet />
      </div>
    </>
  );
}
