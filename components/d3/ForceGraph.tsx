"use client"; // Deja usar el cliente

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { AFN } from '@/ts/AFN';

// Definir tipos para los nodos y los enlaces
interface Node extends d3.SimulationNodeDatum {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  type?: 'inicial' | 'final' | 'normal';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node;
  target: Node;
  label: string;
}

interface ForceGraphProps {
  afn: AFN | null;
}

// El componente principal
const ForceGraph: React.FC<ForceGraphProps> = ({ afn }) => {
  const svgRef = useRef<SVGSVGElement>(null); // Ref para el SVG

  useEffect(() => {
    if (!svgRef.current || !afn) return;

    const svg = d3.select(svgRef.current);
    // Limpiar el SVG antes de agregar el grafo
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.attr('width', width).attr('height', height);

    const nodes: Node[] = [];
    const links: Link[] = [];

    // Crear un mapa de id a nodo para facilitar la referencia
    const nodeMap = new Map<string, Node>();

    // Convertir AFN a nodos y enlaces
    afn.edosAFN.forEach(estado => {
      const nodeId = estado.GetIdEstado.toString();
      
      // Solo agregar el nodo si no existe en el mapa
      if (!nodeMap.has(nodeId)) {
        const node: Node = { 
          id: nodeId, 
          type: estado.GetEdoAcept ? 'final' : (estado === afn.edoIni ? 'inicial' : 'normal') 
        };
        nodeMap.set(nodeId, node);
        nodes.push(node); // Agregar el nodo a la lista de nodos
      }
    });

    // Convertir el mapa a un array de nodos
    const nodesArray = Array.from(nodeMap.values());

    afn.edosAFN.forEach(estado => {
      estado.GetTrans.forEach(trans => {
        if (trans.edoDestino) {
          const targetNode = nodeMap.get(trans.edoDestino.GetIdEstado.toString());
          if (!targetNode) {
            console.error(`Target node not found for transition: ${trans.edoDestino.GetIdEstado}`);
            return;
          }
          links.push({
            source: nodeMap.get(estado.GetIdEstado.toString())!,
            target: targetNode,
            label: trans.getSimboloInf() === trans.getSimboloSup() ? trans.getSimboloInf() : `${trans.getSimboloInf()}-${trans.getSimboloSup()}`
          });
        }
      });
    });

    const simulation = d3.forceSimulation(nodesArray)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);
      
    // Agregar flechas a los enlaces
    link.attr('marker-end', 'url(#arrow)'); // Añadir la referencia al marcador de flecha

    // Definir el marcador de flecha
    svg.append('defs').selectAll('marker')
      .data(['arrow']) // Usar un solo marcador
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 20) // Ajustar la posición de la flecha
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0 L0,10 L10,5 Z') // Forma de la flecha
      .attr('fill', '#1A1A1A'); // Color de la flecha

    // Agregar etiquetas a los enlaces
    const linkLabels = svg.append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .text(d => d.label)
      .attr('font-size', '18px')
      .attr('text-anchor', 'middle')
      .attr('fill', '#1A1A1A');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodesArray)
      .enter()
      .append('circle')
      .attr('r', d => d.type === 'inicial' ? 20 : (d.type === 'final' ? 20 : 15)) // Cambiar el radio según el tipo
      .attr('fill', d => d.type === 'inicial' ? '#907aa9' : (d.type === 'final' ? '#56949f' : '#b4637a')) // Cambiar el color según el tipo
      .call(d3.drag<any, Node>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    const label = svg.append('g')
      .selectAll('text')
      .data(nodesArray)
      .enter()
      .append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', 'white');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source.x !== undefined ? d.source.x : 0))
        .attr('y1', d => (d.source.y !== undefined ? d.source.y : 0))
        .attr('x2', d => (d.target.x !== undefined ? d.target.x : 0))
        .attr('y2', d => (d.target.y !== undefined ? d.target.y : 0));

      node
        .attr('cx', d => (d.x !== undefined ? d.x : 0))
        .attr('cy', d => (d.y !== undefined ? d.y : 0));

      label
        .attr('x', d => (d.x !== undefined ? d.x : 0))
        .attr('y', d => (d.y !== undefined ? d.y : 0));

      linkLabels
        .attr('x', d => ((d.source.x || 0) + (d.target.x || 0)) / 2)
        .attr('y', d => ((d.source.y || 0) + (d.target.y || 0)) / 2 - 10);
    });

    // Funciones de arrastre
    function dragStarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [afn]);

  return <svg ref={svgRef} className="w-full h-full"></svg>;
};

export default ForceGraph;
