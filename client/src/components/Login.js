import {Component} from "react";
import {Button, Input, message, Image} from "antd";
import axiosJSON, { BASE_URL } from "../utils/api";

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            "email" : "",
            "password" : ""
        }

        this.onValueChange = this.onValueChange.bind(this)
        this.onLogin = this.onLogin.bind(this)
    }

    componentDidMount(){
        let user = localStorage.getItem('user')
        console.log(this.props)
        if(user){
            this.props.history.push('/')
        }
    }

    onValueChange(event){
        
        if(event.target.value.length >= 0){
            this.setState({
                [event.target.name] : event.target.value.trim()
            })
        }

    }
    shouldComponentUpdate(nextProps){
        console.log(nextProps.location.pathname,this.props.location.pathname)

        return nextProps.location.pathname === this.props.location.pathname
    }

    onLogin(){
        const {email, password} = this.state;

        let body ={
            "email" : email,
            "password" : password
        }
        
        const res = axiosJSON.post(BASE_URL+"/users/login",body)

        res.then(response=>{
            if(response.data.status === 200){
                let data = response.data.data
            localStorage.setItem('user',JSON.stringify(data))
            axiosJSON.defaults.headers['authorization'] = "Token " + data.token
            this.props.history.push("/")
            }
            else{
                message.error(response.data.message)
            }
            
        })
        .catch(err=> console.log(err))

    }
    render(){
        const {email,password} = this.state
        return (
            <div>
                <div className="sports-img">
                    <Image src="https://t4.ftcdn.net/jpg/00/17/33/59/360_F_17335975_wezHs72ORL3CY2dFLVi9XtLx4XDOgZBT.jpg" />
                </div>
                <div style={{padding:'12px'}}>
                    <label>Email</label>
                    <Input value={email} name="email" onChange={this.onValueChange}/> 
                </div>
                <div style={{padding:'12px'}}>
                    <label>Password</label>
                    <Input.Password value={password} name="password" onChange={this.onValueChange}/> 
                </div>
                <Button style={{marginLeft:'12px'}} onClick={this.onLogin}>Submit</Button>

                <div style={{padding:'12px'}} onClick={(e)=>this.props.history.push("/register")}>
                    <a>Don't have an account? Create new account.</a>
                </div>
            </div>
    );
    }
}

export default Login;
