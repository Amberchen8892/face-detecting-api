
const handleRegister = (req,res,db,bcrypt)=>{
    const {firstname,lastname,email, password} = req.body;
    if(!email || !lastname || !firstname || !password){
        return res.status(400).json('wrong submition form')
    }
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hass:hash,
                email:email
            })
            .into('login')
            .returning('email')
            .then(loginEmail =>{
                return trx('users')
                    .returning('*')
                    .insert({
                    lastname:lastname,
                    firstname: firstname,
                    email:loginEmail[0],
                    joined:new Date()
                })
                .then(user => {
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)

           
        })
        
        .catch(err => res.status(400).json('unable to register'))
    
}

module.exports ={
    handleRegister : handleRegister
}