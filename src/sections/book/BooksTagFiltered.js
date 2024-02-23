import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`,
}));

const LabelStyle = styled((props) => <Typography component='span' variant='subtitle2' {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRight: `solid 1px ${theme.palette.divider}`,
}));

// ---------------------------------------------------------------------

BooksTagFiltered.propTypes = {
  filters: PropTypes.object,
  isShowReset: PropTypes.bool,
  onRemoveCategory: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function BooksTagFiltered({ filters, isShowReset, onRemoveCategory, onResetAll, isFilterCategoriesByAll }) {
  const { type } = filters;

  const shouldShowTypeFilter = type.length > 0 && !isFilterCategoriesByAll;

  return (
    <RootStyle>
      {shouldShowTypeFilter && (
        <WrapperStyle>
          <LabelStyle>Type:</LabelStyle>
          <Stack direction='row' flexWrap='wrap' sx={{ p: 0.75 }}>
            <Chip label={type} size='small' onDelete={() => onRemoveCategory(type)} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {isShowReset && shouldShowTypeFilter && (
        <Button color='error' size='small' onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
          Clear All
        </Button>
      )}
    </RootStyle>
  );
}
