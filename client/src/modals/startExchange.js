import {Component} from "react";
import axiosJSON, { BASE_URL } from "../utils/api";
import {Button,Col,Input, message, Row} from "antd"

class StartExchange extends Component{
    constructor(props){
        super(props);
        this.state ={
            category:"",
            name:"",
            content:"",
            id: ""
        }
        this.onValueChange = this.onValueChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount(){
        console.log(this.props.trade)
        if(this.props.editModal){

            this.setState({
                category:this.props.trade.category,
                name:this.props.trade.name,
                content:this.props.trade.content,
                id:this.props.trade._id,
            })
        }

        console.log(this.state)
    }

    onValueChange(event){
        
        if(event.target.value.length >= 0){
            this.setState({
                [event.target.name] : event.target.value
            })
        }
    }

    onSubmit(){
        let body = {
            "category": this.state.category.trim(),
            "name" : this.state.name.trim(),
            "content" : this.state.content.trim()
        }

        if(!this.props.editModal){
            let user = localStorage.getItem('user');
            let id = JSON.parse(user)["_id"]
            axiosJSON.defaults.headers['authorization'] = "Token " + JSON.parse(user)["token"]
            
            axiosJSON.post(BASE_URL + "/exchange?id="+id,body)
            .then(res=>{
                message.success("Trade added!")
                this.props.setModalOpenChange(false)
                this.props.getEquipmentsList()
            })
            .catch(err=>console.log(err))
        }
        else{
            let user = localStorage.getItem('user')
            axiosJSON.defaults.headers['authorization'] = "Token " + JSON.parse(user)["token"]
            
            axiosJSON.put(BASE_URL + "/exchange/"+this.state.id,body)
            .then(res=>{
                message.success("Trade updated!")
                this.props.setModalOpenChange(false)
                this.props.getEquipmentsList()
            })
            .catch(err=>console.log(err))
        }
    }

    
    render(){
        const {category, name, content} = this.state
        return (
            <div style={{height:'500px'}}>
            <Row className="row">
                <Col className="label" span={4} push={2}>
                    Sport
                </Col>
                <Col span={14} push={2}>
                    <Input width={300} value={category} name="category" onChange={this.onValueChange}/> 
                </Col>
            </Row>
            <Row className="row">
                    <Col className="label" span={4} push={2}>
                        Item
                    </Col>
                    <Col span={14} push={2}>
                        <Input width={300} value={name} name="name" onChange={this.onValueChange}/> 
                    </Col>
                    </Row>
            <Row className="row">
                <Col className="label" span={4} push={2}>Description</Col>
                <Col span={14} push={2}>
                    <Input.TextArea width={300} style={{height:'200px'}} value={content} name="content" onChange={this.onValueChange}/> 
                </Col>
                
            </Row>
            <Row className="row">
                    <Button size="large" className="submit-btn" onClick={this.onSubmit}>Submit</Button>
            </Row>
            </div>
    );
    }
}

export default StartExchange;
