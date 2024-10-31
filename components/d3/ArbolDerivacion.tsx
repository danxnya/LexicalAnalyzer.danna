import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface DerivationTreeProps {
  data: TreeNode;
  resultado: number;
}

const DerivationTree: React.FC<DerivationTreeProps> = ({ data, resultado }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Limpiar contenido previo

    const width = 800;
    const height = 600;

    const treeLayout = d3.tree<TreeNode>().size([width - 100, height - 100]);
    const root = d3.hierarchy<TreeNode>(data);

    treeLayout(root);

    const g = svg.append("g").attr("transform", "translate(50,50)");

    // Dibujar enlaces manualmente con validación
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => {
        const sourceX = d.source.x ?? 0;
        const sourceY = d.source.y ?? 0;
        const targetX = d.target.x ?? 0;
        const targetY = d.target.y ?? 0;

        return `M ${sourceX},${sourceY} 
                V ${(sourceY + targetY) / 2} 
                H ${targetX} 
                V ${targetY}`;
      })
      .attr("stroke", "#ccc")
      .attr("fill", "none");

    // Dibujar nodos con estilos y transiciones
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
      .on("mouseover", function (event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 20)
          .style("fill", "#c6aae8")
          .style("opacity", 1)
          .ease(d3.easeElasticOut.amplitude(3).period(2));
      })
      .on("mouseout", function (event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 10)
          .style("fill", "#c6aae8")
          .style("opacity", 0.7)
          .ease(d3.easeElasticOut.amplitude(3).period(2));
      });

    node.append("circle")
      .attr("r", 10)
      .style("fill", "#c6aae8")
      .style("opacity", 0.7);

    node.append("text")
      .attr("dy", "0.35em")
      .attr("x", 13)
      .attr("y", (d) => (d.children ? -20 : 20))
      .text((d) => d.data.name)
      .style("text-anchor", "start")
      .style("font-weight", "bold")
      .style("fill", "#C5C5C5")
      .style("font-family", "Font");

    // Mostrar el resultado de la expresión en el centro del árbol
    g.append("text")
      .attr("x", width / 8)
      .attr("y", height / 2 + 50)
      .attr("class", "resultado")
      .style("fill", "#FFFFFF")
      .style("font-weight", "bold")
      .text(`Resultado: ${resultado}`);

  }, [data, resultado]);

  return <svg ref={svgRef} width="800" height="600" className='bg-color-black'></svg>;
};

export default DerivationTree;
