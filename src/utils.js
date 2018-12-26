export class PromiseProxy {
  constructor(initialPromise) {
    let externalResolve, externalReject;
    let p = new Promise((res, rej)=>{
      externalResolve = res;
      externalReject = rej;
    });
    p.externalResolve = externalResolve;
    p.externalReject = externalReject;

    p.proxy = function(externalPromise){
      externalPromise
        .then(externalResolve)
        .catch(externalReject);
    };

    if(initialPromise) {
      p.proxy(initialPromise);
    }

    return p;
  }
}

export function _assert(condition, message="Assertion Error", error=Error) {
  if(!condition) {
    throw new error(message);
  }
}

/**Correlary to JQuery's $.parseHTML for plain js
 * @param {string} The HTML to convert to elements
 * @returns {DocumentFragment} A document fragment that can be
 * added directly to DOM with appendChild
 */
export function parseHTML(str) {
  let parser = new DOMParser(),
  doc = parser.parseFromString(str, "text/html"),
  documentFragment = document.createDocumentFragment();
  Array.from(doc.body.children).forEach((el)=>{
    documentFragment.appendChild(el);
  });
  return documentFragment;
}