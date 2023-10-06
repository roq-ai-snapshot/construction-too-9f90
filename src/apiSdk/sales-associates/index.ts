import queryString from 'query-string';
import { SalesAssociateInterface, SalesAssociateGetQueryInterface } from 'interfaces/sales-associate';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getSalesAssociates = async (
  query: SalesAssociateGetQueryInterface = {},
): Promise<PaginatedInterface<SalesAssociateInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'sales_associate');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/sales_associate/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/sales_associate/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createSalesAssociate = async (salesAssociate: SalesAssociateInterface) => {
  return fetcher('/api/model/sales_associate', { method: 'POST', body: JSON.stringify({ data: salesAssociate }) });
};

export const updateSalesAssociateById = async (id: string, salesAssociate: SalesAssociateInterface) => {
  return fetcher('/api/model/sales_associate/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: salesAssociate,
    }),
  });
};

export const getSalesAssociateById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/sales_associate/findFirst',
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

export const deleteSalesAssociateById = async (id: string) => {
  return fetcher(
    '/api/model/sales_associate/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
