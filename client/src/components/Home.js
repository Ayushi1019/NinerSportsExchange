import {Component} from "react";
import axiosJSON, { BASE_URL } from "../utils/api";
import {Button, Divider, Dropdown, Tag, Modal, message} from "antd"
import {MenuOutlined,InfoCircleFilled} from "@ant-design/icons"
import StartExchange from "../modals/startExchange";
import Card from "antd/lib/card/Card";

class Home extends Component{
    constructor(props){
        super(props);
        this.state ={
            equipmentsList:[],
            isModalOpen:false,
            editModal:false,
            deleteModal:false,
            trade:null,
            exchangeModal:false
        }
        this.getEquipmentsList = this.getEquipmentsList.bind(this)
        this.setModalOpenChange = this.setModalOpenChange.bind(this)
        this.onItemChange = this.onItemChange.bind(this)
        this.deleteTrade = this.deleteTrade.bind(this)
        this.confirm = this.confirm.bind(this)
        this.watchItem = this.watchItem.bind(this)
    }

    componentDidMount(){
        let user = localStorage.getItem('user')
        if(!user){
            this.props.history.push('/login')
        }
        this.getEquipmentsList()

    }

    setModalOpenChange(modalFlag){
        this.setState({
            isModalOpen : modalFlag
        })
    }

    onItemChange(key){
        if(key === "profile"){
            this.props.history.push("/profile")
        }
        else{
            let user = localStorage.getItem('user')
            let email = JSON.parse(user)["email"]
            let token = JSON.parse(user)["token"]
            const res = axiosJSON.get("http://localhost:8080/users/logout?email="+email,{
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
            this.props.history.replace('/login')
        })
        .catch(err=> console.log(err))
        }
    }

    getEquipmentsList(){
        let user = localStorage.getItem('user');
        axiosJSON.defaults.headers['authorization'] = "Token " + JSON.parse(user)["token"]
        
        axiosJSON.get(BASE_URL+'/exchange').then(res=>{
            console.log( res.data.data.equipments)
            this.setState({
                equipmentsList : res.data.data.equipments
            })
        })
        .catch(err=> console.log(err))
    }

    deleteTrade(id){
        let user = localStorage.getItem('user');
        axiosJSON.defaults.headers['authorization'] = "Token " + JSON.parse(user)["token"]
        
        axiosJSON.delete(BASE_URL+'/exchange/'+id).then(res=>{
            message.success(res.data.message)
            this.getEquipmentsList()
        })
        .catch(err=> console.log(err))
    }

    confirm(id) {
        let self = this
        return Modal.confirm({
          title: 'Are you sure you want to delete this trade item?',
          icon: <InfoCircleFilled />,
          okText: 'Submit',
          cancelText: 'Cancel',
          onOk(){
              self.deleteTrade(id)
          }
        });
      };
    
      watchItem(id){
        let user = localStorage.getItem('user');
        axiosJSON.defaults.headers['authorization'] = "Token " + JSON.parse(user)["token"]
        
        axiosJSON.post(BASE_URL+'/exchange/'+id+"/" +JSON.parse(user)["_id"] ).then(res=>{
            message.success("Added to your watch items")
            this.getEquipmentsList()
        })
        .catch(err=> console.log(err))
      }
    
    render(){
        let user = JSON.parse(localStorage.getItem('user'));
        const items = [
            { label: 'Profile', key: 'profile',onClick:(e)=>this.onItemChange(e.key) },
            { label: 'Logout', key: 'logout',onClick:(e)=>this.onItemChange(e.key)  },
            { label: 'Start Exchange', key: 'exchange',onClick:(e)=>this.setModalOpenChange(true)  },
          ];
          
        return (
            <div>
                <div className="home-drp">
                    <Dropdown menu={{ items }}>
                        <MenuOutlined />
                    </Dropdown>
                </div>

                List of trades
                {this.state.equipmentsList && this.state.equipmentsList.map(item=>
                <>
                <Card title={item.name} extra={<Tag color={item.status === "Available" ? 'green' : item.status === "Pending" ? "yellow" :item.status === "Traded" ? 'red' : 'blue'} key={item.status}>{item.status}</Tag>}>
                    <p>Category: {item.category}</p>
                    <p>Description: {item.content}</p>
                    <p>Exchanges: {item.exchanges ? item.exchanges : "None"}</p>
                    {user._id === item.owner ? 
                        <div>
                            <Button style={{backgroundColor:"green",color:"white"}} onClick={(e)=> this.setState({editModal:true,trade:item, isModalOpen:true})}>Edit</Button>
                            <Button style={{backgroundColor:"red",color:"white"}} onClick={(e)=> this.confirm(item._id)}>Delete</Button>
                        </div> 
                    : <div>
                    <Button style={{backgroundColor:"green",color:"white"}} onClick={(e)=> this.setState({exchangeModal:true,trade:item})}>Trade</Button>
                    <Button style={{backgroundColor:"blue",color:"white"}} onClick={(e)=> this.watchItem(item._id)}>Watch</Button>
                </div> }
                </Card>
                <Divider/>
                </>
                
                )}
                
                <div>
                    {
                        this.state.isModalOpen &&
                        <Modal 
                        title="Start Exchange"
                            width={900}
                            open={this.state.isModalOpen} 
                            footer={false}
                            onCancel={()=>this.setModalOpenChange(false)}
                        >
                            <StartExchange trade={this.state.trade} editModal={this.state.editModal} getEquipmentsList={this.getEquipmentsList} equipmentsList={this.state.equipmentsList} isModalOpen={this.state.isModalOpen} setModalOpenChange={this.setModalOpenChange}  />
                        </Modal>
                    }
                </div>
            </div>
    );
    }
}

export default Home;
