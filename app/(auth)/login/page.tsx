"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/@types/types";
import { userAtom } from "@/stores/store";
import { useAtom } from "jotai";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters",
    })
    .max(50),
  password: z
    .string()
    .min(2, {
      message: "Password must be at least 2 characters",
    })
    .max(50),
});

const Login = () => {
  const [, setUser] = useAtom(userAtom);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      const newUser: User = {
        id: data.user.id,
        username: data.user.username,
        created_at: data.user.created_at,
      };

      setUser(() => newUser);
      toast({
        description: "Logged in successfully",
      });
    } else {
      toast({
        variant: "destructive",
        description: data.error,
      });
    }
  }

  return (
    <div className="flex flex-col items-start w-full justify-center gap-10">
      <h1 className="font-bold text-5xl">Login</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your Username" {...field} />
                </FormControl>
                <FormDescription>Your username</FormDescription>
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      placeholder="Your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-4 w-4 text-gray-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          className="h-4 w-4 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>Your Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="text-sm ">
        Do&apos;t have an account ?{" "}
        <Link href={"/signup"} className="text-green-500">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Login;
