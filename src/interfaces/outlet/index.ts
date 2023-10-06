import { SalesAssociateInterface } from 'interfaces/sales-associate';
import { ToolInterface } from 'interfaces/tool';
import { CompanyInterface } from 'interfaces/company';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OutletInterface {
  id?: string;
  name: string;
  location: string;
  company_id: string;
  manager_id: string;
  created_at?: any;
  updated_at?: any;
  sales_associate?: SalesAssociateInterface[];
  tool?: ToolInterface[];
  company?: CompanyInterface;
  user?: UserInterface;
  _count?: {
    sales_associate?: number;
    tool?: number;
  };
}

export interface OutletGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  location?: string;
  company_id?: string;
  manager_id?: string;
}
