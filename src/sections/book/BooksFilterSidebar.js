import PropTypes from 'prop-types';
// @mui
import { Box, Stack, Button, Drawer, Divider, IconButton, Typography } from '@mui/material';
import { formatCategories } from 'utils/books/index';
import { useSelector } from 'redux/store';
import { NAVBAR } from '../../config';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { RHFSelect } from '../../components/hook-form';
import { capitalCase } from 'change-case';

BooksFilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  handleOnClickCategory: PropTypes.func,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default function BooksFilterSidebar({ isOpen, onResetAll, onOpen, onClose }) {
  const types = useSelector((state) => state.book.types);
  const categories = formatCategories([{ name: 'All' }, ...types]);

  return (
    <>
      <Button disableRipple color='inherit' endIcon={<Iconify icon={'ic:round-filter-list'} />} onClick={onOpen}>
        Filters
      </Button>

      <Drawer
        anchor='right'
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ px: 1, py: 2 }}>
          <Typography variant='subtitle1' sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <RHFSelect name='type' label='Type' placeholder='Type' options={categories} sx={{ width: 1 }}>
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {capitalCase(option.label)}
                  </option>
                ))}
              </RHFSelect>
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button fullWidth size='large' type='submit' color='inherit' variant='outlined' onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
