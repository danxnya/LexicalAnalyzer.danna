"use client"; // Deja usar el cliente

// Importamos los componentes necesarios de React y Material UI
import * as React from "react";
import { Button, Modal, Typography, Box, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import PulsatingButton from "@/components/magic-ui/pulsating-button";
import { style } from "@/components/Theme";
import { ejecutarAlerta } from "@/components/alerts/alertas";

// Importamos los TS que dan funcionalidad al componente
import { AFN } from "@/ts/AFN";
import AFN1 from '@/public/muestraAFN';

// Actualizamos el TextField para que sea morado
declare module '@mui/material/TextField' {
    interface TextFieldPropsColorOverrides {
        purple: true;
    }
}

const AFNButton: React.FC<{ onAFNCreated: (afn: AFN) => void}> = ({ onAFNCreated }) => {
    // Contador AFN local
    const [hasAFN, setHasAFN] = React.useState(false);

    // Estados para el Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Estados para los inputs
    const [input1, setInput1] = React.useState('');
    const [input2, setInput2] = React.useState('');

    // Manejadores para los inputs
    const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput1(event.target.value);
    };

    const handleInput2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput2(event.target.value);
    };

    // Función para manejar la creación del AFN
    const handleCreateAFN = () => {
        const afn = new AFN();

        const value1 = (input1.length > 1) ? parseInt(input1) : input1;
        const value2 = (input2.length > 1) ? parseInt(input2) : input2;

        console.log(typeof value1, typeof value2);
        
        if (input1 && input2) {
            if (typeof value1 === 'number' && typeof value2 === 'number')
                afn.creaAFNBasico(value1, value2);
            else if (typeof value1 === 'string' && typeof value2 === 'string')
                afn.creaAFNBasico(value1, value2);
        } else if (input1) {
            if (typeof value1 === 'number')
                afn.creaAFNBasico(value1);
            else if (typeof value1 === 'string')
                afn.creaAFNBasico(value1);
        } else if (input2) {
            if (typeof value2 === 'number')
                afn.creaAFNBasico(input2);
            else if (typeof value2 === 'string')
                afn.creaAFNBasico(input2);
        } else {
            console.log("error");
        }

        onAFNCreated(afn);
        setHasAFN(true);

        // Reinciar los inputs
        setInput1('');
        setInput2('');

        // Cerramos el modal
        handleClose();

        // Alerta
        ejecutarAlerta('success', 'AFN creado', 'bottom-end');
    };

    // Deshabilitar pulso si ya hay un AFN
    const duration = hasAFN ? "0s" : "5s";

    return(
        <div>
            <PulsatingButton
                className="bg-custom1 text-custom1 buttons-space items-center justify-center h-full"
                pulseColor="#B3B3B3"
                duration={duration}
                onClick={handleOpen}
            >
                <Add /><Typography variant="button" className="ml-2">CREAR AFN</Typography>
            </PulsatingButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Crear AFN
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Ingresa un número o simbolo para crear el AFN
                    </Typography>
                    <TextField
                        label="Número o simbolo 1"
                        value={input1}
                        onChange={handleInput1Change}
                        fullWidth
                        color="purple"
                        margin="normal"
                    />
                    <TextField
                        label="Número o simbolo 2"
                        value={input2}
                        onChange={handleInput2Change}
                        fullWidth
                        color="purple"
                        margin="normal"
                    />
                    <Button 
                        variant="contained"
                        className="bg-custom1 py-2 px-6 mt-1"
                        endIcon={<Add />}
                        onClick={handleCreateAFN}>
                            Crear AFN
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default AFNButton;