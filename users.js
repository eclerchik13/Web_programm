const mongoose = require("mongoose");
const argon2 = require('argon2')

const uri = "mongodb+srv://eclerchik13:mango1310valeria@cluster0.ge5qc.mongodb.net/EclerUsers?retryWrites=true&w=majority"

//////////-schema/model of users-///////////

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    login:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

UserSchema.methods.VerificationPassword = async function(password){
    return await argon2.verify(this.password, password);
}

const User = mongoose.model("User",UserSchema);

////////////////- Data Base - //////////////////

function ConnectBase(uri){
    mongoose.connect(uri,
        {useUnifiedTopology: true,
            useNewUrlParser: true }).then(()=> {
        console.log("Connect to Data Base is successful")
    });
}

async function AddNewUser(login, password){
    const HashPass = await argon2.hash(password);
    console.log("HASH" + HashPass);

    let userUp = new User({
        login: login,
        password: HashPass,
    });

    argon2.verify(HashPass, password).then(()=>{
        userUp.save().then(()=>{
            console.log("Successful conservation")
        })
    }).catch((err)=> {
        console.log("ERROR:" + err.message)
        userUp = undefined;
    })
    return userUp;
}

module.exports.AddNewUser = AddNewUser;
module.exports.ConnectBase = ConnectBase;
module.exports.User = User;
module.exports.Uri = uri;