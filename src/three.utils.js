import * as THREE from "three";

/**Builds a mesh that is the bounds of the given object
 * @param {THREE.Mesh} mesh
 * @returns {THREE.Mesh} Bounding box object
 */
export function makeHitBox(mesh){
  let geo = mesh.geometry;
  if(!geo.boundingBox) {
    geo.computeBoundingBox();
  }
  let size = geo.boundingBox.getSize(new THREE.Vector3());
  let box = new THREE.BoxBufferGeometry(size.z, size.x, size.y);
  let mat = new THREE.MeshBasicMaterial({
      color: 0xFFFF00,
      visible: false //Don't render, but still get raycasts
  });
  let bb = new THREE.Mesh(box, mat);
  bb.position.add(new THREE.Vector3(0,size.x/2,0))
      .add(gg.position);
  bb.name = (mesh.name || mesh.uuid) + "_hitbox";
  return bb;
}


export const conversions = {
  eventToWindowPX : (ev)=>{
    return new THREE.Vector2(ev.clientX, ev.clientY);
  },
  windowPXToViewportPX : (el, v2)=>{
    let rect = el.getBoundingClientRect();
    return v2.sub(new THREE.Vector2(rect.left, rect.top));
  },
  viewportPXToviewportNDC : (el, v2)=>{
    v2.multiply(new THREE.Vector2(1/el.offsetWidth, 1/el.offsetHeight));
    v2.multiplyScalar(2);
    v2.sub(new THREE.Vector2(1,1));
    v2.multiply(new THREE.Vector2(1,-1));
    return v2;
  }
};