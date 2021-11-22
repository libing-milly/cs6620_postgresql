import axios from 'axios';

// const API_ROOT_R1 = 'http://128.31.27.249:5000/database/'
const API_ROOT_VM001 = 'http://128.31.26.151:5000/database/'
// const API_ROOT_L = 'http://localhost:5000/database/'

const API_ROOT = API_ROOT_VM001;
const API_CREATE = 'createDatabase?dbname='
const API_ACCESS = 'accessDB?dbname='
const API_DROP_BY_OWNER= "dropDatabaseByOwner?dbname="
const API_SIZE = 'getSize?dbname='
const API_STATS = 'getStats?dbname='
const API_USER = "&uname="
const API_PWD = "&pwd="

export default class ClientService {
    static myInstance = ClientService;
  
  static getInstance() {
    if (ClientService.myInstance == null) {
        ClientService.myInstance = new ClientService();
    }
    return this.myInstance;
  }
  
  static async access(db_name, user_name, pwd) {
    console.log(API_ROOT+API_CREATE+db_name+API_USER+user_name)
    var res = await axios.get(API_ROOT+API_ACCESS+db_name+API_USER+user_name+API_PWD+pwd).then(res => res.data);
    console.log(res)
    return res
}
    static async create(db_name, user_name) {
        console.log(API_ROOT+API_CREATE+db_name+API_USER+user_name)
        var res = await axios.get(API_ROOT+API_CREATE+db_name+API_USER+user_name).then(res => res.data);
        console.log(res)
        return res
    }

    static async delete(db_name, user_name, pwd) {
      console.log('deleting '+db_name + ' for user' + user_name + ' with psw: ' + pwd)
      var res = await axios.get(API_ROOT+API_DROP_BY_OWNER+db_name+API_USER+user_name+API_PWD+pwd).then(res => res.data);
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
