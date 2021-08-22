interface TransacDtlsEntity {
  trandtlsno?: string;
  slipno?: string;
  menuno?: string;
  menudesc?: string;
  price?: number;
  qty?: number;
  qty_add_rate?: number;
  qty_add_amount?: number;
  vatrate?: number;
  vatamount?: number;
  discid?: number;
  discrate?: number;
  discamount?: number;
  subtotal?: number;
}

export default TransacDtlsEntity;
