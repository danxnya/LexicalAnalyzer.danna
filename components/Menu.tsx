"use client"; // Deja usar el cliente

import * as React from "react";
import { Button, Stack } from "@mui/material";
import AFNButton from "@/components/AFNButton";
import JoinAFNButton from "@/components/JoinAFNButton";
import ConcatenateAFNButton from "@/components/ConcatenateAFNButton";
import { AFN } from "@/ts/AFN";
import CerraduraPositivaAFNButton from "@/components/CerraduraPositivaButton";
import CerraduraOpcionalAFNButton from "@/components/CerraduraOpcionalButton";
import CerraduraKleeneAFNButton from "@/components/CerraduraKleeneButton";
import AFNtoAFDButton from "@/components/AFNtoAFDButton";

interface MenuProps {
    onAFNCreated: (afn: AFN) => void;
    afns: AFN[];
    onAFNJoined: (modifiedAFN: AFN) => void;
}

// Definimos el componente como React.FC (Functional Component)
const Menu: React.FC<MenuProps> = ({ onAFNCreated, afns, onAFNJoined }) => {    
    return (
        <div>
            <Stack direction="row" spacing={2}>
                <AFNButton onAFNCreated={onAFNCreated} />
                <JoinAFNButton afns={afns} onAFNJoined={onAFNJoined} />
                <ConcatenateAFNButton afns={afns} onAFNConcatenated={onAFNJoined} />
            </Stack>
            <Stack direction="row" spacing={2}>
                <CerraduraPositivaAFNButton afns={afns} onAFNCerraduraPositiva={onAFNJoined} />
                <CerraduraOpcionalAFNButton afns={afns} onAFNCerraduraOpcional={onAFNJoined}/>
                <CerraduraKleeneAFNButton afns={afns} onAFNCerraduraKleene={onAFNJoined}/>
                <AFNtoAFDButton afns={afns} onAFNtoAFD={onAFNJoined} />
            </Stack>
        </div>
    );
};

export default Menu;
