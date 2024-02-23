import createAvatar from 'utils/createAvatar';
import { useSelector } from 'redux/store';
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { firstName = 'first-name', lastName = 'last-name', photoURL = '' } = useSelector((state) => state.user.data);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const displayName = `${firstName} ${lastName}`;
  return (
    <Avatar src={photoURL} alt={displayName} color={photoURL ? 'default' : createAvatar(displayName).color} {...other}>
      {isAuthenticated ? createAvatar(displayName).name : '?'}
    </Avatar>
  );
}
