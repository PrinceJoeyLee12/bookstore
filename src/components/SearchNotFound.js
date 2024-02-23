import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
  message: PropTypes.string,
  shouldShowNotFound: PropTypes.bool,
  headerMessage: PropTypes.string,
};

export default function SearchNotFound({
  searchQuery = '',
  message = '',
  shouldShowNotFound = true,
  headerMessage,
  ...other
}) {
  return (
    <Paper {...other}>
      {shouldShowNotFound && (
        <Typography gutterBottom align="center" variant="subtitle1">
          {headerMessage || 'Not found'}
        </Typography>
      )}
      <Typography variant="body2" align="center">
        {message || (
          <>
            No results found for &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or using complete words.
          </>
        )}
      </Typography>
    </Paper>
  );
}
