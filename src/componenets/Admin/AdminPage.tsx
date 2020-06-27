import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadUser } from '../../redux/actions/auth-actions';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../redux/types/auth/auth-actions-types';



type Props = LinkDispatchProps ;
interface TestState { }

class AdminPage extends Component<Props> {
    componentDidMount(){
        this.props.loadUser();
    }
    render() {
        return (
            <div>
                admin
            </div>
        )
    }
}


interface LinkDispatchProps {
  loadUser?: () => void;
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
  loadUser: bindActionCreators(loadUser, dispatch)
});
export default connect(
  null,
  mapDispatchToProps
)(AdminPage);
