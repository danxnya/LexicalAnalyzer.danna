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

// Actualizamos el TextField para que sea morado
declare module '@mui/material/FormControl' {
    interface FormControlPropsColorOverrides {
        purple: true;
    }
}

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
        }
    };

    return (
        <div>
            <div className="flex justify-center z-10">
                <HyperText
                    className="text-4xl font-bold text-black"
                    text="Analizador Léxico"
                />
            </div>         
            <div className="grid grid-cols-3 grid-rows-1 gap-4">
                <div className="flex w-full">
                    <TextField
                        id="cadena-ingresada"
                        label="Ingresa una cadena"
                        multiline
                        fullWidth
                        variant="filled"
                        color="purple"
                        maxRows={30}
                        value={input1}
                        onChange={handleInput1Change}
                    />
                </div>
                <div className="flex items-center justify-center">               
                    <div className="grid grid-cols-1 grid-rows-3 gap-4">
                        <div className="flex items-center justify-center text-black">
                            <Typography variant="h5" component="h2"> Sube tu archivo JSON </Typography>
                        </div>
                        <div className="flex items-center justify-center text-center flex-col">
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
                            <Typography variant="caption" className="text-black mt-2">
                                    Solo archivos JSON
                            </Typography>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button
                                variant="contained"
                                className="bg-custom1 text-custom1 buttons-space items-center justify-center h-full"
                                size="large"
                                startIcon={<Abc />}
                                onClick={handleAnalyze}
                                disabled={!analizador}
                            >
                                Analizar
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                        <TableContainer style={{ maxHeight: '92vh' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Caracter</TableCell>
                                        <TableCell>Token</TableCell>    
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lexemas.map((lexema, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{lexema.caracter}</TableCell>
                                            <TableCell>{lexema.token}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>
        </div>
    );
}

export default page;