"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

const Login02Page = () => {
  const [errorMessage,setErrorMessage]=useState("")
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setErrorMessage("")
    try{
      const response = await fetch('http://127.0.0.1:8000/api/login/',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      })
      const result = await response.json()
      if (response.ok) {
        localStorage.setItem("adminToken", result.access);
        toast.success("Login successful!"); 
        router.push("/menu");
      } else {
        if (result.detail) {
          toast.error(result.detail); 
        } else {
          toast.error("Login gagal, email atau password salah."); 
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred"); 
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6 shadow-sm">
        <p className="mt-4 mb-10 text-xl font-bold tracking-tight">
          Log in to Restoran SMK
        </p>

       

        <Form {...form}>
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full">
              Login
             </Button>
          </form>
        </Form>

        <div className="mt-5 space-y-5">
          <Link
            href="#"
            className="text-sm block underline text-muted-foreground text-center"
          >
            Forgot your password?
          </Link>
          <p className="text-sm text-center">
            Tidak punya akun?
            <Link href="/registrasi" className="ml-1 underline text-muted-foreground">
              Daftar akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login02Page;
