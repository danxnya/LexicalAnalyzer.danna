"use client"; // Deja usar el cliente

import * as React from "react";
import { Button, Modal, Typography, Box } from "@mui/material";
import { Hub } from "@mui/icons-material";
import { style } from "@/components/Theme"
import ShinyButton from "@/components/magic-ui/shiny-button";

// Importamos los TS que dan funcionalidad al componente
import { AFN } from "@/ts/AFN";

// Actualizamos el TextField para que sea morado
declare module '@mui/material/FormControl' {
    interface FormControlPropsColorOverrides {
        purple: true;
    }
}

interface JoinAFNsButtonProps {
    afns: AFN[];
    onAFNJoined: (newAFN: AFN) => void;
}

const JoinAFNsButton: React.FC<JoinAFNsButtonProps> = ({ afns, onAFNJoined}) => {
    // Estados para el Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleJoinAFNs = () => {
        let Aux: Set<AFN> = new Set<AFN>();

        for (let afn of afns) {
            Aux.add(afn);
        }

        let NewRes: AFN = new AFN().UnirER(Aux);

        for (let afn of afns) {
            afn.borrarAFD();
        }

        onAFNJoined(NewRes);
        handleClose();
    };

    return (
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
                    startIcon={<Hub />}
                    onClick={handleOpen}
                    disabled={afns.length < 2}>
                        Unir AFNs
                </Button>
                ) : (     
                <div onClick={handleOpen} className="disabled">
                    <ShinyButton
                        className="bg-custom1 text-custom1 buttons-space items-center justify-center h-full"
                    >
                        <span className="text-custom1">
                            <Hub /> Unir AFNs
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
                        Unir AFNs para Análisis Léxico
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        ¿Estas seguro?
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            className="bg-custom1 py-2 px-6"
                            endIcon={<Hub />}
                            onClick={handleJoinAFNs}
                        >
                            Si
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default JoinAFNsButton;