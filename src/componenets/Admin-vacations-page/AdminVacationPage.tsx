import React, { Component } from 'react';
import "./AdminVacationPage.css"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadUser } from '../../redux/actions/auth-actions';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../redux/types/auth/auth-actions-types';
import { VacationModel } from '../../models/vacation-model';
import axios from 'axios';
import { Config } from '../../config';
import setAuthToken from '../../utills/setAuthToken';
import { popUpAlert } from '../../redux/actions/alert-actions';
import { Alert } from '../../redux/types/alert/alert-type';
import { Auth } from '../../redux/types/auth/auth-type';
import { AppState } from '../../redux/store/store';

type Props = LinkDispatchProps & LinkStateProps;
interface AdminVacationPageState {
  allVacations: VacationModel[];

}

class AdminVacationPage extends Component<Props, AdminVacationPageState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      allVacations: [],
    }

  }

  async componentDidMount() {
    try {
      // this.props.loadUser();
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      const res = await axios.get<VacationModel[]>(Config.serverUrl + "/api/vacations");
      const allVacations = res.data;
      this.setState({ allVacations })

    } catch (error) {
      console.log(error)
    }
  }




  private async deleteVacation(vacationId: number) {
    try {


      const newVac = this.state.allVacations.filter(vac => vac.vacationId !== vacationId);
      this.setState({ allVacations: newVac })
      const res = await axios.delete(Config.serverUrl + "/api/vacations/delete/" + vacationId);
      this.props.popUpAlert({ alertType: "success", msg: "Removed Vacation", timeout: 5000 })
      // this.componentDidMount()
    } catch (error) {
      this.props.popUpAlert({ alertType: "danger", msg: "Failed to Remove Vacation", timeout: 5000 })
    }
  }





  render() {

    return (
      this.state.allVacations.length > 0 &&
      <div className="container">
        <br /><br />
        {/* <div><img src={"/client/src/assets/images/003ecc8c-17e7-4f90-9ab4-3b5300b09f59.jpg"}  alt=""/> sasds</div> */}
        <div className="row">
          {
             
            this.state.allVacations.map((vacation, index) => {
              return (
                <div key={vacation.vacationId} className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card">
                    <div onClick={() => {

                    }} title="Edit Vacation" className="edit-Wrapper"><i className="far fa-edit"></i></div>
                    <div onClick={() => {
                      this.deleteVacation(vacation.vacationId)
                    }} title="Delete Vacation" className="delete-Wrapper"><i className="fas fa-trash-alt"></i></div>
                    <img className="card-img-top" src={window.location.origin + "/assets/images/"+vacation.imageFileName}  alt=""/>
                    <div className="card-body">
                      <h5 className="card-title"><strong>Destination:</strong> {vacation.destination}</h5>
                      <p className="card-text"><strong>Description:</strong>  {vacation.description}</p>
                      <p className="card-text"><strong>Start Of The Trip Date:</strong> {new Date(vacation.startVacationDate).toLocaleDateString()}</p>
                      <p className="card-text"><strong>End Of The Trip Date: </strong>{new Date(vacation.endVacationDate).toLocaleDateString()}</p>

                      <p className="card-text"><strong>Price: </strong> ${vacation.price}</p>
                      <div className="followers-Wrapper"><span title="Total Followers">{vacation.totalFollowers}</span></div>
                    </div>

                  </div>
                </div>

              )
            })
          }

        </div>

      </div>
    )
  }
}


interface LinkStateProps {
  auth: Auth
}

const mapStateToProps = (
  state: AppState,
): LinkStateProps => ({
  auth: state.auth
});
interface LinkDispatchProps {
  popUpAlert?: (alert: Alert) => void;
  loadUser?: () => void;
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
  popUpAlert: bindActionCreators(popUpAlert, dispatch),
  loadUser: bindActionCreators(loadUser, dispatch)
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminVacationPage);
