"use client";   // Deja usar el cliente

// Importamos los componentes necesarios de React, Material UI y MagicUI
import * as React from "react";
import { Button, Modal, Typography, Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import { Emergency } from "@mui/icons-material";
import { style } from "@/components/Theme"
import ShinyButton from "@/components/magic-ui/shiny-button";
import { ejecutarAlerta } from "@/components/alerts/alertas";

// Importamos los TS que dan funcionalidad al componente
import { AFN } from "@/ts/AFN";

// Actualizamos el TextField para que sea morado
declare module '@mui/material/FormControl' {
    interface FormControlPropsColorOverrides {
        purple: true;
    }
}

interface CerraduraKleeneAFNButtonProps {
    afns: AFN[];
    onAFNCerraduraKleene: (newAFN : AFN) => void;
}

const CerraduraOpcionalAFNButton : React.FC<CerraduraKleeneAFNButtonProps> = ({ afns, onAFNCerraduraKleene }) => {
    // Estados para el Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    // Estado para el input
    const [afn1, setAFN] = React.useState('');

    const handleAFNChange = (event: SelectChangeEvent) => {
        setAFN(event.target.value);
    }

    const handleCerraduraKleeneAFN = () => {
        const selectedAFN = afns.find(afn => afn.idAFN.toString() === afn1);
        if(selectedAFN) {
            selectedAFN.cerraduraKleene();
            onAFNCerraduraKleene(selectedAFN);
            // Alerta
            ejecutarAlerta('success', 'Cerradura de Kleene Exitosa', 'bottom-end');
            setAFN('');
            handleClose();
        } else {
            // Alerta
            ejecutarAlerta('error', 'No se ha seleccionado el AFN', 'bottom-end');
            setAFN('');
            handleClose();
        }
    };

    return(
        <div>
            {/*Cambia los botones (deshabilitar)*/}
            {afns.length < 1 ? (
                <Button 
                    className="bg-custom1 text-custom1 buttons-space items-center justify-center h-full"
                    sx={{
                        "&:disabled": {
                            color: "#4D4D4D",
                            backgroundColor: "#E6E6E6"
                        }
                    }}
                    variant="contained"
                    startIcon={<Emergency />}
                    onClick={handleOpen}
                    disabled={afns.length < 2}>
                        Cerradura de Kleene
                </Button>
                ) : (     
                <div onClick={handleOpen} className="disabled">
                    <ShinyButton
                        className="bg-custom1 text-custom1 buttons-space items-center justify-center h-full"
                    >
                        <span className="text-custom1">
                            <Emergency /> C. de Kleene
                        </span>
                    </ShinyButton>
                </div>
                )
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Cerradura de Kleene
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Selecciona el AFN al que se le aplicará la cerradura de Kleene
                        </Typography>
                        <FormControl sx={{ mt: 2, minWidth: 120 }} size="small" color="purple">
                            <InputLabel id="afn1-select-label">AFN</InputLabel>
                            <Select
                                labelId="afn1-select-label"
                                id="afn-select"
                                value={afn1}
                                label="AFN 1"
                                onChange={handleAFNChange}
                            >
                                {afns.map((afn) => (
                                    <MenuItem key={afn.idAFN} value={afn.idAFN.toString()}>
                                        AFN {afn.idAFN}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    <Box sx={{ mt:2 }}>
                        <Button
                            variant="contained"
                            className="bg-custom1 py-2 px-6"
                            endIcon={<Emergency />}
                            onClick={handleCerraduraKleeneAFN}
                        >
                            Realizar cerradura
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default CerraduraOpcionalAFNButton;

