import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createSalesAssociate } from 'apiSdk/sales-associates';
import { salesAssociateValidationSchema } from 'validationSchema/sales-associates';
import { UserInterface } from 'interfaces/user';
import { OutletInterface } from 'interfaces/outlet';
import { getUsers } from 'apiSdk/users';
import { getOutlets } from 'apiSdk/outlets';
import { SalesAssociateInterface } from 'interfaces/sales-associate';

function SalesAssociateCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const handleSubmit = async (values: SalesAssociateInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSalesAssociate(values);
      resetForm();
      router.push('/sales-associates');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SalesAssociateInterface>({
    initialValues: {
      hire_date: new Date(new Date().toDateString()),
      sales_quota: 0,
      total_sales: 0,
      user_id: (router.query.user_id as string) ?? null,
      outlet_id: (router.query.outlet_id as string) ?? null,
    },
    validationSchema: salesAssociateValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Sales Associates',
              link: '/sales-associates',
            },
            {
              label: 'Create Sales Associate',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Sales Associate
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="hire_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Hire Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.hire_date ? new Date(formik.values?.hire_date) : null}
              onChange={(value: Date) => formik.setFieldValue('hire_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Sales Quota"
            formControlProps={{
              id: 'sales_quota',
              isInvalid: !!formik.errors?.sales_quota,
            }}
            name="sales_quota"
            error={formik.errors?.sales_quota}
            value={formik.values?.sales_quota}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('sales_quota', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Total Sales"
            formControlProps={{
              id: 'total_sales',
              isInvalid: !!formik.errors?.total_sales,
            }}
            name="total_sales"
            error={formik.errors?.total_sales}
            value={formik.values?.total_sales}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_sales', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<OutletInterface>
            formik={formik}
            name={'outlet_id'}
            label={'Select Outlet'}
            placeholder={'Select Outlet'}
            fetcher={getOutlets}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/sales-associates')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'sales_associate',
    operation: AccessOperationEnum.CREATE,
  }),
)(SalesAssociateCreatePage);
