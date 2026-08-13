import type {NextFunction, Response, Request} from "express";
import { supabase } from "../lib/supabase.js";
import prisma from "../lib/prisma.js";


export async function RequireAuth(req: Request, res:Response, next:NextFunction){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token)
        return res.status(401).json({error: "unauthorized"})
    
    try {
        const {data, error}= await supabase.auth.getUser(token)
        if(error || !data.user){
            return res.status(401).json({error:"Invalid token"})
        }
        const dbUser= await prisma.user.findUnique({
            where: {id: data.user.id},
        })
        if(!dbUser){
            return res.status(401).json({error:"User not found"})

        }
        req.user = {
            id: dbUser.id,
            email: dbUser.email,
            name:dbUser.name,
            role: dbUser.role,
        }
        next();
    }catch(err){
        return res.status(403).json({error:"Verification failed"})
    }
}