import * as yup from 'yup';

export const outletValidationSchema = yup.object().shape({
  name: yup.string().required(),
  location: yup.string().required(),
  company_id: yup.string().nullable().required(),
  manager_id: yup.string().nullable().required(),
});
