const  handleSignIn = (req,res,db,bcrypt)=>{
    const {email,password}= req.body
    if (!email || !password){
        return res.status(400).json('you need to enter email or password')
    }
    db.select('email', 'hass').from('login')
        .where('email', '=',email)
        .then(data =>{
            const isValid= bcrypt.compareSync(password,data[0].hass); 
            if(isValid){
                return db.select('*').from('users')
                    .where('email','=',email)
                    .then(user =>{
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('wrong email or password'))
            } else{
                res.status(400).json('wrong password or email')
            }
        })
        .catch(err => res.status(400).json('wrong password or emai'))
}

module.exports={
    handleSignIn: handleSignIn
}