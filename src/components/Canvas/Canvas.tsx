import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Connection,
  NodeDragHandler,
  ReactFlowProvider,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useModelStore } from '../../store/useModelStore';
import LayerNode from './LayerNode';
import ParamEditor from './ParamEditor';

const nodeTypes = { layerNode: LayerNode };

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
};

function CanvasInner() {
  const nodes = useModelStore(s => s.nodes);
  const edges = useModelStore(s => s.edges);
  const addNode = useModelStore(s => s.addNode);
  const addEdge = useModelStore(s => s.addEdge);
  const addTemplate = useModelStore(s => s.addTemplate);
  const setNodes = useModelStore(s => s.setNodes);
  const setEdges = useModelStore(s => s.setEdges);
  const selectNode = useModelStore(s => s.selectNode);
  const updateNodePosition = useModelStore(s => s.updateNodePosition);

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowRef.current = instance;
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    addEdge(connection);
  }, [addEdge]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!reactFlowRef.current) return;

    const position = reactFlowRef.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const templateId = event.dataTransfer.getData('application/vistorch-template');
    if (templateId) {
      addTemplate(templateId, position);
      return;
    }

    const layerType = event.dataTransfer.getData('application/vistorch-layer');
    if (layerType) {
      addNode(layerType, position);
    }
  }, [addNode, addTemplate]);

  const onNodeDragStop: NodeDragHandler = useCallback((_event, node) => {
    updateNodePosition(node.id, node.position);
  }, [updateNodePosition]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const updatedNodes = [...nodes];
    let changed = false;

    for (const change of changes) {
      if (change.type === 'position' && change.id && change.position) {
        const idx = updatedNodes.findIndex(n => n.id === change.id);
        if (idx >= 0) {
          updatedNodes[idx] = { ...updatedNodes[idx], position: change.position, dragging: change.dragging };
          changed = true;
        }
      }
    }

    if (changed) {
      setNodes(updatedNodes);
    }
  }, [nodes, setNodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const removedIds = changes.filter((c): c is EdgeChange & { type: 'remove'; id: string } => c.type === 'remove').map(c => c.id);
    if (removedIds.length > 0) {
      setEdges(edges.filter(e => !removedIds.includes(e.id)));
    }
  }, [edges, setEdges]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        deleteKeyCode="Delete"
      >
        <Background />
        <Controls />
      </ReactFlow>
      <ParamEditor />
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
