"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeData {
  name: string;
  children?: TreeData[];
}

interface TreeEntry {
  tree: TreeData;
  resultado: string;
}

const DerivationTrees: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const zoom = d3.zoom<SVGSVGElement, unknown>()
  .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
    d3.select(svgRef.current!.querySelector('g'))
      .attr("transform", event.transform.toString());
  });

  useEffect(() => {
    const width = 1000;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current!)
      .attr('width', width * 2)
      .attr('height', height)
      .call(zoom)
      .append("g");

    const treeLayout = d3.tree<TreeData>().nodeSize([100, 100]);

    fetch('../dump/tree.json')
      .then(response => response.json())
      .then((data: TreeEntry[]) => {
        const horizontalSpacing = 900;

        data.forEach((entry, index) => {
          const treeData = entry.tree;
          const resultado = entry.resultado;

          const root = d3.hierarchy<TreeData>(treeData);
          const treeLayoutData = treeLayout(root);
          const nodes = treeLayoutData.descendants();
          const links = treeLayoutData.links();

          const g = svg.append("g")
            .attr("transform", `translate(${index * horizontalSpacing}, 50)`);

          const node = g.selectAll('.node')
            .data(nodes)
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .on('mouseover', function (event, d) {
              d3.select(this).select('circle')
                .transition()
                .duration(200)
                .attr('r', 20)
                .style('fill', '#c6aae8')
                .style('opacity', 1)
                .ease(d3.easeElasticOut.amplitude(3).period(2));
            })
            .on('mouseout', function (event, d) {
              d3.select(this).select('circle')
                .transition()
                .duration(200)
                .attr('r', 10)
                .style('fill', '#c6aae8')
                .style('opacity', 0.7)
                .ease(d3.easeElasticOut.amplitude(3).period(2));
            });

          node.append('circle').attr('r', 10);
          node.append('text')
            .attr('dy', '0.35em')
            .attr('x', 13)
            .attr('y', d => d.children ? -20 : 20)
            .text(d => d.data.name)
            .style('text-anchor', 'start')
            .style('font-weight', 'bold')
            .style('fill', '#C5C5C5')
            .style('font-family', 'Font');

          g.selectAll('.link')
            .data(links)
            .enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d3.linkVertical<TreeData, d3.HierarchyPointLink<TreeData>>()
                .x(d => d.source.x)
                .y(d => d.target.y) as any);

          g.append("text")
            .attr("x", width / 8)
            .attr("y", height / 2 + 50)
            .attr("class", "resultado")
            .style("fill", "#FFFFFF")
            .style("font-weight", "bold")
            .text(`Resultado: ${resultado}`);
        });
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));
  }, []);

  return (
    <div style={{ height: '100vh', backgroundColor: '#11111B' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DerivationTrees;
