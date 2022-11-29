import { Button } from "antd";
import {Component} from "react";
import axios from "axios";

class Logout extends Component{
    constructor(props){
        super(props); 

        this.onLogout = this.onLogout.bind(this)
    }

    onLogout(){
        let user = localStorage.getItem('user')
        let email = JSON.parse(user)["email"]
        let token = JSON.parse(user)["token"]
        const res = axios.get("http://localhost:8080/users/logout?email="+email,{
            headers : {
                'Authorization': 'Token ' + token,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
	            "Access-Control-Allow-Credentials" : true,
	            "Access-Control-Allow-Methods": "GET,DELETE,OPTIONS,POST,PUT"
            }
        })

        res.then(response=>{
            localStorage.removeItem('user')
            this.props.onStatusChange()
            this.props.history.replace('/login')
        })
        .catch(err=> console.log(err))
    }
    render(){
        return (
            <Button onClick={this.onLogout}>Logout</Button>
    );
    }
}

export default Logout;
