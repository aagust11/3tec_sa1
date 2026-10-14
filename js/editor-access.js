// Barrera local de conveniència: GitHub Pages no proporciona autenticació de servidor.
const expected = '6da713af1d2e18991dc91b38ba5f0d6a88002e6ee3496d14402c0a78b6fa6939';
const form = document.querySelector('#access-form');
form.addEventListener('submit', async event => {
 event.preventDefault();
 const field = document.querySelector('#editor-password');
 const error = document.querySelector('#access-error');
 const submit = form.querySelector('button');
 submit.disabled = true;
 try {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(field.value));
  const digest = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
  if (digest !== expected) { error.textContent = 'Contrasenya incorrecta. Torna-ho a provar.'; field.value = ''; field.focus(); return; }
  await import('./exercise-editor.js');
  field.value = '';
  document.querySelector('#access-panel').hidden = true;
  document.querySelector('#editor-content').hidden = false;
  document.querySelector('#exercise-id').focus();
 } catch { error.textContent = 'No s’ha pogut obrir l’editor. Recarrega la pàgina i torna-ho a provar.'; }
 finally { submit.disabled = false; }
});
