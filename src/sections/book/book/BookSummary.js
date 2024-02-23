import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Card, Stack, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { fData } from 'utils/formatNumber';
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from 'components/hook-form';
import { SkeletoAccontItem } from 'components/skeleton';
import { capitalCase } from 'capital-case';
import BooksCard from '../BooksCard';

const defaultValue = { address: { country: 'Philippines' } };

export default function BookSummary({ book = defaultValue, isView = false, isCreate = false }) {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = !isCreate;

  const profileImage = {};

  const UpdateUserSchema = Yup.object().shape({
    // Upon updating a book use this schema for validation
  });

  const defaultValues = {
    // Create default values,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = useCallback(
    async (values) => {
      if (errors?.length || (!book?.id && !isCreate)) {
        enqueueSnackbar(`Errors Please check data ${JSON.stringify(errors)}`, { variant: 'error' });
        return;
      }
      setIsSubmitting(true);
      try {
        // Implement Updating here

        enqueueSnackbar('Successfully Updated!', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Error updating!', { variant: 'error' });
        console.error(error);
      }
      reset(values);
      setIsSubmitting(false);
    },
    [book],
  );

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'profileImage',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        );
        // Implement Saving of image here
      }
    },
    [setValue, params, profileImage],
  );

  if (!book?.id && isView) {
    return <SkeletoAccontItem />;
  }

  if (isView) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BooksCard book={book} clickable={false} />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant='h3' sx={{ color: 'text.primary', pb: 4 }}>
              Summary
            </Typography>
            <Typography variant='h6' sx={{ color: 'text.primary', pb: 2 }}>
              TITLE: {` ${capitalCase(book.title)}`}
            </Typography>
            <Typography variant='h6' sx={{ color: 'text.primary', pb: 2 }}>
              AUTHOR: {` ${capitalCase(book.author.name)}`}
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
              {book?.summary}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            {/* Book's profile image here */}
            <RHFUploadAvatar
              name='profileImage'
              accept='image/*'
              maxSize={3145728}
              onDrop={handleDrop}
              disabled={isDisabled}
              helperText={
                <Typography
                  variant='caption'
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            {/* Implement logic here for warnings */}
            <Alert severity='warning'>You cannot edit </Alert>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                pt: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}>
              <RHFTextField name='title' label='Title' />
              <RHFTextField name='imageUrl' label='url' />
            </Box>

            <Stack spacing={3} alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
