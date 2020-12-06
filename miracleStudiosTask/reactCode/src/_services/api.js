
import axios from 'axios'
const baseUrl="http://localhost:3001/"

 class ApiFun {
    static postApi(url,data){
        return axios.post(baseUrl + url, data);   
    }

    static getApi(url,token){
        return axios.get(baseUrl + url,{
            headers: {
              'token': token
            }
          });   
    }
//=============== for csv multipart form data upload ==================
    static filePostApi(url,data,token){
        return axios.post(baseUrl + url,data,{
            headers: {
              'token': token,
              'Content-Type': 'multipart/form-data'
            }
          });   
    }


    static tokenPostApi(url,data,token){
      return axios.post(baseUrl + url,data,{
          headers: {
            'token': token,
          }
        });   
  }

  static tokenPutApi(url,data,token){
    return axios.put(baseUrl + url,data,{
        headers: {
          'token': token,
        }
      });   
}

  
}

export default ApiFun