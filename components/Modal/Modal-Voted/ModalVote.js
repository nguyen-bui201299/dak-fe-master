import { resolve } from 'styled-jsx/css'
import Swal from 'sweetalert2'
import { NotificationToast } from '../../../modules/Notification/Notification'
import Styles from './ModalVote.module.css'

export default function ModalVote({yes, cancle, id}) {
    Swal.fire({
        title: 'Vote this post ?',
        icon: 'warning',
        scrollbarPadding: false,
        heightAuto: false,
        customClass: {
          container: Styles.container,
          popup: Styles.popup_container,
          title: Styles.title_color,
          confirmButton: Styles.confirm_btn,
          cancelButton: Styles.cancel_btn
        },
        allowOutsideClick: false,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
            yes(id)
        }
        cancle();
      })
}