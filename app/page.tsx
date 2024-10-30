"use client";

import React, { useState, useEffect } from 'react';
import { BorderBeam } from "@/components/magic-ui/border-beam";
import ForceGraph from "@/components/d3/ForceGraph";
import Menu from "@/components/Menu";
import { AFN } from "@/ts/AFN";
import TypingAnimation from '@/components/magic-ui/typing-animation';
import ShineBorder from "@/components/magic-ui/shine-border";
import WordPullUp from '@/components/magic-ui/word-pull-up';
import ForceGraphMuestra from '@/components/d3/ForceGraphMuestra';
import AFN1 from '@/public/muestraAFN';

export default function Home() {
  const [afns, setAFNs] = useState<AFN[]>([]);
  const [key, setKey] = useState(0);

  const handleAFNCreated = (newAFN: AFN) => {
    setAFNs(prevAFNs => [...prevAFNs, newAFN]);
  };

  const handleAFNJoined = (modifiedAFN: AFN) => {
    setAFNs(prevAFNs => {
        // Verificar si el AFN modificado ya existe
        const existingAFNIndex = prevAFNs.findIndex(afn => afn.idAFN === modifiedAFN.idAFN);
        
        if (existingAFNIndex !== -1) {
            // Si existe, reemplazarlo
            return prevAFNs.map((afn, index) => 
                index === existingAFNIndex ? modifiedAFN : afn
            ).filter(afn => afn.edosAFN.size > 0);
        } else {
            // Si no existe, añadir el nuevo AFN
            return [...prevAFNs, modifiedAFN].filter(afn => afn.edosAFN.size > 0);
        }
    });
  };

  useEffect(() => {
    // Forzar la recarga de los gráficos cada vez que se añade un nuevo AFN
    setKey(prevKey => prevKey + 1);
  }, [afns]);

  const getGridColumns = (count: number) => {
    return "grid-cols-[repeat(auto-fit,minmax(250px,1fr))] grid-auto-rows-[minmax(250px,1fr)]";
  };

  return (
    <div className="grid gap-1 min-h-screen h-full">
      <div className="col-span-5 items-center justify-center mt-2">
        <TypingAnimation
          className="text-4xl font-bold text-black"
          text="Proyecto Compiladores"
          duration={100}
        />
      </div>
      <div className="col-span-5 row-span-4 row-start-2 h-full">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg">

          {/*Grafo pureba o Grafo creado*/}
          {afns.length === 0 ? (
            <div className={`grid ${getGridColumns(afns.length)} gap-3 w-full h-full p-4`}>
              <div className="rounded-lg p-2 flex flex-col bg-afn border-2 border-black h-full overflow-auto">
                <WordPullUp className="text-3xl font-bold text-afn text-center" words="AFN muestra" />
                <div className="flex-grow flex justify-center items-center w-full max-w-full max-h-[70vh] max-w-[90vw] overflow-auto">
                  <ForceGraphMuestra afn1={AFN1} />
                </div>
              </div>
            </div>
          ) : (
            <div className={`grid ${getGridColumns(afns.length)} gap-3 w-full h-full p-4`}>
              {afns.map((afn, index) => (
                <div key={`${afn.idAFN}-${key}`} className="rounded-lg p-2 flex flex-col bg-afn border-2 border-black h-full overflow-auto">
                  <WordPullUp className="text-3xl font-bold text-afn text-center" words={`AFN ${afn.idAFN}`} />
                  <div className="flex-grow flex justify-center items-center w-full max-w-full max-h-[70vh] max-w-[90vw] overflow-auto">
                    {/* Renderizar grafo muestra o los creados*/}
                    <ForceGraph afn={afn} key={`graph-${afn.idAFN}-${key}`}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/*<BorderBeam size={500} borderWidth={3} colorFrom='#8839ef' colorTo='#04a5e5'/>*/}
        </div>
      </div>
      <div className="col-span-5 row-start-6 self-end flex justify-center items-center">
        <Menu onAFNCreated={handleAFNCreated} afns={afns} onAFNJoined={handleAFNJoined}/>
      </div>
    </div>
  );
}
