import React, { Component } from 'react';
import './adminVacationTracker.css'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadUser } from '../../redux/actions/auth-actions';
import { ThunkDispatch } from 'redux-thunk';
import { AppActions } from '../../redux/types/auth/auth-actions-types';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Config } from '../../config';


type Props = LinkDispatchProps;
interface AdminVacationsPageState {
  vacations: { destination: string, followers: number, vacationId: number }[]
}

class AdminVacationsPage extends Component<Props, AdminVacationsPageState> {

  constructor(props: Props) {
    super(props);
    this.state = {
      vacations: []
    }
  }


  async componentDidMount() {
    this.props.loadUser();
    // labels: dailyData.map(({date})=> date),
    // data:dailyData.map(({deaths})=>deaths),
    const res = await axios.get<{ destination: string, followers: number, vacationId: number }[]>(Config.serverUrl + "/api/vacations/all-vacations-followers");
    this.setState({ vacations: res.data });
  }

  render() {
    const data = {

      // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      labels: this.state.vacations.map(v => v.destination),
      datasets: [
        {
          label: 'Followers',
          backgroundColor: 'blue',
          borderColor: 'blue',
          borderWidth: 1,
          hoverBackgroundColor: 'lightblue',
          hoverBorderColor: 'lightblue',
          data: this.state.vacations.map(v => v.followers),

        }
      ]
    };
    return (

      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.866)', marginTop: '3rem' }} className="container chart-container">

        <Bar

          data={data}
          width={100}
          height={450}
          options={{

            legend: {
              labels: {
                fontColor: "black",
                fontSize: 18
              }
            },
            scales: {
              yAxes: [{
                ticks: {
                  fontColor: "black",
                  fontSize: 18,
                  stepSize: 1,
                  beginAtZero: true
                }
              }],
              xAxes: [{
                barThickness : 73,
                
                ticks: {
                  fontColor: "black",
                  fontSize: 18,
                  stepSize: 1,
                  beginAtZero: true
                }
              }]
            },

            title: {
              display: true,
              text: 'Followers-Tracker',
              fontSize: '30',
              fontColor: 'black'
            },
            maintainAspectRatio: false
          }}
        />

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
)(AdminVacationsPage);




