const convertFileToFormData = (form: any): FormData => {
  const form_data = new FormData();

  for (var key in form) {
    if (form[key] instanceof Array) {
      for (const val of form[key]) {
        form_data.append(key, val);
      }
    } else {
      form_data.append(key, form[key]);
    }
  }

  return form_data;
};

const ObjectToFormDataHelper = (object) =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());

function convertModelToFormData(data = {}, form = null, namespace = "") {
  let files = {};
  let model = {};
  for (let propertyName in data) {
    if (
      data.hasOwnProperty(propertyName) &&
      data[propertyName] instanceof File
    ) {
      files[propertyName] = data[propertyName];
    } else {
      model[propertyName] = data[propertyName];
    }
  }

  model = JSON.parse(JSON.stringify(model));
  let formData = form || new FormData();

  for (let propertyName in model) {
    if (!model.hasOwnProperty(propertyName) || !model[propertyName]) continue;
    let formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
    if (model[propertyName] instanceof Date)
      formData.append(formKey, model[propertyName].toISOString());
    else if (model[propertyName] instanceof File) {
      formData.append(formKey, model[propertyName]);
    } else if (model[propertyName] instanceof Array) {
      model[propertyName].forEach((element, index) => {
        const tempFormKey = `${formKey}[${index}]`;
        if (typeof element === "object" || element instanceof File) {
          this.convertModelToFormData(element, formData, tempFormKey);
        } else {
          formData.append(tempFormKey, element.toString());
        }
      });
    } else if (
      typeof model[propertyName] === "object" &&
      !(model[propertyName] instanceof File)
    )
      this.convertModelToFormData(model[propertyName], formData, formKey);
    else {
      formData.append(formKey, model[propertyName].toString());
    }
  }

  for (let propertyName in files) {
    if (files.hasOwnProperty(propertyName)) {
      formData.append(propertyName, files[propertyName]);
    }
  }
  return formData;
}

export default {
  convertModelToFormData,
  convertFileToFormData,
  ObjectToFormDataHelper,
};
