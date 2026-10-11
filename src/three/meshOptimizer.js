/**
 * Suavizado de normales en las mangas para atenuar pliegues y sombras duras de CLO3D
 * sin distorsionar la geometría ni causar colapso de mallas dobles.
 */
export function smoothSleeveNormals(rootObject, iterations = 10) {
  if (!rootObject) return;

  rootObject.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;

    const geom = child.geometry;
    const pos = geom.attributes.position;
    const norm = geom.attributes.normal;
    const index = geom.index;
    if (!pos || !norm || !index) return;

    const nVerts = pos.count;
    const adj = Array.from({ length: nVerts }, () => []);
    const idxArr = index.array;
    for (let i = 0; i < idxArr.length; i += 3) {
      const a = idxArr[i];
      const b = idxArr[i + 1];
      const c = idxArr[i + 2];
      adj[a].push(b, c);
      adj[b].push(a, c);
      adj[c].push(a, b);
    }

    // Suavizado difuso de vectores normales exclusivamente en las mangas (|X| > 0.16)
    for (let it = 0; it < iterations; it++) {
      const nextNx = new Float32Array(nVerts);
      const nextNy = new Float32Array(nVerts);
      const nextNz = new Float32Array(nVerts);

      for (let i = 0; i < nVerts; i++) {
        const x = pos.getX(i);
        const nx = norm.getX(i);
        const ny = norm.getY(i);
        const nz = norm.getZ(i);

        if (Math.abs(x) > 0.16) {
          const nbrs = adj[i];
          let avgNx = nx;
          let avgNy = ny;
          let avgNz = nz;
          for (let k = 0; k < nbrs.length; k++) {
            const ni = nbrs[k];
            avgNx += norm.getX(ni);
            avgNy += norm.getY(ni);
            avgNz += norm.getZ(ni);
          }
          const len = Math.hypot(avgNx, avgNy, avgNz) || 1.0;
          nextNx[i] = avgNx / len;
          nextNy[i] = avgNy / len;
          nextNz[i] = avgNz / len;
        } else {
          nextNx[i] = nx;
          nextNy[i] = ny;
          nextNz[i] = nz;
        }
      }

      for (let i = 0; i < nVerts; i++) {
        norm.setXYZ(i, nextNx[i], nextNy[i], nextNz[i]);
      }
    }

    norm.needsUpdate = true;
  });
}
