import queryString from 'query-string';
import { CompanyInterface, CompanyGetQueryInterface } from 'interfaces/company';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getCompanies = async (
  query: CompanyGetQueryInterface = {},
): Promise<PaginatedInterface<CompanyInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'company');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/company/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/company/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createCompany = async (company: CompanyInterface) => {
  return fetcher('/api/model/company', { method: 'POST', body: JSON.stringify({ data: company }) });
};

export const updateCompanyById = async (id: string, company: CompanyInterface) => {
  return fetcher('/api/model/company/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: company,
    }),
  });
};

export const getCompanyById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/company/findFirst',
    {},
    {
      where: {
        id,
      },
      include: relations.reduce((acc, el) => ({ ...acc, [el.split('.')[0]]: true }), {}),
    },
  );
  return response.data;
};

export const deleteCompanyById = async (id: string) => {
  return fetcher(
    '/api/model/company/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
