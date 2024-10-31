"use client"; // Deja usar el cliente

import * as React from "react";

// Componentes React
import { Stack } from "@mui/material";

// Componentes personalizados
import Symbology from "@/components/Symbology";
import AFNButton from "@/components/AFNButton";
import ERtoAFNButton from "@/components/ERtoAFNButton";
import DeleteAFNButton from "@/components/DeleteAFNButton";
import JoinAFNButton from "@/components/JoinAFNButton";
import ConcatenateAFNButton from "@/components/ConcatenateAFNButton";
import CerraduraKleeneAFNButton from "@/components/CerraduraKleeneButton";
import CerraduraPositivaAFNButton from "@/components/CerraduraPositivaButton";
import CerraduraOpcionalAFNButton from "@/components/CerraduraOpcionalButton";
import JoinAFNsButton from "@/components/JoinAFNsButton";
import AFNtoAFDButton from "@/components/AFNtoAFDButton";
import MoreButton from "@/components/MoreButton";

// Importamos los TS que dan funcionalidad al componente
import { AFN } from "@/ts/AFN";

interface MenuProps {
    onAFNCreated: (afn: AFN) => void;
    afns: AFN[];
    onAFNJoined: (modifiedAFN: AFN) => void;
}

// Definimos el componente como React.FC (Functional Component)
const Menu: React.FC<MenuProps> = ({ onAFNCreated, afns, onAFNJoined }) => {    
    return (
        <div className="grid grid-cols-[auto_1fr] grid-rows-1">
            <div className="self-start w-fit h-fit flex mr-4">
                <Symbology />
            </div>
            <div className="mt-2 ml-4">
                <Stack direction="row" spacing={2}>
                    <Stack direction="column" spacing={2}>
                        <AFNButton onAFNCreated={onAFNCreated} />
                        <CerraduraKleeneAFNButton afns={afns} onAFNCerraduraKleene={onAFNJoined}/>
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <ERtoAFNButton onAFNCreated={onAFNCreated} />
                        <CerraduraPositivaAFNButton afns={afns} onAFNCerraduraPositiva={onAFNJoined} />
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <DeleteAFNButton afns={afns} onDeleteAFN={onAFNJoined} />
                        <CerraduraOpcionalAFNButton afns={afns} onAFNCerraduraOpcional={onAFNJoined}/>  
                    </Stack>
                    <Stack direction="column" spacing={2}> 
                        <JoinAFNButton afns={afns} onAFNJoined={onAFNJoined} />
                        <JoinAFNsButton afns={afns} onAFNJoined={onAFNJoined} />
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <ConcatenateAFNButton afns={afns} onAFNConcatenated={onAFNJoined} />
                        <AFNtoAFDButton afns={afns} onAFNtoAFD={onAFNJoined} />
                    </Stack>
                    <Stack direction="column" spacing={2}>
                        <MoreButton />
                    </Stack>
                </Stack>
            </div>
        </div>
    );
};

export default Menu;
