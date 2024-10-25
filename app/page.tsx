"use client";

import React, { useState, useEffect } from 'react';
import { BorderBeam } from "@/components/magic-ui/border-beam";
import ForceGraph from "@/components/d3/ForceGraph";
import Menu from "@/components/Menu";
import { AFN } from "@/ts/AFN";
import ShineBorder from "@/components/magic-ui/shine-border";
import WordPullUp from '@/components/magic-ui/word-pull-up';

export default function Home() {
  const [afns, setAFNs] = useState<AFN[]>([]);
  const [key, setKey] = useState(0);

  const handleAFNCreated = (newAFN: AFN) => {
    setAFNs(prevAFNs => [...prevAFNs, newAFN]);
  };

  const handleAFNJoined = (modifiedAFN: AFN) => {
    setAFNs(prevAFNs => {
      // Filtrar los AFNs para eliminar el que ha sido unido si no tiene estados
      return prevAFNs.filter(afn => {
        // Si es el AFN modificado, retornamos el modificado
        if (afn.idAFN === modifiedAFN.idAFN){
          return modifiedAFN; // Retornamos el AFN1 modificado
        }
        return afn; // Retorna el resto de los AFNs sin cambios
      }).filter(afn => afn.edosAFN.size > 0);
    });
  };

  const handleAFNCerradura = (modifiedAFN: AFN) => {
    return modifiedAFN;
  }

  useEffect(() => {
    // Forzar la recarga de los gráficos cada vez que se añade un nuevo AFN
    setKey(prevKey => prevKey + 1);
  }, [afns]);

  const getGridColumns = (count: number) => {
    return "grid-cols-[repeat(auto-fit,minmax(250px,1fr))] grid-auto-rows-[minmax(250px,1fr)]";
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 gap-2 min-h-screen h-full">
      <div className="col-span-5 row-span-4 h-full">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border-black md:shadow-xl">
          <div className={`grid ${getGridColumns(afns.length)} gap-3 w-full h-full p-4`}>
            {afns.map((afn, index) => (
              <div key={`${afn.idAFN}-${key}`} className="bg-black rounded-lg p-2 flex flex-col border-2 border-#717d7e h-full overflow-auto">
                <WordPullUp className="text-3xl font-bold text-white text-center" words={`AFN ${afn.idAFN}`} />
                <div className="flex-grow flex justify-center items-center w-full max-w-full max-h-[70vh] max-w-[90vw] overflow-auto">
                  <ForceGraph afn={afn} key={`graph-${afn.idAFN}-${key}`}/>
                </div>
              </div>
            ))}
          </div>
          {/*<BorderBeam size={500} borderWidth={3} colorFrom='#8839ef' colorTo='#04a5e5'/>*/}
        </div>
      </div>
      <div className="col-span-5 row-start-5 self-end flex justify-center items-center">
        <Menu onAFNCreated={handleAFNCreated} afns={afns} onAFNJoined={handleAFNJoined}/>
      </div>
    </div>
  );
}
