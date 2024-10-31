"use client"; // Deja usar el cliente

import * as React from "react";
import { useState } from "react";
import HyperText from "@/components/magic-ui/hyper-text";
import { GridPattern } from "@/components/magic-ui/animated-grid-pattern";
import { Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, Paper } from "@mui/material";
import { Abc, Upload, Check } from "@mui/icons-material";
import { style } from "@/components/Theme";
import { AnalizadorLexico } from "@/ts/AnalizadorLexico";
import { SimbolosEspeciales } from "@/ts/SimbolosEspeciales";
import { ejecutarAlerta } from "@/components/alerts/alertas";

// Actualizamos el TextField para que sea morado
declare module '@mui/material/FormControl' {
    interface FormControlPropsColorOverrides {
        purple: true;
    }
}

// Estilos personalizados
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#FFFFFF',
      textAlign: 'center', // Color para las filas impares
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#E6E6E6',
      textAlign: 'center', // Color para las filas pares
    },
  }));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    '&.MuiTableCell-head': {
      backgroundColor: '#999999', // Color para el encabezado
      color: theme.palette.common.white,
      fontSize: '1.2rem',
      fontWeight: 'bold'
    },
}));

const page: React.FC = () => {
    // Estados para carga y lectura del JSON
    const [jsonContent, setJsonContent] = useState<any>(null);
    const [lexemas, setLexemas] = useState<{ caracter: string, token: string }[]>([]); // Nuevo estado para almacenar lexemas y tokens
    const [lexema, setLexema] = useState<string>(''); // Definir el estado lexema
    const [analizador, setAnalizador] = useState<AnalizadorLexico | null>(null);

    // Estados para los inputs
    const [input1, setInput1] = React.useState('');

    // Manejadores para los inputs
    const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput1(event.target.value);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (content) {
                    const json = JSON.parse(content as string);
                    setJsonContent(json);
                    const nuevoAnalizador = new AnalizadorLexico(json);
                    setAnalizador(nuevoAnalizador);
                }
            };
            reader.readAsText(file);
            ejecutarAlerta('success', 'Archivo subido correctamente', 'bottom-end');
        }
    };

    const handleAnalyze = () => {
        if (analizador) {
            analizador.SetSigma(input1);
            let result;
            const nuevosLexemas: { caracter: string, token: string }[] = []; // Arreglo temporal para almacenar los resultados
            do {
                result = analizador.yylex();
                nuevosLexemas.push({ caracter: analizador.getLexema(), token: String(result) }); // Almacena el lexema y el token
            } while (result !== SimbolosEspeciales.FIN);
            setLexemas(nuevosLexemas); // Actualiza el estado con los nuevos lexemas
            setLexema(nuevosLexemas.map(l => `${l.caracter}, ${l.token}`).join("\n")); // Actualiza el estado de lexema para el texto
            ejecutarAlerta('success', 'Cerradura de analizada', 'bottom-end');
        }
    };

    return (
        <div>
            <div className="flex justify-center z-10">
                <HyperText
                    className="text-6xl font-bold text-black"
                    text="Analizador Léxico"
                />
            </div>         
            <div className="grid grid-cols-2 grid-rows-1 gap-4">
                <div className="items-center justify-center max-w-md mx-auto">
                    <div className="grid grid-cols-1 gap-2 w-full">
                        <div className="flex items-center justify-center text-black mb-2">
                            <Typography variant="h5" component="h2">Sube tu Automata Finito Determinista</Typography>
                        </div>
                        <div className="flex items-center justify-center text-center flex-col mb-2">
                            <input
                                accept=".json"
                                style={{ display: 'none' }}
                                id="file-input"
                                type="file"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="file-input">
                                <Button 
                                    variant="contained" 
                                    startIcon={!analizador ? <Upload /> : <Check />}
                                    className={`text-custom1 buttons-space items-center justify-center h-full ${analizador ? 'button-upload-ready' : 'button-upload'}`}
                                    component="span"
                                >
                                    Subir Archivo
                                </Button>
                            </label>
                            <Typography variant="caption" className="text-black mt-1">
                                Solo archivos JSON
                            </Typography>
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <TextField
                                id="cadena-ingresada"
                                label="Ingresa una cadena"
                                multiline
                                variant="filled"
                                color="purple"
                                sx={{
                                    width: '100%',          // Ancho total del contenedor
                                    height: '500px',         // Altura mayor para el TextField
                                    overflowY: 'auto',       // Agrega scroll si el contenido excede la altura
                                }}
                                value={input1}
                                onChange={handleInput1Change}
                                disabled={!analizador}
                            />
                        </div>
                        <div className="flex items-center justify-center w-full mt-2">
                            <Button
                                variant="contained"
                                className="bg-custom1 text-custom1 items-center justify-center h-full"
                                size="large"
                                startIcon={<Abc />}
                                onClick={handleAnalyze}
                                disabled={!analizador}
                                sx={{
                                    width: '100%',          // Ancho total del botón
                                    maxWidth: '250px',      // Limite del ancho del botón
                                    height: '50px',         // Altura del botón
                                }}
                            >
                                Analizar
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                        <TableContainer style={{ maxHeight: '90vh' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Caracter</StyledTableCell>
                                        <StyledTableCell>Token</StyledTableCell>    
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lexemas.map((lexema, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>{lexema.caracter}</StyledTableCell>
                                            <StyledTableCell>{lexema.token}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>
            <GridPattern maxOpacity={0.5} className="grid-config"/>
        </div>
    );
}

export default page;