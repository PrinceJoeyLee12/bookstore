import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
import { useSelector } from 'redux/store';
import { pascalCase } from 'change-case';
import { PATH, PATH_AUTH } from 'routes/paths';
import MyAvatar from 'components/MyAvatar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  const { firstName = 'first-name', lastName = 'last-name', photoURL = '' } = useSelector((state) => state.user.data);

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const displayName = `${firstName} ${lastName}`;
  const name = pascalCase(`${firstName}-${lastName}`);

  const pathToRedirect = isAuthenticated ? PATH.user.edit(name) : PATH_AUTH.loginUnprotected;

  return (
    <Link underline="none" color="inherit" component={RouterLink} to={pathToRedirect}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <MyAvatar />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          {isAuthenticated ? (
            <Typography variant="subtitle2" noWrap>
              {displayName}
            </Typography>
          ) : (
            <Typography variant="body2" noWrap sx={{ color: 'green' }}>
              <b>Signin / Signup</b>
            </Typography>
          )}
        </Box>
      </RootStyle>
    </Link>
  );
}
