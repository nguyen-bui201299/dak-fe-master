import { ToastContainer, toast  } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineClose } from 'react-icons/ai'
import Styles from './Notification.module.css'
import Swal from 'sweetalert2'

export const NotificationToast = Swal.mixin({
    showConfirmButton: false,
    customClass: {
      popup: `${Styles.swal_container_popup}`,
      title: `${Styles.swal_title_popup}`,
    },
    showClass: {
        popup: 'swal2-noanimation',
    },
    timer: 2000,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const GroupActionToast = Swal.mixin({
    showConfirmButton: false,
    customClass: {
        popup: `${Styles.swal_container_popup}`,
        title: `${Styles.swal_title_popup}`,
        icon: ``,
    },showClass: {
        popup: 'swal2-noanimation',
    },
    timer: 2000,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})



export function SuccessNotification(message) {
    toast.success(message ,
        { 
            closeButton: <div onClick={() => toast.dismiss()}> <AiOutlineClose /> </div>
        });
}

export const InfoNotification = (message) => {
    toast.info(message ,{
        closeButton: <div onClick={() => toast.dismiss()}> <AiOutlineClose /> </div>
    });
}

export const ErrorNotification = (message) => {
    toast.error(message, {
        closeButton: <div onClick={() => toast.dismiss()}> <AiOutlineClose /> </div>
    });
}

export const WarnNotification = (message) => {
    toast.warn(message, {
        closeButton: <div onClick={() => toast.dismiss()}> <AiOutlineClose /> </div>
    });
}
