document.addEventListener('submit', event => handleTokenSubmit(event), false)

async function handleTokenSubmit(event) {
  event.preventDefault();

  const token = document.getElementById('token').value

  miro.board.ui.closeModal(token)
}