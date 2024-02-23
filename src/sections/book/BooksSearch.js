import { useState, useCallback, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useSelector, dispatch } from 'redux/store';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate } from 'react-router-dom';
import { useDebounceSearch } from 'hooks/useDebounceSearch';
import { searchBooks, getBooks } from 'redux/slices/book/actions';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Typography, Autocomplete, InputAdornment, Popper } from '@mui/material';
// routes
import { PATH } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import InputStyle from '../../components/InputStyle';
import SearchNotFound from '../../components/SearchNotFound';

// ----------------------------------------------------------------------

const PopperStyle = styled((props) => <Popper placement='bottom-start' {...props} />)({
  width: '280px !important',
});

// ----------------------------------------------------------------------

export default function BooksSearch() {
  const navigate = useNavigate();

  const { books } = useSelector((state) => state.book);

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState(books);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [searchMessage, setSearchMessage] = useState('');
  const [headerMessage, setHeaderMessage] = useState('');
  const [searchResultsStorage, setSearchResultsStorage] = useState([]);

  const { debounceSearch, clearTimeoutFunc } = useDebounceSearch();

  useEffect(() => {
    setSearchResultsStorage(searchResults);
  }, [searchResults]);

  useEffect(() => {
    setSearchResults(books);
  }, [books]);

  const searchBooksFunc = useCallback(async (value) => {
    setSearchQuery(value);
    try {
      const filter = {
        title: { contains: value?.toLowerCase() },
      };
      await dispatch(searchBooks(filter));
      setIsLoading(false);
      setSearchMessage('');
      setHeaderMessage('');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setSearchMessage('Should be greater than 3 character');
      setHeaderMessage('Search Error');
    }
  }, []);

  const handleChangeSearch = async (value) => {
    setSearchValue(value);
    try {
      if (value) {
        if (!value || value?.length < 3) {
          setHeaderMessage('Criteria');
          setSearchMessage('Should be greater than 2 character');
        } else {
          setHeaderMessage('Searching...');
          setSearchMessage('Please be patient...');
          setIsLoading(true);
          clearTimeoutFunc();
          debounceSearch(searchBooksFunc, value)();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (title, id) => {
    navigate(PATH.books.view(paramCase(title), id));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (event.target.value) {
        searchBooksFunc(event.target.value);
      }
    }
  };

  const handleOnBlur = useCallback(async () => {
    await getBooks();
  }, [searchValue]);

  return (
    <Autocomplete
      size='small'
      autoHighlight
      popupIcon={null}
      PopperComponent={PopperStyle}
      options={searchResultsStorage}
      onInputChange={(event, value) => handleChangeSearch(value)}
      getOptionLabel={(book) => book.title}
      onBlur={handleOnBlur}
      noOptionsText={<SearchNotFound searchQuery={searchQuery} message={searchMessage} headerMessage={headerMessage} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <InputStyle
          {...params}
          stretchStart={200}
          placeholder='Search books...'
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start'>
                <Iconify icon={'eva:search-fill'} sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, book, { inputValue }) => {
        const { title, image, id } = book;
        const matches = match(title, inputValue);
        const parts = parse(title, matches);

        return (
          <span key={id}>
            <li {...props}>
              <Image alt={image?.title} src={image?.url} sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }} />
              <Link underline='none' onClick={() => handleClick(title, id)}>
                {parts.map((part, index) => (
                  <Typography key={index} component='span' variant='subtitle2' color={part.highlight ? 'primary' : 'textPrimary'}>
                    {capitalCase(part.text)}
                  </Typography>
                ))}
              </Link>
            </li>
            {isLoading && (
              <li {...props}>
                <Iconify icon={'line-md:loading-loop'} color='#1877F2' width={20} height={20} />,
              </li>
            )}
          </span>
        );
      }}
    />
  );
}
