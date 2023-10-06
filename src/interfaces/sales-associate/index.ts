import { UserInterface } from 'interfaces/user';
import { OutletInterface } from 'interfaces/outlet';
import { GetQueryInterface } from 'interfaces';

export interface SalesAssociateInterface {
  id?: string;
  user_id: string;
  outlet_id: string;
  hire_date?: any;
  sales_quota: number;
  total_sales: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  outlet?: OutletInterface;
  _count?: {};
}

export interface SalesAssociateGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  outlet_id?: string;
}
