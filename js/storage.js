// Persistència local. Cap dada s'envia a cap servidor.
const KEY = '3tec-sa1-v1';
const initial = () => ({ completed: [], notes: {}, done: [], answers: {}, rubric: {}, experiments: {} });
function warning(message) { const node = document.querySelector('#storage-warning'); node.hidden = false; node.textContent = message; }
function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!value) return initial();
    if (!Array.isArray(value.completed) || !Array.isArray(value.done) || !value.notes || typeof value.notes !== 'object' || Array.isArray(value.notes)) throw Error('Format desconegut');
    for (const key of ['notes', 'answers', 'rubric', 'experiments']) {
      if (!value[key] || typeof value[key] !== 'object' || Array.isArray(value[key])) value[key] = {};
    }
    value.completed = value.completed.filter(x => typeof x === 'string');
    value.done = value.done.filter(x => typeof x === 'string');
    return { ...initial(), ...value };
  } catch { warning('No s’ha pogut recuperar el progrés. Pots continuar, però exporta el quadern abans de sortir.'); return initial(); }
}
export const state = read();
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
  catch { warning('El navegador no permet desar el progrés. Exporta el quadern abans de tancar la pàgina.'); return false; }
}
export function toggle(list, id, on) { state[list] = state[list].filter(x => x !== id); if (on) state[list].push(id); return save(); }
export function reset() { Object.assign(state, initial()); return save(); }
