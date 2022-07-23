const  jwt  = require ("jsonwebtoken"); 
const  secretjwt  = "jhjsdrrbusfasddgsd"; 

function adminAuth(req, res, next){
    if(req.session.user != undefined){
        if (req.session.user.email == 'admin@gmail.com'){
            const authToken = req.cookies.auth;e
            
            if(authToken != undefined){ 
                const token = authToken.split(' ')[1]; 
                jwt.verify(token,secretjwt,(err, decoded) => {
                    if(err){
                        res.json({err: 'Invalid token.'})
                    }else{
                        req.token = token
                        req.decoded = decoded;
                        res.render("/admin/users");
                        next();
                    }  
                })
            }else{   
                console.log("erro 1")
            }
        }else{
            console.log("Not authorized to access this route.")
            res.redirect("/login");
        }    
    }else{
       console.log("without access admin")
        res.redirect("/login");
    };
};

module.exports = adminAuth;
