import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Tab, Box, Tabs } from '@mui/material';
import { useSelector } from 'redux/store';
import { getAuthor } from 'redux/slices/author/actions';

import LoadingScreen from 'components/LoadingScreen';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { PATH } from '../routes/paths';
// hooks
import useTabs from '../hooks/useTabs';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// sections
import { AccountGeneral } from '../sections/author/account/index';

// ----------------------------------------------------------------------

export default function Author({ isCreate = false }) {
  const params = useParams();
  const { themeStretch } = useSettings();

  const { currentTab, onChangeTab } = useTabs('summary');
  const [loading, setLoading] = useState(true);

  const authorSlice = useSelector((state) => state.author.author);

  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (isMountedRef.current) {
      (async () => getAuthor(params?.authorId))();
      setLoading(false);
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [isMountedRef, params]);

  const TABS = [
    {
      value: 'summary',
      icon: <Iconify icon={'fluent:author-32-regular'} width={20} height={20} />,
      component: <AccountGeneral isCreate={isCreate} author={authorSlice ?? null} />,
    },
  ];

  const breadCrumbsLinks = [{ name: 'Authors', href: PATH.authors.root }, { name: capitalCase(params?.name || '') }];

  return (
    <>
      {loading ? (
        <LoadingScreen isDashboard />
      ) : (
        <Page name='AuthorStore: Author'>
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs heading={capitalCase(authorSlice?.name || '') ?? 'Author'} links={breadCrumbsLinks} />

            <Tabs allowScrollButtonsMobile variant='scrollable' scrollButtons='auto' value={currentTab} onChange={onChangeTab}>
              {TABS.map((tab) => (
                <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
              ))}
            </Tabs>

            <Box sx={{ mb: 5 }} />

            {TABS.map((tab) => {
              const isMatched = tab.value === currentTab;
              return isMatched && <Box key={tab.value}>{tab.component}</Box>;
            })}
          </Container>
        </Page>
      )}
    </>
  );
}
