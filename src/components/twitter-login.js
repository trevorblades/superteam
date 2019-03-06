import PropTypes from 'prop-types';
import io from 'socket.io-client';
import {Component} from 'react';
import {stringify} from 'querystring';

const socket = io(process.env.GATSBY_API_URL);
export default class TwitterLogin extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = {
    pending: false
  };

  dialog = null;

  componentDidMount() {
    socket.on('user', user => {
      this.dialog.close();
      console.log(user);
    });
  }

  componentWillUnmount() {
    clearInterval(this.check);
  }

  checkDialog() {
    this.check = setInterval(() => {
      if (
        !this.dialog ||
        this.dialog.closed ||
        this.dialog.closed === undefined
      ) {
        clearInterval(this.check);
        this.setState({pending: false});
      }
    }, 1000);
  }

  openDialog() {
    const width = 600;
    const height = 600;
    return window.open(
      `${process.env.GATSBY_API_URL}/twitter?socketId=${socket.id}`,
      '',
      stringify(
        {
          width,
          height,
          top: window.innerHeight / 2 - height / 2,
          left: window.innerWidth / 2 - width / 2,
          toolbar: 'no',
          location: 'no',
          directories: 'no',
          status: 'no',
          menubar: 'no',
          scrollbars: 'no',
          resizable: 'no',
          copyhistory: 'no'
        },
        ','
      )
    );
  }

  startAuth = () => {
    if (!this.state.pending) {
      this.dialog = this.openDialog();
      this.checkDialog();
      this.setState({pending: true});
    }
  };

  render() {
    return this.props.children({
      pending: this.state.pending,
      startAuth: this.startAuth
    });
  }
}
