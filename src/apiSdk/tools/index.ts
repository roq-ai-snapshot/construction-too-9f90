import queryString from 'query-string';
import { ToolInterface, ToolGetQueryInterface } from 'interfaces/tool';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { fetcher } from 'lib/api-fetcher';

export const getTools = async (query: ToolGetQueryInterface = {}): Promise<PaginatedInterface<ToolInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'tool');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/tool/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/tool/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createTool = async (tool: ToolInterface) => {
  return fetcher('/api/model/tool', { method: 'POST', body: JSON.stringify({ data: tool }) });
};

export const updateToolById = async (id: string, tool: ToolInterface) => {
  return fetcher('/api/model/tool/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: tool,
    }),
  });
};

export const getToolById = async (id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/tool/findFirst',
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

export const deleteToolById = async (id: string) => {
  return fetcher(
    '/api/model/tool/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
