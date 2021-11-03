import axios from 'axios';

const API_ROOT_REMOTE = 'http://128.31.27.249:5000/database/'
const API_ROOT = 'http://localhost:5000/database/'
const API_CREATE = 'createDatabase?dbname='
const API_DROP = "dropDatabase?dbname="
const API_SIZE = 'getSize?dbname='
const API_STATS = 'getStats?dbname='

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

    static async getSize(db_name) {
      console.log('requesting size of '+db_name)
      var res = await axios.get(API_ROOT+API_SIZE+db_name).then(res => res.data);
      console.log(res)
      return res
  }

    static async getStats(db_name) {
      console.log('requesting statistics of '+db_name)
      var res = await axios.get(API_ROOT+API_STATS+db_name).then(res => res.data);
      console.log(res)
      return res
    }



}
