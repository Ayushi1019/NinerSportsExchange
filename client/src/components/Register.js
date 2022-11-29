import {Component} from "react";
import {Button, Divider, Input, message} from "antd";
import axiosJSON, { BASE_URL } from "../utils/api";

class Register extends Component{
    constructor(props){
        super(props);
        this.state ={
            firstName:'',
            lastName:'',
            email:'',
            password:'',
            errors:[]
        }

        this.onValueChange = this.onValueChange.bind(this)
        this.onRegister = this.onRegister.bind(this)
    }

    shouldComponentUpdate(nextProps){
        console.log(nextProps.location.pathname,this.props.location.pathname)

        return nextProps.location.pathname === this.props.location.pathname
    }

    onValueChange(event){
        
        if(event.target.value.length >= 0){
            this.setState({
                [event.target.name] : event.target.value.trim()
            })
        }

    }

    onRegister(){
        const {firstName,lastName,email,password} = this.state
        let body = {
            "firstName": firstName,
            "lastName": lastName,
            "email" : email,
            "password" : password
        }

        const res = axiosJSON.post(BASE_URL+ "/users",body)

        res.then(response=>{
            if(response.data.status === 200){
                localStorage.removeItem('user')
                this.props.history.push("/login")
            }
            else{
                if(response.data.hasOwnProperty("message")){
                    message.error(response.data.message)
                }
                else{
                    this.setState({
                        errors: response.data
                    })
                }
            }
            
        })
        .catch(err=> console.log(err))
    }

    render(){
        const {firstName,lastName,email,password} = this.state
        return (
            <div>
                Create new account
                <Divider/>
                <div>
                    <label>First Name</label>
                    <Input value={firstName} name="firstName" onChange={this.onValueChange}/> 
                    {this.state.errors && this.state.errors.map(e=> e.key === "firstName" && <span style={{color:'red',fontSize:'12px'}}>{e.error}</span>)}
                </div>
                <div style={{marginTop:'12px'}}>
                    <label>Last Name</label>
                    <Input value={lastName} name="lastName" onChange={this.onValueChange}/> 
                    {this.state.errors && this.state.errors.map(e=> e.key === "lastName" && <span style={{color:'red',fontSize:'12px'}}>{e.error}</span>)}

                </div>
                <div style={{marginTop:'12px'}}>
                    <label>Email</label>
                    <Input value={email} name="email" onChange={this.onValueChange}/> 
                    {this.state.errors && this.state.errors.map(e=> e.key === "email" && <span style={{color:'red',fontSize:'12px'}}>{e.error}</span>)}

                </div>
                <div style={{marginTop:'12px'}}>
                    <label>Password</label>
                    <Input.Password value={password} name="password" onChange={this.onValueChange}/> 
                    {this.state.errors && this.state.errors.map(e=> e.key === "password" && <span style={{color:'red',fontSize:'12px'}}>{e.error}</span>)}

                </div>
                <Button style={{marginTop:'12px'}} size="large" onClick={this.onRegister}>Submit</Button>
            </div>
    );
    }
}

export default Register;
