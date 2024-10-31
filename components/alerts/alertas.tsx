// alertas.tsx
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast',
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

// Función que recibe la posición como parámetro
export async function ejecutarAlerta(
  tipo: 'success' | 'error' | 'warning' | 'info' | 'question',
  titulo: string,
  posicion: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end'
) {
  await Toast.fire({
    icon: tipo,
    title: titulo,
    position: posicion,
  });
}
