import $ from 'jquery';

export const getFormData = ({ form }) =>
  Array.from(form.elements)
    .filter(({ name }) => name)
    .reduce((acc, currentField) => {
      if (currentField.classList.contains('selectpicker')) {
        acc[currentField.name] = Array.from(currentField.selectedOptions).map((el) => el.value);
      } else acc[currentField.name] = currentField[getNameFieldValue({ field: currentField })];
      return acc;
    }, {});

export const setFormData = ({ form, formData }) =>
  Array.from(form.elements)
    .filter(({ name }) => name)
    .forEach((field) => {
      if (field.classList.contains('selectpicker')) {
        const selectValues = Array.from(field.options)
          .map((option) => option.value)
          .filter((optionValue) => formData[optionValue]);
        $(`[name=${field.name}].selectpicker`).selectpicker('val', selectValues);
      } else {
        // eslint-disable-next-line no-param-reassign
        field[getNameFieldValue({ field })] = formData[field.name];
      }
    });

function getNameFieldValue({ field }) {
  switch (field.type) {
    case 'checkbox': {
      return 'checked';
    }
    default:
      return 'value';
  }
}
