const THREE = window.THREE;

export function assignTransformations(refererence_dummy, nodeId, tree, viewer) {
  refererence_dummy.parent.updateMatrixWorld();
  var position = new THREE.Vector3();
  var rotation = new THREE.Quaternion();
  var scale = new THREE.Vector3();
  refererence_dummy.matrixWorld.decompose(position, rotation, scale);

  tree.enumNodeFragments(nodeId, function(frag) {
    var fragProxy = viewer.impl.getFragmentProxy(viewer.model, frag);
    fragProxy.getAnimTransform();
    fragProxy.position = position;
    fragProxy.quaternion = rotation;
    fragProxy.updateAnimTransform();
  });
}

export function findNodeIdbyName(name, tree) {
  let nodeList = Object.values(tree.nodeAccess.dbIdToIndex);
  for (let i = 1, len = nodeList.length; i < len; ++i) {
    let node_name = tree.getNodeName(nodeList[i]);
    if (node_name === name) {
      return nodeList[i];
    }
  }
  return null;
}

export function getFragmentWorldMatrixByNodeId(nodeId, tree, viewer) {
  let result = {
    fragId: [],
    matrix: []
  };
  tree.enumNodeFragments(nodeId, function(frag) {
    let fragProxy = viewer.impl.getFragmentProxy(viewer.model, frag);
    let matrix = new THREE.Matrix4();

    fragProxy.getWorldMatrix(matrix);

    result.fragId.push(frag);
    result.matrix.push(matrix);
  });
  return result;
}
