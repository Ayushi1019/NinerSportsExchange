import { Divider, Tag } from "antd";
import Card from "antd/lib/card/Card";
import React,{Component} from "react";
import axiosJSON, { BASE_URL } from "../utils/api";

class Profile extends Component{
    constructor(props){
        super(props);
        this.state ={
            profile:null
        }

        this.getProfile = this.getProfile.bind(this)
    }

    componentDidMount(){
        this.getProfile()
    }

    getProfile(){
        let user = localStorage.getItem('user');
        axiosJSON.defaults.headers['authorization'] = "Token " + JSON.parse(user)["token"]
        
        axiosJSON.get(BASE_URL+'/users/profile?id='+JSON.parse(user)._id).then(res=>{
            this.setState({
                profile : res.data.data
            })
        })
        .catch(err=> console.log(err))
    }

    render(){
        const profile = this.state.profile
        console.log(profile)
        return(
            profile &&
            <div>
                <h3>Profile</h3>

                <Card title={"User info"}>
                    <p>Name: {profile.user.firstName +" " + profile.user.lastName}</p>
                    <p>Email: {profile.user.email}</p>
                </Card>
                <Divider/>

                <Card title="User Equipments">
                    { profile.equipments.map(item=>
                        <Card title={item.name} extra={<Tag key={item.status}>{item.status}</Tag>}>
                            <p>Category: {item.category}</p>
                            <p>Description: {item.content}</p>
                            <p>Exchanges: {item.exchanges ? item.exchanges : "None"}</p>
                        </Card>
                    )}
                </Card>
                <Divider/>

                <Card title="Watch Equipments">
                    { profile.watchEquipments.length > 0 ? profile.watchEquipments.map(item=>
                        <Card title={item.name} extra={<Tag key={item.status}>{item.status}</Tag>}>
                            <p>Category: {item.category}</p>
                            <p>Description: {item.content}</p>
                            <p>Exchanges: {item.exchanges ? item.exchanges : "None"}</p>
                        </Card>
                        
                    ): <p>No data found</p>}
                </Card>

                <Divider/>

                <Card title="Exchange Equipments">
                    { profile.exchangeEquipments.length > 0 ? profile.exchangeEquipments.map(item=>
                        <Card title={item.name} extra={<Tag key={item.status}>{item.status}</Tag>}>
                            <p>Category: {item.category}</p>
                            <p>Description: {item.content}</p>
                            <p>Exchanges: {item.exchanges ? item.exchanges : "None"}</p>
                        </Card>  
                    ) : <p>No data found</p>}
                </Card>



            </div>
        )
    }

}

export default Profile;