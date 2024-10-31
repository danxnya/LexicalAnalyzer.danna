"use client"; // Deja usar el cliente

import * as React from "react";
import ShimmerButton from "@/components/magic-ui/shimmer-button";
import { List, ListItem, ListItemButton, ListItemText, DialogTitle, Dialog, Typography, ListItemIcon } from "@mui/material";
import { MoreHoriz, Abc, Calculate } from "@mui/icons-material";
import Link from 'next/link';

const opciones = {
    'Analizador Lexico': { link: '/lexicalAnalyzer', icon: <Abc />}, 
    'Calculadora': { link: '/calculator', icon: <Calculate />}};

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Selecciona una opción</DialogTitle>
      <List sx={{ pt: 0 }}>
        {Object.entries(opciones).map(([opt, { link, icon }]) => (
          <ListItem disableGutters key={opt}>
            <ListItemButton onClick={() => handleListItemClick(opt)}>
              <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={
                    <Link href={link}>
                        {opt}
                    </Link>
                } />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(Object.keys(opciones)[0]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <ShimmerButton
        className="bg-custom1 text-custom1 buttons-space-end items-center justify-center h-full"
        borderRadius="10px"
        onClick={handleClickOpen}>
        <MoreHoriz /><Typography variant="button" className="ml-2">MÁS OPCIONES</Typography>
      </ShimmerButton>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}