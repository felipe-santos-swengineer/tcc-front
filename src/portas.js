export default function portas(){
    
    //LOCAL
    var clientHost = "http://localhost:3000";
    var serverHost = "http://localhost:5000";

    //CLOUD
    //var serverHost = "https://tcc-back.onrender.com";
    //var clientHost = "https://jazzy-bombolone-078491.netlify.app";

    return {serverHost, clientHost};
}