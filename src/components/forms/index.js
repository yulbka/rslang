export const getFormData = ({ form }) =>
  Array.from(form.elements)
    .filter(({ tagName }) => tagName !== 'BUTTON')
    .reduce((acc, currentField) => {
      acc[currentField.name] = currentField[getNameFieldValue({ field: currentField })];
      return acc;
    }, {});

export const setFormData = ({ form, formData }) =>
  Array.from(form.elements)
    .filter(({ tagName }) => tagName !== 'BUTTON')
    .forEach((field) => {
      // eslint-disable-next-line no-param-reassign
      field[getNameFieldValue({ field })] = formData[field.name];
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
