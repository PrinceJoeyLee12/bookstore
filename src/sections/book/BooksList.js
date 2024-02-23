import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../components/skeleton';
//
import BooksCard from './BooksCard';

// ----------------------------------------------------------------------

BooksList.propTypes = {
  books: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default function BooksList({ books, loading }) {
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
      {(loading ? [...Array(12)] : books).map((book, index) => (book ? <BooksCard key={book?.id} book={book} /> : <SkeletonProductItem key={index} />))}
    </Box>
  );
}
