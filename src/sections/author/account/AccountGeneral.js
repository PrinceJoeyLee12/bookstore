import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { fData } from 'utils/formatNumber';
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from 'components/hook-form';
import { SkeletoAccontItem } from 'components/skeleton';
import { updateAuthor } from 'redux/slices/author/actions';
import { capitalCase } from 'change-case';

export default function AccountGeneral({ author = null, isCreate = false }) {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    age: Yup.number().required('Age name required'),
    imageUrl: Yup.string().required('Image url is required'),
  });

  const defaultValues = (authorUpdate) => ({
    firstName: authorUpdate?.firstName || '',
    lastName: authorUpdate?.lastName || '',
    name: authorUpdate?.name || '',
    age: authorUpdate?.age || '',
    imageUrl: authorUpdate?.image?.url || '',
    profileImage: authorUpdate?.image?.url || '',
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: defaultValues(author),
  });

  useEffect(() => {
    reset(defaultValues(author));
  }, [author]);

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = useCallback(
    async (values) => {
      if (errors?.length || (!author?.id && !isCreate)) {
        enqueueSnackbar(`Errors Please check data ${JSON.stringify(errors)}`, { variant: 'error' });
        return;
      }
      setIsSubmitting(true);
      try {
        if (author?.id && !isCreate) {
          const fullName = `${values?.firstName} ${values?.lastName}`;
          await updateAuthor({
            id: author?.id,
            name: fullName.toLowerCase(),
            lastName: values?.lastName,
            firstName: values?.firstName,
            age: parseInt(values?.age, 10),
            image: {
              url: values?.imageUrl,
              title: capitalCase(fullName),
            },
          });
        } else if (isCreate) {
        }

        enqueueSnackbar('Successfully Updated!', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Error updating!', { variant: 'error' });
        console.error(error);
      }
      reset(values);
      setIsSubmitting(false);
    },
    [author],
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
      }
    },
    [setValue, params],
  );

  if (!author?.id) {
    return <SkeletoAccontItem />;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name='profileImage'
              accept='image/*'
              maxSize={3145728}
              onDrop={handleDrop}
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
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                pt: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}>
              <RHFTextField name='firstName' label='First Name' />
              <RHFTextField name='lastName' label='Last Name' />
              <RHFTextField name='age' label='Age' type='number' />
              <RHFTextField name='imageUrl' label='Image Url' placeholder='https://www.myimage.url.com/' />
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
