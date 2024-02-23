import React, { useEffect } from 'react';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { slice as alertSlice } from 'redux/slices/alert/alert';
import { useSelector, dispatch } from 'redux/store';
// routes
import Router from './routes';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';

// ----------------------------------------------------------------------

export default function App() {
  const { enqueueSnackbar } = useSnackbar();
  const alerts = useSelector((state) => state.alert.alerts);

  useEffect(() => {
    if (alerts?.length) {
      alerts.forEach((alert) => {
        const shouldPersist = !alert?.timeout && Boolean(alert?.message?.length > 20);
        enqueueSnackbar(`${alert?.message ?? ''}`, {
          variant: alert.type || 'error',
          persist: shouldPersist,
          key: alert.id,
        });
      });

      dispatch(alertSlice.actions.removeAllAlerts());
    }
  }, [alerts]);

  return (
    <>
      <ProgressBarStyle />
      <ScrollToTop />
      <Router />
    </>
  );
}
