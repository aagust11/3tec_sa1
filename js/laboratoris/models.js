// Models educatius. Unitats i hipòtesis explícites a cada laboratori.
export function beamRatio({force=10,length=100,width=10,height=10}) {
  // δ = F L³/(48 E I), I = b h³/12. E és constant.
  return (force/10)*(length/100)**3*(10/width)*(10/height)**3;
}
// F en N; longitud en cm; perfil en mm; E en GPa. Retorna la fletxa en mm.
// Biga simplement recolzada amb càrrega puntual central, sense pes propi.
export function beamDeflection({force=10,length=100,width=10,height=10,modulus=200}={}) {
 const spanMm=length*10,elasticity=modulus*1000,inertia=width*height**3/12;
 return force*spanMm**3/(48*elasticity*inertia);
}
export function springExtension(force,stiffness) { return force/stiffness; }
export function supportReactions(force,position,length=100) {
  return {left:force*(length-position)/length,right:force*position/length};
}
export const graph = body => `<svg viewBox="0 0 500 320" role="img" aria-label="Representació del model"><defs><pattern id="model-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#d7ddce" stroke-width=".6"/></pattern><marker id="model-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3 0 6Z" fill="#ad490b"/></marker></defs><rect width="500" height="320" fill="url(#model-grid)"/>${body}</svg>`;
export const range = (id,label,min,max,step,value) => `<label for="${id}">${label}: <output id="${id}-value">${value}</output></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}">`;
export function scaffold(root,title,controls,description){root.innerHTML=`<div class="lab-grid"><div class="lab-visual"></div><div class="lab-controls"><h2>${title}</h2>${controls}<p>${description}</p><div class="lab-result" aria-live="polite"></div></div></div>`;}
export function labels(root){root.querySelectorAll('input[type="range"]').forEach(x=>{root.querySelector(`#${x.id}-value`).textContent=x.value;});}
