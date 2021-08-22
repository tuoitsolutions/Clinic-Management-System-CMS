import { OptionItemModel } from "../Services/Models/OptionModel";

const ArraySingleToOptions = (single_arr_list: Array<string>) => {
  const options: Array<OptionItemModel> = [];
  single_arr_list.forEach((a) =>
    options.push({
      id: a,
      label: a,
    })
  );

  return options;
};

export default {
  ArraySingleToOptions,
};
