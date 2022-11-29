import './App.css';
import {
  Route,
  BrowserRouter as Router
} from "react-router-dom";
import { Component } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import { createBrowserHistory } from "history";
import { Layout, Image } from 'antd';
import Profile from './components/Profile';


const { Header, Footer, Content } = Layout;
const history = createBrowserHistory();

class App extends Component {
  render(){
    return (
      <>
      <Layout>
        <Header className="header">
          <h2 style={{"color":"white"}}>Niner Exchange Mart</h2>
        </Header>
        <Content className="content">
          <Router history={history}>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/> 
            <Route exact path="/profile" component={Profile}/> 
        </Router>
        </Content>
        <Footer className="footer">© 2022 Niner Sports Exchange, UNC Charlotte</Footer>
      </Layout>
      </>
    );
  }
}
  

export default App;
