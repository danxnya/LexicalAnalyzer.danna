"use client"; // Deja usar el cliente

import * as React from "react";
import { createTheme } from "@mui/material/styles";

// Estilos modal
export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    heigth: 600,
    bgcolor: '#FFFFFF',
    color: 'black',
    border: '3px solid #B3B3B3',
    boxShadow: 24,
    p: 4,
};

// Tema morado
declare module '@mui/material/styles' {
    interface Palette {
        purple: Palette['primary'];
    }
    interface PaletteOptions {
        purple: PaletteOptions['primary'];
    }
}

const theme = createTheme({
    palette: {
        purple: {
            main: "#907aa9",
            light: "#907aa9",
            dark: "#907aa9",
            contrastText: "#907aa9",
        },
    },
});