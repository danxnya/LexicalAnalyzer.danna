"use client"; // Deja usar el cliente

import * as React from "react";
import { Circle } from '@mui/icons-material';

const Symbology: React.FC = () => {
    return (
        <div className="py-2">
            <div className="flex flex-row items-center">
                <Circle sx={{ color: "#907aa9", fontSize: 20 }} />
                <p className="text-black text-xl ml-3">Estado inicial</p>
            </div>
            <div className="flex flex-row items-center">
                <Circle sx={{ color: "#56949f", fontSize: 20 }} />
                <p className="text-black text-xl ml-3">Estado final</p>
            </div>
            <div className="flex flex-row items-center">
                <Circle sx={{ color: "#b4637a", fontSize: 20 }} />
                <p className="text-black text-xl ml-3">Estado normal</p>
            </div>
        </div>
    );
}

export default Symbology;