import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  useAuth();

  return <>{children}</>;
}
