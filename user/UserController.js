const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const adminAuth = require("../middlewares/adminAuth");
const  jwt  = require ("jsonwebtoken"); 
const  secretjwt  = "jhjsdrrbusfasddgsd"; 



router.get("/admin/users", adminAuth,(req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
});

router.post("/users/create", (req, res) => {
    const {email, password} = req.body;
    User.findOne({where:{email: email}}).then(user => {
        if(user == undefined){  // if user doesn`t exist so will create a new record.
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash,
                isadmin: 'user'
            }).then(() => {
                res.redirect("/");
                console.log("Password created.");
            }).catch((err) => {
                res.redirect("/");
                console.log("Have a problem creating password.");
            });
        } else {
            res.redirect("/admin/users/create");
            console.log("User already created.")
        }
    });
});

router.get("/login", (req, res) => {
    res.render("admin/users/login")
});

router.post("/authenticate", (req, res) => {
    const {email, password} = req.body;

    if(email == undefined || email == ""){
        console.log("Use a valid email.")
        res.redirect("/login");
    }else{
       if(password == undefined || password == ""){
            console.log("Use a valid password.")
            res.redirect("/login");
        }else{

            User.findOne({where: {email: email}}).then(user => {
                    if(user != undefined){
                        const correct = bcrypt.compareSync(password, user. password); 
                        if(correct){
                            req.session.user = { id: user.id, email: user.email}  
                            jwt.sign({email: user.email},secretjwt,{expiresIn: "1h"},(err, token) => {
                                if(err){
                                    res.status(400);
                                    res.json({err: "Error"});
                                } else {
                                    
                                    //req.token = token;
                                    //res.status(200); 
                                    res.cookie('auth',token/*, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 45000 }*/);
                                    //res.json({token: token});
                                    res.redirect("/admin/articles");
                                    console.log("Authenticated");
                                
                                }
                            })
                        } else {
                            res.redirect("/login");
                            console.log("Is not authenticated")
                        }
                    } else {
                        res.redirect("/login");
                        console.log("User undefined")
                    }
                });
        } 
    }
});

router.get("/logout", (req, res) => {
    res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out " });
    req.session.user = undefined;
    res.redirect("/");
})



module.exports = router;

