"use client"; // Deja usar el cliente

// Importamos los componentes necesarios de React y Material UI
import * as React from "react";
import { Button, Modal, Typography, Box, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import PulsatingButton from "@/components/magic-ui/pulsating-button";
import { style } from "@/components/Theme";

// Importamos los TS que dan funcionalidad al componente
import { AFN } from "@/ts/AFN";
import { ExpresionRegular } from "@/ts/ExpresionRegular";

// Actualizamos el TextField para que sea morado
declare module '@mui/material/TextField' {
    interface TextFieldPropsColorOverrides {
        purple: true;
    }
}

const ERtoAFNButton: React.FC<{ onAFNCreated: (afn: AFN) => void}> = ({ onAFNCreated }) => {
    // Contador AFN local
    const [hasAFN, setHasAFN] = React.useState(false);

    // Estados para el Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Estados para los inputs
    const [input1, setInput1] = React.useState('');

    // Manejadores para los inputs
    const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Eliminar saltos de linea
        const cleanedValue = event.target.value.replace(/\n/g, '').trim();
        setInput1(cleanedValue);
    };

    // Función para manejar la creación del AFN
    const handleCreateAFNfromER = () => {
        if(input1){
            const ER = new ExpresionRegular(input1);

            if (ER.Parse()) {
                const afn = ER.getResult();
                onAFNCreated(afn);
            } else {
                console.log(ER.Parse());
            }
        }

        setHasAFN(true);

        // Reinciar los inputs
        setInput1('');

        // Cerramos el modal
        handleClose();
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
                <Add /><Typography variant="button" className="ml-2">ER a AFN</Typography>
            </PulsatingButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Crear AFN a partir de una Expresión Regular
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Ingresa la expresión regular
                    </Typography>
                    <TextField
                        label="Expresión Regular"
                        value={input1}
                        onChange={handleInput1Change}
                        fullWidth
                        color="purple"
                        margin="normal"
                    />
                    <Button 
                        variant="contained"
                        className="bg-custom1 py-2 px-6 mt-1"
                        endIcon={<Add />}
                        onClick={handleCreateAFNfromER}>
                            Crear AFN
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default ERtoAFNButton;