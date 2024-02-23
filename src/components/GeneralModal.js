import PropTypes from 'prop-types';
import { useEffect } from 'react';
import {
  Dialog,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Stack,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

GeneralModal.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonOneText: PropTypes.string,
  buttonTwoText: PropTypes.string,
  buttonOneClick: PropTypes.func,
  buttonTwoClick: PropTypes.func,
  loading: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.node,
  shouldEnableButtonOne: PropTypes.bool,
  shouldEnableButtonTwo: PropTypes.bool,
};

export default function GeneralModal({
  id,
  title,
  open,
  message,
  buttonOneText = null,
  buttonTwoText = null,
  buttonOneClick = null,
  buttonTwoClick = null,
  shouldEnableButtonOne = true,
  shouldEnableButtonTwo = true,
  loading = false,
  content,
  children,
}) {
  const shouldDisplayDialogAction = (buttonOneClick && buttonOneText) || (buttonTwoText && buttonTwoClick);
  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {content ?? <DialogContentText id={`${id}-dialog-description`}>{message}</DialogContentText>}
      </DialogContent>

      {children}

      <Divider />

      {shouldDisplayDialogAction && (
        <DialogActions>
          {buttonOneClick && buttonOneText && (
            <LoadingButton
              variant="contained"
              loading={loading}
              onClick={buttonOneClick}
              disabled={!shouldEnableButtonOne}
            >
              {buttonOneText}
            </LoadingButton>
          )}
          {buttonTwoText && buttonTwoClick && (
            <LoadingButton
              variant="outlined"
              loading={loading}
              onClick={buttonTwoClick}
              disabled={!shouldEnableButtonTwo}
            >
              {buttonTwoText}
            </LoadingButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

export const RemoveItemWithConfirmWord = ({
  phraseToConfirmRemoval = null,
  setIsRemoveEnabled = false,
  texFieldLabel = '',
}) => {
  const ConfirmSignUpSchema = Yup.object().shape({
    phrase: Yup.string()
      .oneOf([null, phraseToConfirmRemoval], 'Should equal to the text phrase')
      .required('This field is required'),
  });

  const formik = useFormik({
    initialValues: {
      phrase: '',
    },
    validationSchema: ConfirmSignUpSchema,
  });

  const { errors, touched, handleSubmit, getFieldProps, isValid, values } = formik;

  useEffect(() => {
    setIsRemoveEnabled(isValid);
  }, [isValid]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            type="phrase"
            label={texFieldLabel || `Type "${phraseToConfirmRemoval}" to remove`}
            autoFocus
            value={values.phrase}
            {...getFieldProps('phrase')}
            error={touched.phrase && Boolean(errors.phrase)}
            helperText={touched.phrase && errors.phrase}
          />
        </Stack>
      </Form>
    </FormikProvider>
  );
};
