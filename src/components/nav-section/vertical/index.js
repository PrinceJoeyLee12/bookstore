import PropTypes from 'prop-types';
import { useSelector } from 'redux/store';
import { pascalCase } from 'change-case';
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.func,
};

export default function NavSectionVertical({ navConfig, isCollapse = false, ...other }) {
  const { firstName = 'first-name', lastName = 'last-name' } = useSelector((state) => state.user.data);

  const name = pascalCase(`${firstName}-${lastName}`);

  return (
    <Box {...other}>
      {navConfig({ name }).map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          {group.items.map((list) => (
            <NavListRoot key={list.title + list.path} list={list} isCollapse={isCollapse} />
          ))}
        </List>
      ))}
    </Box>
  );
}
