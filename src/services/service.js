import axios from 'axios';

// const API_VM = 'http://128.31.25.198:5000/database/database/'
// const API_ROOT_L = 'http://localhost:5000/database/'

const API_ROOT = process.env.REACT_APP_BASE_API;
const API_CREATE = 'createDatabase'
const API_ACCESS = 'accessDB'
const API_DROP_BY_OWNER= "dropDatabaseByOwner"
const API_SIZE = 'getSize/'
const API_STATS = 'getStats/'
// const API_USER = "&uname="
// const API_PWD = "&pwd="
const API_REQUEST_ACCESS="updateReadStatus"

export default class ClientService {
    static myInstance = ClientService;
  
  static getInstance() {
    if (ClientService.myInstance == null) {
        ClientService.myInstance = new ClientService();
    }
    return this.myInstance;
  }
  
  static async access(db_name, user_name, pwd) {
    console.log('access '+db_name + ' for user' + user_name + ' with psw: ' + pwd)
    var res = await axios.post(API_ROOT+API_ACCESS,{
      dbname:db_name,
      uname:user_name,
      pwd:pwd
    }).then(res => res.data);
    console.log(res)
    return res
}
    static async create(db_name, user_name) {
        console.log('create '+db_name + ' for user' + user_name)
        var res = await axios.post(API_ROOT+API_CREATE,{
          dbname:db_name,
          uname:user_name,
        }).then(res => res.data);
        console.log(res)
        return res
    }

    static async delete(db_name, user_name, pwd) {
      console.log('deleting '+db_name + ' for user' + user_name + ' with psw: ' + pwd)
      var res = await axios.post(API_ROOT+API_DROP_BY_OWNER,{
        dbname:db_name,
        uname:user_name,
        pwd:pwd
      }).then(res => res.data);
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

    static async request_access(db_name, user_name) {
      console.log('requesting read access to '+db_name + ' for user' + user_name)
      var res = await axios.post(API_ROOT+API_REQUEST_ACCESS,{
        dbname:db_name,
        uname:user_name,
      }).then(res => res.data);
      console.log(res)
      return res
  }




}
