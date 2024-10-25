"use client"; // Deja usar el cliente

import * as React from "react";
import { Button, Modal, Typography, Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import { JoinFull } from "@mui/icons-material";
import ShineBorder from "@/components/magic-ui/shine-border";

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

interface JoinAFNButtonProps {
    afns: AFN[];
    onAFNJoined: (newAFN: AFN) => void;
}

const JoinAFNButton: React.FC<JoinAFNButtonProps> = ({ afns, onAFNJoined}) => {
    // Estados para el Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Estados para la lista
    const [afn1, setAFN1] = React.useState('');
    const [afn2, setAFN2] = React.useState('');

    const handleAFN1Change = (event: SelectChangeEvent) => {
        setAFN1(event.target.value);
    }

    const handleAFN2Change = (event: SelectChangeEvent) => {
        setAFN2(event.target.value);
    }

    const handleJoinAFN = () => {
        const selectedAFN1 = afns.find(afn => afn.idAFN.toString() === afn1);
        const selectedAFN2 = afns.find(afn => afn.idAFN.toString() === afn2);

        if(selectedAFN1 && selectedAFN2){
            selectedAFN1.unirAFN(selectedAFN2);

            // Aquí pasamos el AFN1 modificado
            onAFNJoined(selectedAFN1);
            handleClose();
        }
    };

    return (
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
                startIcon={<JoinFull />}
                onClick={handleOpen}
                disabled={afns.length < 2}>
                    Unir AFN
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
                                onChange={handleAFN1Change}
                            >
                                {afns.map((afn) => (
                                    <MenuItem key={afn.idAFN} value={afn.idAFN.toString()}>
                                        AFN {afn.idAFN}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="afn2-select-label">AFN 2</InputLabel>
                            <Select
                                labelId="afn2-select-label"
                                id="afn-select"
                                value={afn2}
                                label="AFN 2"
                                onChange={handleAFN2Change}
                            >
                                {afns.map((afn) => (
                                    <MenuItem key={afn.idAFN} value={afn.idAFN.toString()}>
                                        AFN {afn.idAFN}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    <Button variant="contained" onClick={handleJoinAFN}>Unir</Button>
                </Box>
            </Modal>
        </ShineBorder>
    );
}

export default JoinAFNButton;