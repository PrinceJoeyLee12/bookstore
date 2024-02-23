import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../components/skeleton';
//
import AuthorsCard from './AuthorsCard';

// ----------------------------------------------------------------------

AuthorsList.propTypes = {
  authors: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default function AuthorsList({ authors, loading }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}>
      {(loading ? [...Array(12)] : authors).map((author, index) => (author ? <AuthorsCard key={author?.id} author={author} /> : <SkeletonProductItem key={index} />))}
    </Box>
  );
}
