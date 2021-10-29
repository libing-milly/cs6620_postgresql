import axios from 'axios';

const API_CREATE = 'http://128.31.27.249:5000/database/createDatabase?dbname='

export default class ClientService {
    static myInstance = ClientService;
  
  static getInstance() {
    if (ClientService.myInstance == null) {
        ClientService.myInstance = new ClientService();
    }
    return this.myInstance;
  }
  
    static async testGet(db_name) {
        var res = await axios.get(API_CREATE+db_name).then(res => res.data);
        console.log(res)
        return res
    }
}
