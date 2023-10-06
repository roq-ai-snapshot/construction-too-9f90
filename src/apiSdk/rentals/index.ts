import queryString from 'query-string';
import { RentalInterface, RentalGetQueryInterface } from 'interfaces/rental';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getRentals = async (query: RentalGetQueryInterface = {}): Promise<PaginatedInterface<RentalInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'rental');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/rental/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/rental/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createRental = async (rental: RentalInterface) => {
  return fetcher('/api/model/rental', { method: 'POST', body: JSON.stringify({ data: rental }) });
};

export const updateRentalById = async (id: string, rental: RentalInterface) => {
  return fetcher('/api/model/rental/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: rental,
    }),
  });
};

export const getRentalById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/rental/findFirst',
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

export const deleteRentalById = async (id: string) => {
  return fetcher(
    '/api/model/rental/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
