import axios from 'axios';

const API_ROOT = 'http://128.31.27.249:5000/database/'
const API_CREATE = 'createDatabase?dbname='
const API_DROP = "dropDatabase?dbname="
export default class ClientService {
    static myInstance = ClientService;
  
  static getInstance() {
    if (ClientService.myInstance == null) {
        ClientService.myInstance = new ClientService();
    }
    return this.myInstance;
  }
  
    static async create(db_name) {
        var res = await axios.get(API_ROOT+API_CREATE+db_name).then(res => res.data);
        console.log(res)
        return res
    }

    static async delete(db_name) {
      console.log('deleting '+db_name)
      var res = await axios.get(API_ROOT+API_DROP+db_name).then(res => res.data);
      console.log(res)
      return res
  }



}
