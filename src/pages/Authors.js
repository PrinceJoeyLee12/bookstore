import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Stack, Button } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'redux/store';
import { getAuthors } from 'redux/slices/author/actions';
import { PATH } from 'routes/paths';
import useSettings from 'hooks/useSettings';
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { AuthorsList, AuthorsSearch } from 'sections/author/index';
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

export default function Authors() {
  const { themeStretch } = useSettings();

  const userSlice = useSelector((state) => state.user);
  const isAuth = userSlice?.isAuthenticated;
  const dispatch = useDispatch();

  const { authors = [] } = useSelector((state) => state.author);

  const defaultValues = {
    name: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const { watch } = methods;

  const values = watch();

  const isFilterTypeByAll = values?.type && values?.type === 'All';

  const isDefault = isFilterTypeByAll;

  useEffect(() => {
    getAuthors();
  }, [dispatch]);

  return (
    <Page title='BookStore: Authors'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Authors'
          links={[
            {
              name: 'Authors',
              href: PATH.authors.root,
            },
            { name: 'List' },
          ]}
          action={
            <>
              {isAuth && (
                <Button variant='contained' component={RouterLink} to={PATH.authors.add} startIcon={<Iconify icon={'eva:plus-fill'} />}>
                  New Author
                </Button>
              )}
            </>
          }
        />

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent='space-between' sx={{ mb: 2 }}>
          <AuthorsSearch />
        </Stack>

        <AuthorsList authors={authors} loading={!authors.length && isDefault} />
      </Container>
    </Page>
  );
}
