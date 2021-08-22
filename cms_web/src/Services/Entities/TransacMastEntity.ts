interface TransacMastEntity {
  slipno?: string;
  cashieruser?: string;
  cashiername?: string;
  stationno?: string;
  customer?: string;
  discountid?: string;
  discountrate?: number;
  discountamount?: number;
  totalcost?: number;
  vatrate?: number;
  vatamount?: number;
  netcost?: number;
  transactat?: Date | string;
  iscompany?: number;
  companyid?: string;
  companyname?: string;
  sectioncode?: string;
  sectionname?: string;
}

export default TransacMastEntity;
