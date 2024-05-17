class CustomErrorhandler extends Error{

    constructor(status,msg){
      super();
      this.status=status;
      this.message=msg;
    }

    static alreadyExist(message){
        return new CustomErrorhandler(409,message)
    }
    static invalidCredentials(message='username or password is wrong!'){
      return new CustomErrorhandler(401,message)
    }
    static unAuthorized(message="unAuthorized"){
      return new CustomErrorhandler(401,message)
    }
    static notFound(message="Not Found"){
      return new CustomErrorhandler(404,message)
    }
  
}

module.exports= CustomErrorhandler;