import queryString from 'query-string';
import { OutletInterface, OutletGetQueryInterface } from 'interfaces/outlet';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getOutlets = async (query: OutletGetQueryInterface = {}): Promise<PaginatedInterface<OutletInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'outlet');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/outlet/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/outlet/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createOutlet = async (outlet: OutletInterface) => {
  return fetcher('/api/model/outlet', { method: 'POST', body: JSON.stringify({ data: outlet }) });
};

export const updateOutletById = async (id: string, outlet: OutletInterface) => {
  return fetcher('/api/model/outlet/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: outlet,
    }),
  });
};

export const getOutletById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/outlet/findFirst',
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

export const deleteOutletById = async (id: string) => {
  return fetcher(
    '/api/model/outlet/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
