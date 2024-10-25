"use client";   // Deja usar el cliente

// Importamos los componentes necesarios de React, Material UI y MagicUI
import * as React from "react";
import { Button, Modal, Typography, Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import { Transform } from "@mui/icons-material";
import ShineBorder from "@/components/magic-ui/shine-border";


// Importamos los TS que dan funcionalidad al componente
import { AFN } from "@/ts/AFN";

// Estilos modal
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

interface AFNtoAFDButtonProps {
    afns: AFN[];
    onAFNtoAFD: (newAFN : AFN) => void;
}

const AFNtoAFDButton : React.FC<AFNtoAFDButtonProps> = ({ afns, onAFNtoAFD }) => {
    // Estados para el Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    // Estado para el input
    const [afn1, setAFN] = React.useState('');

    const handleAFNChange = (event: SelectChangeEvent) => {
        setAFN(event.target.value);
    }

    const handleAFNtoAFD = () => {
        const selectedAFN = afns.find(afn => afn.idAFN.toString() === afn1);
        if(selectedAFN) {
            selectedAFN.ToAFD();
            onAFNtoAFD(selectedAFN);
        }
        handleClose();
    };

    return(
        <ShineBorder
            className={afns.length < 2 ? "disabled-shine-border border-black bg-background-black" :"border-black bg-background-black"}
            color={afns.length < 2 ? [] : ["#58706d", "#7c8a6e", "#e3e3d1"]}
        >
            <Button 
                sx={{
                    backgroundColor: "black", 
                    color: "white", 
                    "&:disabled": {
                        color: "gray"
                    }
                }}
                variant="contained"
                startIcon={<Transform />}
                onClick={handleOpen}
                disabled={afns.length < 1}>
                    Convertir a AFD
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Unir AFN
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Selecciona los dos AFN que deseas unir
                        </Typography>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="afn1-select-label">AFN 1</InputLabel>
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
                    <Button variant="contained" onClick={handleAFNtoAFD}>Realizar</Button>
                </Box>
            </Modal>
        </ShineBorder>
    );
}

export default AFNtoAFDButton;

