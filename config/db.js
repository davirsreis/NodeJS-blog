if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://davirsreis:Jd89pXJ&+styxj@blogapp-davirsreis.khhqhfx.mongodb.net/?retryWrites=true&w=majority"}
}else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}