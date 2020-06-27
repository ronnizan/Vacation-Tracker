import React from "react";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Alert } from '../redux/types/alert/alert-type';
import { AppState } from '../redux/store/store';
import { popUpAlert } from '../redux/actions/alert-actions';
import { AppActions } from '../redux/types/auth/auth-actions-types';
import { Auth } from '../redux/types/auth/auth-type';
import { loadUser, registerUser, loginUser, logoutUser } from '../redux/actions/auth-actions';




type Props = LinkDispatchProps & LinkStateProps;
interface TestState { }


export class Test extends React.Component<Props> {
  constructor(props:Props) {
    super(props);

  }

  render() {
    const { popUpAlert, loadUser, registerUser, loginUser, logoutUser, user: { user } } = this.props;
    return (
      <div>
        <button onClick={() => { popUpAlert!({ msg: "aaa", alertType: 'danger', timeout: 5000 }) }}>show!!</button>
        <button onClick={() => { registerUser!({ username: "bbbb", password: "22112313", firstName: '111111', lastName: "22asdasd22" }) }}>sign!!</button>


        <button onClick={() => { loginUser!("bbbb", "22112313") }}>Login!!</button>

        <button onClick={() => { logoutUser!() }}>Logout!!</button>

        <hr />
        <div>
          {user.firstName}
          {user.lastName}
          {user.isAdmin}
          {user.username}
          {user.userId}
        </div>

      </div>
    );
  }
}

interface LinkStateProps {
  user: Auth
}

const mapStateToProps = (
  state: AppState,
): LinkStateProps => ({
  user: state.auth
});


interface LinkDispatchProps {
  popUpAlert?: (alert: Alert) => void;
  loadUser?: () => void;
  registerUser?: ({ firstName, lastName, username, password }: {
    firstName: string,
    lastName: string,
    username: string,
    password: string
  }) => void;
  loginUser?: (username: string, password: string) => void;
  logoutUser?: () => void

}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
  popUpAlert: bindActionCreators(popUpAlert, dispatch),
  loadUser: bindActionCreators(loadUser, dispatch),
  registerUser: bindActionCreators(registerUser, dispatch),
  loginUser: bindActionCreators(loginUser, dispatch),
  logoutUser: bindActionCreators(logoutUser, dispatch)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);
