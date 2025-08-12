"use client"
import { Text } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {useRouter} from "next/navigation";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function VerifyPage() {
    const router = useRouter();

    const handleResend = async () => {
        const email = localStorage.getItem("pendingEmail");
        try {
        const res = await fetch("http://localhost:8080/api/auth/resend-verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        });
        const data = await res.text();
        alert(data);
    } catch(err) {
        console.error("Failed to resend:", err);
        alert("Failed to resend verification link.")
    }
}

    const handleGoToLogin = async () => {
        const email = localStorage.getItem("pendingEmail");
        try {
            const res = await fetch(`http://localhost:8080/api/auth/is-verified?email=${email}`);
            const isVerified = await res.json();

            if(isVerified) {
                router.push("/login");
            }
            else {
                alert("You still need to verify your email.");
            }
        } catch(err) {
            console.error("Error checking verification", err);
            alert("Something went wrong");
        }
    };

    return (
        <div className = "flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
            <ShineBorder shineColor={["#0d0d0d", "#595959", "#c0c0c0", "#f5f5f5"]}
            borderWidth={3}
            duration={6}
            className="rounded-2xl">
            <Card className = "w-[600px] bg-zinc-800">
                <CardHeader>
                    <CardTitle className = "text-center font-serif text-white">Verify Your Account</CardTitle>
                    <CardDescription className = "text-center font-mono text-white">
                        <TypingAnimation className = "text-sm font-mono" duration = {70}>Use the verification link sent to your email.</TypingAnimation>
                    </CardDescription>
                </CardHeader>
                <CardFooter className = "flex flex-col space-y-4 items-center">
                    <Button className = "transition-transform duration-100 active:scale-95 font-mono" onClick = {handleResend}>Resend Verification</Button>
                    <Button className = "transition-transform duration-100 active:scale-95 font-mono" variant = "secondary" onClick = {handleGoToLogin}>Already Verified? Log In</Button>
                </CardFooter>
            </Card>
            </ShineBorder>
        </div>
    );
}