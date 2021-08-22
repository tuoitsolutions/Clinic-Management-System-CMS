interface SlipSeriesEntity {
  station?: string;
  lastor?: string;
  tstamp?: Date;
  prefix?: string;
}

export interface UserHasSlipSeriesModel {
  has_slip?: boolean;
  last_slip?: SlipSeriesEntity;
}

export default SlipSeriesEntity;
