"use client";

import * as React from "react";
import LetterPullup from "@/components/magic-ui/letter-pullup";
import GridPattern from "@/components/magic-ui/animated-grid-pattern";
import { Button, TableRow, TableHead, TableContainer, Paper, TextField, Typography, TableCell, TableBody } from "@mui/material";
import { style } from "@/components/Theme";
import { Calculate } from "@mui/icons-material";
import { parseConPostfijo } from "@/ts/CalculadoraG";
import { ejecutarAlerta } from "@/components/alerts/alertas";
import DerivationTree from "@/components/d3/ArbolDerivacion";
import { TreeNode } from "@/ts/Tipos";

// Actualizamos el TextField para que sea morado
declare module '@mui/material/FormControl' {
    interface FormControlPropsColorOverrides {
        purple: true;
    }
}

const page: React.FC = () => {
    // Estado para el input
    const [input1, setInput1] = React.useState('');

    // Agregamos estados para los resultados
    const [opPos, setOpPos] = React.useState('');
    const [res, setRes] = React.useState('');
    const [isMounted, setIsMounted] = React.useState(false);
    const [resultadoFinal, setResultadoFinal] = React.useState<number>(0);
    const [treeData, setTreeData] = React.useState<TreeNode | null>(null);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput1(event.target.value);
    };

    const handleCalculate = () => {
        if (input1) {
            let resultado = parseConPostfijo(input1);
            if (resultado.valid) {
                setOpPos(resultado.postfijo.toString());
                setRes(resultado.resultado.toString());
                setResultadoFinal(resultado.resultado);
                setTreeData(resultado.tree);
                ejecutarAlerta('success', 'Operación exitosa', 'bottom-end');
                // Reiniciar los inputs
                setInput1('');
            } else {
                // Alerta
                ejecutarAlerta('error', 'Expresión no válida', 'bottom-end');
                // Reiniciar los inputs
                setInput1('');
            }
        }
    }

    return (
        <div>
            <div className="flex justify-center z-10">
                <LetterPullup 
                    words="Calculadora postfija"
                    className="text-6xl font-bold text-black"
                />
            </div>         
            <div className="grid grid-cols-2 grid-rows-1 gap-4">
                <div className="items-center justify-center max-w-md mx-auto">
                    <div className="grid grid-cols-1 gap-2 w-full">
                        <div className="flex items-center justify-center text-black mb-2">
                            <Typography variant="h5" component="h2">Ingresa una operación</Typography>
                        </div>
                        <div className="flex items-center justify-center text-center flex-col mb-2">
                            <TextField
                                id="operacion"
                                label="Ingresa una operación aritmetica"
                                variant="filled"
                                color="purple"
                                sx={{
                                    width: '100%',          // Ancho total del contenedor
                                    height: '100px',         // Altura mayor para el TextField
                                    overflowY: 'auto',       // Agrega scroll si el contenido excede la altura
                                }}
                                value={input1}
                                onChange={handleInput1Change}
                            />
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer style={{ maxHeight: "40vh" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Operación postfija</TableCell>
                                            <TableCell>Resultado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isMounted && (
                                            <TableRow>
                                                <TableCell>{opPos}</TableCell>
                                                <TableCell>{res}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </TableContainer>
                            </Paper>
                        </div>
                        <div className="flex items-center justify-center w-full mt-2">
                            <Button
                                variant="contained"
                                className="bg-custom1 text-custom1 items-center justify-center h-full"
                                size="large"
                                startIcon={<Calculate />}
                                onClick={handleCalculate}
                                disabled={!input1}
                            >
                                Calcular
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="h-max" style={{ maxHeight: '85vh', overflow: 'auto' }}>
                    {treeData && <DerivationTree data={treeData} resultado={resultadoFinal} />}
                </div>
            </div>
            <GridPattern maxOpacity={0.5} className="grid-config"/>
        </div>
    )
}

export default page;