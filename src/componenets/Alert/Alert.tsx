import React from "react";
import "./Alert.css"
import { connect } from "react-redux";
import { Alert as AlertType } from '../../redux/types/alert/alert-type';
import { AppState } from '../../redux/store/store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type Props = LinkStateProps;
const Alert: React.FC<Props> = (props: Props) => {
  const { alerts } = props;

  const alertToDisplay = alerts !== null &&
    alerts.length > 0 && alerts.map((alert) => {
      const { id, alertType, msg } = alert;
      const notify = () => {
        if (alertType === "danger") {
          const customId = "custom-id-danger";

          toast.error(msg, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'foo-bar',
            toastId: customId

          });
        } else {
          const customId = "custom-id-success";

          toast.success(msg, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'foo-bar',
            toastId: customId

          });
        }

      }
      notify()
      // const clearWaitingQueue = () => {
      //   // Easy, right 😎
      //   toast.clearWaitingQueue();
      // }
      return (

        <ToastContainer
          limit={1}
          key={id}
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover

        />

      );
    });
  return (
    <React.Fragment>
      {alertToDisplay}
    </React.Fragment>
  )
};



interface LinkStateProps {
  alerts: AlertType[];
}

const mapStateToProps = (
  state: AppState
): LinkStateProps => ({
  alerts: state.alert
});


export default connect(
  mapStateToProps
)(Alert);
