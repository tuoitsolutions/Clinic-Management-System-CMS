interface BillPaymongoEntity {
  bill_paymongo_pk?: string;
  id?: string;
  event_type?: string;
  source_type?: string;
  amount?: number;
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
  email?: string;
  phone?: string;
  currency?: string;
  livemode?: boolean;
  checkout_url?: string;
  failed_url?: string;
  success_url?: string;
  status?: string;
  type?: string;
  created_at?: number;
  updated_at?: number;
  paid_at?: number;
  available_at?: number;
  consult_req_pk?: string;
  fee?: number;
  pay_descrip?: string;
  pay_net_amount?: number;
  pay_payout?: string;
  pay_src_id?: string;
  pay_src_type?: string;
  pay_statement_descrip?: string;

  //card
  payment_intent_id?: string;
  origin?: string;
  tax_amount?: string;
  refunds?: Array<any>;
  taxes?: Array<any>;
  access_url?: string;
  client_key?: string;

  card_src_id?: string;

  card_src_type?: string;
  card_src_brand?: string;
  card_src_country?: string;
  card_src_last4?: string;

  logged_at?: string | Date;
}

export interface BillPaymongoTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<BillPaymongoEntity>;
}

export default BillPaymongoEntity;
