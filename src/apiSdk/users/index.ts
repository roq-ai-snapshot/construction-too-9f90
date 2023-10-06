import { UserInterface, UserGetQueryInterface } from 'interfaces/user';
import { PaginatedInterface } from 'interfaces';
import { getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getUsers = async (query: UserGetQueryInterface = {}): Promise<PaginatedInterface<UserInterface>> => {
  const { offset: skip, limit: take, relations = [], searchTerm, order, searchTermKeys, ...where } = query;
  const pagination = {
    skip,
    take,
  };
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/user/findMany',
      {},
      {
        ...pagination,
        where,
        include: relations.reduce((acc, el) => ({ ...acc, [el.split('.')[0]]: true }), {}),
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/user/count', {}, { where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const getUserById = async (id: string, query: UserGetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/user/findUnique',
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
