import PropTypes from 'prop-types';
import { paramCase, capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH } from 'routes/paths';
// components
import Label from 'components/Label';
import Image from 'components/Image';

// ----------------------------------------------------------------------

BooksCard.propTypes = {
  book: PropTypes.object,
};

export default function BooksCard({ book, clickable = true }) {
  const { type, title, id, image, author } = book;

  const { name, id: authorId } = author;

  const imageLink = image?.url;

  const linkToBook = PATH.books.view(paramCase(title), id);

  const linkToAuthor = PATH.authors.view(paramCase(name), authorId);

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        {type && (
          <Label
            variant='filled'
            color={(type === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}>
            {type}
          </Label>
        )}

        <Image alt={title} src={imageLink || ''} ratio='1/1' />
      </Box>

      <Stack spacing={1} sx={{ p: 3 }}>
        {clickable ? (
          <Link to={linkToBook} color='inherit' component={RouterLink}>
            <Typography variant='h4' noWrap>
              {capitalCase(title)}
            </Typography>
          </Link>
        ) : (
          <Typography variant='h4' noWrap>
            {capitalCase(title)}
          </Typography>
        )}

        <Link to={linkToAuthor} color='inherit' component={RouterLink}>
          <Typography variant='subtitle2' color='red' noWrap>
            by {capitalCase(name)}
          </Typography>
        </Link>
      </Stack>
    </Card>
  );
}
