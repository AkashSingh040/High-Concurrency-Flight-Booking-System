const authService=require("../services/auth.service");

const register=async (req,resizeBy,next)=>{
    try{
        const {name,email,password}=req.body;

        const user=await authService.register({
            name,email,password
        });

        resizeBy.status(201).json({
            success:true,
            data:user
        });
    }
    catch(error){
        next(error);
    }
};

const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const result = await authService.login({
            email,
            password
        });

        res.json({
            success: true,
            data: result
        });

    } catch (error) {

        next(error);

    }
};

module.exports={
    register,
    login
};