import { Router } from "express";
import { supabase } from "@/lib/supabase.js";
import prisma from "@/lib/prisma.js";


const router = Router()

router.post("/signup", async(req, res)=>{
    const {email, name, password} = req.body;
    if(!email ||!name|| !password){
        return res.status(400).json({error:"email, name and password required!"})
    }
    
    const {data, error }  = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm:true}
    )
    if (error || !data.user){
        return res.status(400).json({error: error?.message?? "signup failed"})
    }
    if (!data.user.email) {                          
    return res.status(400).json({ error: "Signup failed: no email returned" });
  }


    const dbUser =  await prisma.user.create({
        data:{
            id: data.user.id,
            email: data.user.email,
            name,
            role: "STAFF",
        },
    });
    res.status(201).json({user:dbUser})

})

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return res.status(401).json({ error: error?.message ?? "Invalid credentials" });
  }

  res.json({ session: data.session });
});

export default router;