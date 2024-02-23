import { useState } from 'react';
// @mui
import { Box, Card, Container, Typography, CardHeader, ToggleButton, ToggleButtonGroup } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// routes
import { PATH } from '../routes/paths';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function PermissionDenied() {
  const { themeStretch } = useSettings();

  const [role, setRole] = useState('admin');

  const handleChangeRole = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  return (
    <Page title='Permission Denied'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading='Permission Denied'
          links={[
            {
              name: 'Dashboard',
              href: PATH.root,
            },
            { name: 'Permission Denied' },
          ]}
        />

        <ToggleButtonGroup exclusive value={role} onChange={handleChangeRole} color='primary' sx={{ mb: 5 }}>
          <ToggleButton value='admin' aria-label='admin role'>
            isAdmin
          </ToggleButton>

          <ToggleButton value='user' aria-label='user role'>
            isUser
          </ToggleButton>
        </ToggleButtonGroup>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}>
          {[...Array(8)].map((_, index) => (
            <Card key={index}>
              <CardHeader title={`Card ${index + 1}`} subheader='Proin viverra ligula' />

              <Typography sx={{ p: 3, color: 'text.secondary' }}>
                Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Vestibulum fringilla pede sit amet augue.
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>
    </Page>
  );
}
