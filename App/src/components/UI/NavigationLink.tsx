import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavigationLinkProps {
  to: string;
  icon?: IconDefinition;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  target?: string;
}

export default function NavigationLink({
  to,
  icon,
  children,
  className = 'text-text2 text-sm flex flex-row items-center gap-1 hover:text-white',
  onClick,
  target,
}: NavigationLinkProps) {
  return (
    <Link to={to} onClick={onClick} className={className} target={target}>
      {icon && <FontAwesomeIcon icon={icon} size="sm" />}
      {children}
    </Link>
  );
}
