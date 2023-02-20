import Swal from 'sweetalert2'
import { NotificationToast } from '../../../modules/Notification/Notification'
import Styles from './ModalDeletePost.module.css'

export const ModalDeletePost = (dispatch, deletePostThunk, id, setDeleted, isDeleted,listPostProfile,setListPostProfile) => {
    Swal.fire({
      title: 'Are you sure you want to delete this post ?',
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
      showCancelButton: true,
      cancelButtonText: 'Cancel!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
          dispatch(deletePostThunk({ id })).unwrap()
            .then((res) => {
                setDeleted(true);
                setListPostProfile(listPostProfile.filter(item => item.post.id !== res.post_id))
                NotificationToast.fire({
                  toast: true,
                  position: 'bottom-start',
                  icon: 'success',
                  title: 'Delete post success!',
                })
              }
            )
            .catch((err) => {
              NotificationToast.fire({
                toast: true,
                position: 'bottom-start',
                icon: 'success',
                title: 'Delete post success!',
              })
            });
      }
    })
}