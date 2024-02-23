import PropTypes from 'prop-types';
import { paramCase, capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH } from 'routes/paths';
// components
import Image from 'components/Image';

// ----------------------------------------------------------------------

AuthorsCard.propTypes = {
  author: PropTypes.object,
};

export default function AuthorsCard({ author }) {
  const { name, id, image } = author;

  const imageLink = image?.url;

  const linkTo = PATH.authors.view(paramCase(name), id);

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <Image alt={name} src={imageLink || ''} ratio='1/1' />
      </Box>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Link to={linkTo} color='inherit' component={RouterLink}>
          <Typography variant='h4' noWrap>
            {capitalCase(name)}
          </Typography>
        </Link>
      </Stack>
    </Card>
  );
}
