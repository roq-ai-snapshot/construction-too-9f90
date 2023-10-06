import * as yup from 'yup';

export const salesAssociateValidationSchema = yup.object().shape({
  hire_date: yup.date().required(),
  sales_quota: yup.number().integer().required(),
  total_sales: yup.number().integer().required(),
  user_id: yup.string().nullable().required(),
  outlet_id: yup.string().nullable().required(),
});
