export function selectCreate(settings) {
  const { name, className = '', options, multiple = false, withSearch = true } = settings;
  return `
      <select name=${name} class="selectpicker ${className}" multiple=${multiple} data-live-search=${withSearch}>
          ${options.map(({ value, content }) => `<option value=${value}>${content}</option>`).join('')}
       </select>  
      `;
}
