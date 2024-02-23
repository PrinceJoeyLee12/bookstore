import { useState, useCallback, useEffect } from 'react';
import { paramCase, capitalCase } from 'change-case';
import { useSelector, dispatch } from 'redux/store';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate } from 'react-router-dom';
import { useDebounceSearch } from 'hooks/useDebounceSearch';
import { searchAuthors, getAuthors } from 'redux/slices/author/actions';
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

export default function AuthorsSearch() {
  const navigate = useNavigate();

  const { authors } = useSelector((state) => state.author);

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState(authors);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [searchMessage, setSearchMessage] = useState('');
  const [headerMessage, setHeaderMessage] = useState('');
  const [searchResultsStorage, setSearchResultsStorage] = useState([]);

  const { debounceSearch, clearTimeoutFunc } = useDebounceSearch();

  useEffect(() => {
    setSearchResultsStorage(searchResults || []);
  }, [searchResults]);

  useEffect(() => {
    setSearchResults(authors || []);
  }, [authors]);

  const searchAuthorsFunc = useCallback(async (value) => {
    setSearchQuery(value);
    try {
      const filter = {
        title: { contains: value?.toLowerCase() },
      };
      await dispatch(searchAuthors(filter));
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
          debounceSearch(searchAuthorsFunc, value)();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (name, id) => {
    navigate(PATH.authors.view(paramCase(name), paramCase(id)));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (event.target.value) {
        searchAuthorsFunc(event.target.value);
      }
    }
  };

  const handleOnBlur = useCallback(async () => {
    await getAuthors();
  }, [searchValue]);

  return (
    <Autocomplete
      size='small'
      autoHighlight
      popupIcon={null}
      PopperComponent={PopperStyle}
      options={searchResultsStorage}
      onInputChange={(event, value) => handleChangeSearch(value)}
      getOptionLabel={(author) => author?.name}
      onBlur={handleOnBlur}
      noOptionsText={<SearchNotFound searchQuery={searchQuery} message={searchMessage} headerMessage={headerMessage} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <InputStyle
          {...params}
          stretchStart={200}
          placeholder='Search authors...'
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
      renderOption={(props, author, { inputValue }) => {
        const { name, image, id } = author;
        const matches = match(name, inputValue);
        const parts = parse(name, matches);

        return (
          <span key={id}>
            <li {...props}>
              <Image alt={image?.title} src={image?.url} sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }} />
              <Link underline='none' onClick={() => handleClick(name, id)}>
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
