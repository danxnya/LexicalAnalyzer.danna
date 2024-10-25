"use client"; // Deja usar el cliente

// Importamos los componentes necesarios de React y Material UI
import * as React from "react";
import { Button, Modal, Typography, Box, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { BorderBeam } from "@/components/magic-ui/border-beam";

// Importamos los TS que dan funcionalidad al componente
import { AFN } from "@/ts/AFN";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    heigth: 600,
    bgcolor: '#333',
    color: 'fff',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AFNButton: React.FC<{ onAFNCreated: (afn: AFN) => void}> = ({ onAFNCreated }) => {
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

        if(input1 && input2){
            afn.creaAFNBasico(input1, input2);
            console.log(afn.imprimirAFN());
        } else if (input1){
            afn.creaAFNBasico(input1);
        } else if (input2){
            afn.creaAFNBasico(input2);
        } else {
            console.log("error");
        }

        onAFNCreated(afn);
        // Reinciar los inputs
        setInput1('');
        setInput2('');

        // Cerramos el modal
        handleClose();
    }; 

    return(
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border-black bg-background-black md:shadow-xl">
                <Button 
                    sx={{ backgroundColor: "black" }}
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpen}>
                        Crear AFN
                </Button>
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
                            margin="normal"
                        />
                        <TextField
                            label="Número o simbolo 2"
                            value={input2}
                            onChange={handleInput2Change}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="contained" onClick={handleCreateAFN}>Crear</Button>
                    </Box>
                </Modal>
                <BorderBeam size={100} duration={8} delay={9} borderWidth={1.2} colorFrom='#8839ef' colorTo='#04a5e5'/>
        </div>
    );
};

export default AFNButton;