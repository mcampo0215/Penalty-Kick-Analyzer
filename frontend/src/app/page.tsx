"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import * as React from "react"
import { useState } from "react"
import {useRouter} from "next/navigation";
import { ShineBorder } from "@/components/magicui/shine-border";

  export default function Page() {
    const router = useRouter();
    const[showPassword, setShowPassword] = useState(false);
    const[form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const[message, setMessage] = useState("");
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.id]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if(!form.username.trim() || !form.email.trim()) {
            alert("You are missing your username or email.");
            return;
        }
        else if(!form.password.trim()) {
            alert("You must create a password.");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }),
            });
            if(res.ok) {
                localStorage.setItem("pendingEmail", form.email);
                router.push("/verify");
            }
            else {
                const errorMessage = await res.text();
                setMessage(errorMessage);
            }
        } catch(error) {
            console.error("Error:", error);
            setMessage("Something went wrong.");
        }
    };


    return (
        <div className = "flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
            <ShineBorder shineColor={["#0d0d0d", // deep black
    "#595959", // mid gray
    "#c0c0c0", // chrome silver
    "#f5f5f5"]}
            borderWidth={3}
            duration={6}
            className="rounded-2xl">
        <Card className = "w-[800px] bg-zinc-800">
            <CardHeader>
                 <CardTitle className = "font-serif text-white text-center">Create An Account</CardTitle>
                 <CardDescription className = "font-mono text-white text-center">Welcome to App</CardDescription>
            </CardHeader>

            <form onSubmit = {handleSubmit}>
                <div className = "flex flex-col items-center gap-4 mx-auto">
                    <div className = "flex flex-col space-y-1.5">
                        <Label className = "font-mono text-white" htmlFor = "username">Username</Label>
                        <Input className = "bg-zinc-900 text-white h-10"id = "username" value = {form.username} onChange = {handleChange} placeholder = "Enter Username"></Input>
                    </div>

                    <div className = "flex flex-col space-y-1.5">
                        <Label className = "font-mono text-white" htmlFor = "email">Email</Label>
                        <Input className="bg-zinc-900 text-white h-10" id = "email" value = {form.email} onChange = {handleChange} placeholder = "Enter Email"></Input>
                    </div>

                    <div className = "flex flex-col space-y-1.5">
                        <Label className = "font-mono text-white" htmlFor = "password">Password</Label>
                        <div className = "relative">
                        <Input className = "bg-zinc-900 text-white h-10" type = {showPassword ? "text" : "password"}id = "password" value = {form.password} onChange = {handleChange} placeholder = "Enter Password"></Input>
                        <button type = "button" className = "text-white absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white" onClick = {() => {setShowPassword((prev) => !prev)}}>{showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>}</button>
                        </div>
                    </div>

                    <div className = "flex flex-col space-y-1.5">
                        <Label className = "font-mono text-white" htmlFor = "confirmPassword">Confirm Password</Label>
                        <div className = "relative">
                        <Input className="bg-zinc-900 text-white h-10"type = {showPassword ? "text" : "password"}id = "confirmPassword" value = {form.confirmPassword} onChange = {handleChange} placeholder = "Re-Enter Password"></Input>
                        <button type = "button" className = "text-white absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white" onClick = {() => {setShowPassword((prev) => !prev)}}>{showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>}</button>
                        </div>
                    </div>
                </div>
                <CardFooter className = "flex justify-center">
                    <Button type = "submit" className = "font-serif transition-transform duration-100 mt-6 active:scale-95">Create Account</Button>
                </CardFooter>
            </form>
            </Card>
            </ShineBorder>
        </div>

    )
  }