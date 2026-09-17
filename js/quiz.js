import {state, save} from './storage.js';
export function mountQuiz(root, questions, escape, onChange = () => {}) {
  root.innerHTML = questions.map(q => `<section class="question" data-question="${q.id}"><h3>${escape(q.enunciat)}</h3><div class="answers">${q.opcions.map((o,i)=>`<button class="answer" data-answer="${i}">${escape(o)}</button>`).join('')}</div><div class="feedback" aria-live="polite"></div></section>`).join('');
  function paint(q) {
    const box = root.querySelector(`[data-question="${q.id}"]`);
    const answer = state.answers[q.id];
    if (!Number.isInteger(answer)) return;
    box.querySelectorAll('[data-answer]').forEach(button => {
      const i = Number(button.dataset.answer);
      button.disabled = true;
      button.classList.toggle('chosen', i === answer);
      button.classList.toggle('correct', i === q.correcta);
      button.classList.toggle('wrong', i === answer && i !== q.correcta);
    });
    box.querySelector('.feedback').textContent = (answer === q.correcta ? '✓ Correcte. ' : '↻ Revisa-ho. ') + q.explicacio;
  }
  questions.forEach(paint);
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-answer]'); if (!button) return;
    const q = questions.find(x => x.id === button.closest('[data-question]').dataset.question);
    state.answers[q.id] = Number(button.dataset.answer); save(); paint(q); onChange();
  });
}
