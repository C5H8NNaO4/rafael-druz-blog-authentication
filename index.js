const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const session = require('express-session');

const cookieParser = require('cookie-parser');

   


//view engine
app.set('view engine', 'ejs');


//Cookie-parser

app.use(cookieParser("senhacookie"));

//Sessions
app.use(session({
    secret: "hsyasbalsfgarrsgx", 
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 30000} 
}));
 

//static
app.use(express.static('public'));

//bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Router Categories
const categoriesController = require("./categories/CategoriesController.js");
app.use("/", categoriesController);

// Router Articles
const articlesController = require("./articles/ArticlesController.js");
app.use("/", articlesController);

//Router Users
const userController = require("./user/UserController.js")
app.use("/",userController);

//Models
const Article = require("./articles/Article.js");
const Category = require("./categories/Category.js");


//database
const db = require('./databases/database');


app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ], 
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
           res.render("index", {articles: articles, categories: categories});  
        });
    });
})



app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});  
             });
        }else{
            res.redirect("/");
        }
    });
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            });
        }else{
            res.redirect("/");
        }
    })
})

app.listen(8086, () => {
    console.log("O servidor esta operando.")
})