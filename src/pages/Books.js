import { useEffect, useState, useCallback } from 'react';
import { sentenceCase } from 'change-case';
import { useForm } from 'react-hook-form';
import { Container, Typography, Stack, Button } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'redux/store';
import { filterBooks } from 'redux/slices/book/book';
import { getBooks } from 'redux/slices/book/actions';
import { PATH } from 'routes/paths';
import useSettings from 'hooks/useSettings';
import { FormProvider } from 'components/hook-form';
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { BooksTagFiltered, BooksList, BooksFilterSidebar, BooksSearch } from 'sections/book/index';
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

export default function Books() {
  const { themeStretch } = useSettings();

  const userSlice = useSelector((state) => state.user);
  const isAuth = userSlice?.isAuthenticated;
  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const { books, sortBy, filters } = useSelector((state) => state.book);

  const filteredBooks = applyFilter(books, sortBy, filters);

  const defaultValues = {
    type: filters.type || 'All',
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();
  const watchType = watch('type');

  const isFilterTypeByAll = values?.type && values?.type === 'All';

  const isDefault = isFilterTypeByAll;

  useEffect(() => {
    getBooks();
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterBooks(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = useCallback(async () => {
    setValue('type', watchType);

    const hasAll = watchType.includes('All');

    if (hasAll) {
      getBooks();
    }
    setOpenFilter(false);
  }, [watchType, dispatch]);

  const handleResetFilter = () => {
    reset();
  };

  const handleRemoveCategory = (value) => {
    // handle special logic for more than 1 filter
    reset();
  };

  return (
    <Page title='BookStore: Books'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Books'
          links={[
            {
              name: 'Books',
              href: PATH.books.root,
            },
            { name: 'List' },
          ]}
          action={
            <>
              {isAuth && (
                <Button variant='contained' component={RouterLink} to={PATH.books.add} startIcon={<Iconify icon={'eva:plus-fill'} />}>
                  New Book
                </Button>
              )}
            </>
          }
        />

        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent='space-between' sx={{ mb: 2 }}>
          <BooksSearch />

          <Stack direction='row' spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <FormProvider methods={methods}>
              <BooksFilterSidebar onResetAll={handleResetFilter} isOpen={openFilter} onOpen={handleOpenFilter} onClose={handleCloseFilter} isFilterTypeByAll={isFilterTypeByAll} />
            </FormProvider>
          </Stack>
        </Stack>

        <Stack sx={{ mb: 3 }}>
          {!isDefault && (
            <>
              <Typography variant='body2' gutterBottom>
                <strong>{filteredBooks.length}</strong>
                &nbsp;Books found
              </Typography>

              <BooksTagFiltered filters={filters} isShowReset={!isDefault && !openFilter} onRemoveCategory={handleRemoveCategory} onResetAll={handleResetFilter} />
            </>
          )}
        </Stack>

        <BooksList books={filteredBooks} loading={!books.length && isDefault} />
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applyFilter(books, sortBy, filters) {
  // FILTER Books
  if (!filters.type.includes('All')) {
    books = books.filter((book) => filters.type.includes(sentenceCase(book.type)));
  }
  return books;
}
