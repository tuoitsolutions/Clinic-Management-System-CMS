interface ResponseModel {
  success: boolean;
  data?: any;
  message?: string | number | null;
  fileContent?: any;
  errors?: [ResponseModel];
  paymongo_errors?: Array<PaymongoResouceError>;
}

interface IServerError {
  key: string;
  message: string;
}

interface PaymongoResouceError {
  code?: string;
  detail?: string;
}

export default ResponseModel;
