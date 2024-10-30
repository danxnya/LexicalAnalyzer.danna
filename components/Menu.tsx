"use client"; // Deja usar el cliente

import * as React from "react";

// Componentes React
import { Stack } from "@mui/material";
import AFNButton from "@/components/AFNButton";
import DeleteAFNButton from "@/components/DeleteAFNButton";
import JoinAFNButton from "@/components/JoinAFNButton";
import ConcatenateAFNButton from "@/components/ConcatenateAFNButton";
import CerraduraKleeneAFNButton from "@/components/CerraduraKleeneButton";
import CerraduraPositivaAFNButton from "@/components/CerraduraPositivaButton";
import CerraduraOpcionalAFNButton from "@/components/CerraduraOpcionalButton";
import JoinAFNsButton from "@/components/JoinAFNsButton";
import AFNtoAFDButton from "@/components/AFNtoAFDButton";
import Symbology from "@/components/Symbology";

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
        <div className="grid grid-cols-[auto_1fr]">
            <div className="self-start w-fit h-fit flex mr-4">
                <Symbology />
            </div>
            <div>
                <div className="py-2">
                    <Stack direction="row" spacing={2}>
                        <AFNButton onAFNCreated={onAFNCreated} />
                        <DeleteAFNButton afns={afns} onDeleteAFN={onAFNJoined} />
                        <JoinAFNButton afns={afns} onAFNJoined={onAFNJoined} />
                        <ConcatenateAFNButton afns={afns} onAFNConcatenated={onAFNJoined} />
                        <CerraduraKleeneAFNButton afns={afns} onAFNCerraduraKleene={onAFNJoined}/>
                    </Stack>
                </div>
                <div className="py-1">
                    <Stack direction="row" spacing={2}>
                        <CerraduraPositivaAFNButton afns={afns} onAFNCerraduraPositiva={onAFNJoined} />
                        <CerraduraOpcionalAFNButton afns={afns} onAFNCerraduraOpcional={onAFNJoined}/>
                        <JoinAFNsButton afns={afns} onAFNJoined={onAFNJoined} />
                        <AFNtoAFDButton afns={afns} onAFNtoAFD={onAFNJoined} />
                    </Stack>
                </div>
            </div>
        </div>
    );
};

export default Menu;
