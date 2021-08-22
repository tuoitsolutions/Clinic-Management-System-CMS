interface PaymongoModel {
  data: PaymongoCardDataModel;
}

export interface PaymongoCardDataModel {
  attributes: PaymongoCardAttributesModel;
}

export interface PaymongoCardAttributesModel {
  type?: string;
  details?: PaymongoCardDetailsModel; //
  billing?: PaymongoCardBillingModel;
  metadata?: any;
}

export interface PaymongoCardDetailsModel {
  card_number: string;
  exp_month?: number;
  exp_year?: number;
  cvc?: string;
}

export interface PaymongoCardBillingModel {
  address: PaymongoCardAddressModel;
  name?: string;
  email?: string;
  phone?: string;
}

export interface PaymongoCardAddressModel {
  line1?: string;
  line2?: string; //
  city?: string;
  state?: any;
  postal_code?: any;
  country?: any;
}

export interface PaymentIntentAttachModel {
  // payment_intent_id?: string;
  payment_intent_client_key?: string;
  pay_method_id?: string;
  public_key?: string;
  secret_key?: string;
  secure_3d_link?: string;
}

export default PaymongoModel;
