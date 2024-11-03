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
import { useRouter } from "next/navigation";
import { userAtom } from "@/stores/store";
import { useAtom } from "jotai";
import { toast } from "@/hooks/use-toast";

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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      const data = await res.json();
      const newUser: User = {
        id: data.user.id,
        username: data.user.username,
        created_at: data.user.created_at,
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(() => newUser);
      toast({
        description: "Logged in successfully",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong !!",
      });
    }
  }

  return (
    <div className="flex flex-col items-start w-full justify-center gap-10">
      <h1 className="font-bold text-white text-5xl">Login</h1>
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
                  <Input placeholder="shadcn" {...field} />
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
                  <Input placeholder="shadcn" type="password" {...field} />
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
