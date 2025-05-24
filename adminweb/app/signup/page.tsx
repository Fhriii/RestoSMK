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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  no_hp: z.string().min(8, "No HP harus lebih dari 8"),
  alamat: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const SignUp01Page = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      username: "",
      no_hp: "",
      alamat: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit =async (data: z.infer<typeof formSchema>) => {
    try{
      const response = await fetch('http://127.0.0.1:8000/api/registrasi/',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      })
      const result = await response.json()
      if (response.ok) {
        localStorage.setItem("adminToken", result.access);
        toast.success("Login successful!"); 
        router.push("menu")
      } else {
        if (result.error) {
          toast.error(result.error); 
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
      <div className="max-w-xs w-full flex flex-col items-center">
        <p className="mt-4 mb-10 text-xl font-bold tracking-tight">
          Daftar Akun Restoran SMK
        </p>
        <Form {...form}>
          <form
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username"
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
              name="no_hp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomer Hp</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nomer Hp"
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
              name="alamat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Alamat"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full">
              Daftar Akun
            </Button>
          </form>
        </Form>

        <p className="mt-5 text-sm text-center">
          Sudah punya akun?
          <Link href="/" className="ml-1 underline text-muted-foreground">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp01Page;
