import React, { Component } from 'react';
import io from 'socket.io-client'; //worked solution
import "./VacationPage.css"
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
import { Redirect } from 'react-router-dom';



type Props = LinkDispatchProps & LinkStateProps;
interface VacationPageState {
  allVacations: VacationModel[];
  currentUserFollowedVacations: VacationModel[];
  currentUserUnFollowedVacations: VacationModel[];
}

class VacationPage extends Component<Props, VacationPageState> {


  private socket = io.connect("http://localhost:3000"); // Server 
  constructor(props: Props) {
    super(props);
    this.state = {
      allVacations: [],
      currentUserFollowedVacations: [],
      currentUserUnFollowedVacations: []
    }
    if (this.socket === null) {
      this.socket = io('http://localhost:3000');
    }
    this.socket.on("admin-change", (vacations: VacationModel[]) => {
      this.setState({ allVacations: vacations });
    });


  }

  componentDidMount = async () => {
    try {

      this.props.loadUser();
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      const res = await axios.get<VacationModel[]>(Config.serverUrl + "/api/vacations");
      let allVacations = res.data;
      this.setState({ allVacations })
      const res2 = await axios.get<VacationModel[]>(Config.serverUrl + "/api/vacations/my-vacations");
      const currentUserFollowedVacations = res2.data;
      currentUserFollowedVacations.forEach(vacation => {
        return allVacations.forEach(vacation2 => {
          return vacation.vacationId === vacation2.vacationId ? vacation.totalFollowers = vacation2.totalFollowers : vacation.totalFollowers = vacation.totalFollowers
        })
      })
      this.setState({ currentUserFollowedVacations })
      const currentUserUnFollowedVacations = this.compareFollowedVacationsAndUnFoloowedVacations();
      this.setState({ currentUserUnFollowedVacations })
    } catch (error) {
      console.log(error.response.data.msg)
    }
  }
  async componentDidUpdate(prevProps: Props, prevState: VacationPageState) {
    if (prevState.allVacations !== this.state.allVacations) {
      try {
        const res2 = await axios.get<VacationModel[]>(Config.serverUrl + "/api/vacations/my-vacations");
        const currentUserFollowedVacations = res2.data;
        currentUserFollowedVacations.forEach(vacation => {
          return this.state.allVacations.forEach(vacation2 => {
            return vacation.vacationId === vacation2.vacationId ? vacation.totalFollowers = vacation2.totalFollowers : vacation.totalFollowers = vacation.totalFollowers
          })
        })
        this.setState({ currentUserFollowedVacations })
        const currentUserUnFollowedVacations = this.compareFollowedVacationsAndUnFoloowedVacations();
        this.setState({ currentUserUnFollowedVacations })
      } catch (error) {
        console.log(error.response.data.msg)
      }
    }
  }


  private compareFollowedVacationsAndUnFoloowedVacations() {
    function comparer(otherArray: VacationModel[]) {
      return function (current: VacationModel) {
        return otherArray.filter(function (other) {
          return other.vacationId === current.vacationId
        }).length === 0;
      }
    }
    var onlyInFollowedVacations = this.state.allVacations.filter(comparer(this.state.currentUserFollowedVacations));
    var onlyInDefaultVacations = this.state.currentUserFollowedVacations.filter(comparer(this.state.allVacations));
    const unFollowedVacations = onlyInFollowedVacations.concat(onlyInDefaultVacations);
    return unFollowedVacations
  }

  private addFollowerToVacation = async (vacationId: number) => {
    try {
      const res = await axios.post(Config.serverUrl + "/api/vacations/add-vacation-follower", { vacationId: +vacationId });
      this.props.popUpAlert({ alertType: "success", msg: "Added Follow", timeout: 5000 })
      this.componentDidMount()
    } catch (error) {
      this.props.popUpAlert({ alertType: "danger", msg: "Failed to add follow to a vacation", timeout: 5000 })
    }
  }
  private removeFollowerFromVacation = async (vacationId: number) => {
    try {
      const res = await axios.delete(Config.serverUrl + "/api/vacations/remove-vacation-follower/" + vacationId);
      this.props.popUpAlert({ alertType: "success", msg: "Removed Follow", timeout: 5000 })
      this.componentDidMount()
    } catch (error) {
      this.props.popUpAlert({ alertType: "danger", msg: "Failed to Remove follow to a vacation", timeout: 5000 })
    }

  }




  render() {
    if (this.props.auth.isAuthenticated && this.props.auth.user.isAdmin === 1) {
      return <Redirect to="/admin-vacations"></Redirect>
    }
    return (
      this.state.allVacations.length > 0 &&
      <div className="container">

        <br /><br />
        <div className="row">
          {this.state.currentUserFollowedVacations.length > 0 &&
            this.state.currentUserFollowedVacations.map((followedVacation, index) => {
              return (
                <div key={followedVacation.vacationId} className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card ">
                    <div onClick={() => {
                      this.removeFollowerFromVacation(followedVacation.vacationId)
                    }} title="Unfollow Vacation" className="follow-Wrapper-followed"><i className="fas fa-minus-circle"></i></div>
                    <img src={window.location.origin + "/assets/images/" + followedVacation.imageFileName} className="card-img-top" alt="" />
                    <div className="card-body">
                      <h5 className="card-title"><strong>Destination:</strong> {followedVacation.destination}</h5>
                      <p className="card-text card-text-description "><strong>Description:</strong>  {followedVacation.description}</p>
                      <p className="card-text"><strong>Start Of The Trip Date:</strong> {new Date(followedVacation.startVacationDate).toLocaleDateString()}</p>
                      <p className="card-text"><strong>End Of The Trip Date: </strong>{new Date(followedVacation.endVacationDate).toLocaleDateString()}</p>

                      <p className="card-text"><strong>Price: </strong> ${followedVacation.price}</p>
                      <div className="followers-Wrapper"><span title="Total Followers">{followedVacation.totalFollowers}followers</span></div>
                    </div>
                  </div>
                </div>

              )
            })
          }
          {this.state.currentUserUnFollowedVacations.length > 0 &&
            this.state.currentUserUnFollowedVacations.map(unFollowedVacation => {
              return (
                <div key={unFollowedVacation.vacationId} className="col-sm-12 col-md-6 col-lg-4">
                  <div className="card">
                    <div onClick={() => { this.addFollowerToVacation(unFollowedVacation.vacationId) }} title="Follow Vacation" className="follow-Wrapper-unfollowed"><i className="fab fa-facebook-f" aria-hidden="true"></i></div>

                    <img className="card-img-top" src={window.location.origin + "/assets/images/" + unFollowedVacation.imageFileName} alt="" />
                    <div className="card-body">
                      <h5 className="card-title"><strong>Destination:</strong> {unFollowedVacation.destination}</h5>
                      <p className="card-text card-text-description"><strong>Description: </strong>  {unFollowedVacation.description}</p>
                      <p className="card-text"><strong>Start Of The Trip Date: </strong> {new Date(unFollowedVacation.startVacationDate).toLocaleDateString()}</p>
                      <p className="card-text"><strong>End Of The Trip Date: </strong>{new Date(unFollowedVacation.endVacationDate).toLocaleDateString()}</p>

                      <p className="card-text"><strong>Price: </strong> ${unFollowedVacation.price}</p>
                      <div className="followers-Wrapper"><span title="Total Followers">{unFollowedVacation.totalFollowers}</span></div>
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
)(VacationPage);
