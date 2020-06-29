export function createPopupNotification() {
    return `
<div class="toast rs-notification" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <img src="" class="rounded mr-2" alt="...">
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body">
  Настройки применены!
  </div>
</div>
`
}