'use client';

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
import Link from "@/components/ui/link";
import { ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { StoreIcon } from "lucide-react";
import useRouter from "@/hooks/use-router";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import zod from "zod";

const formSchema = zod.object({
  name: zod.string().min(2, "Name should be atleast 2 characters!"),
  email: zod.string().email("Please enter a valid Email ID!"),
  password: zod.string().min(8, "Password must be atleast 8 characters!"),
});

type RegisterFormSchema = zod.infer<typeof formSchema>;

export const SignUp = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: RegisterFormSchema) => {
    startTransition(async () => {
      try {
        const { data } = await fetchAxios<ResponseBody>('post', '/api/auth/register', values);
        if (data.status !== 'success') {
          toast.error(data.message);
        } else {
          toast.success('Registered Successfully! Redirecting...');
          router.replace('/');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || 'Something Went Wrong!');
          console.log(error);
        } else {
          console.log(error);
          toast.error('Something Went Wrong!');
        }
      }
    });
  };

  return (
    <div className="p-12 min-w-[600px] bg-primary text-primary-foreground text-center rounded-xl">
      <div className="flex flex-row-reverse justify-center items-center gap-x-2 mb-2">
        <StoreIcon size={24} />
        <h1 className="text-2xl font-bold font-mono">StoreFlowNest</h1>
      </div>
      <p className="text-base mb-8">
        Please register to view and handle your stores
      </p>

      <Form {...form}>
        <form className="flex flex-col gap-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="John Doe"
                    className="border-primary-foreground rounded-sm h-10"
                  />
                </FormControl>
                <FormMessage className="text-left" />
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
                    {...field}
                    disabled={isPending}
                    placeholder="john.doe@mail.com"
                    className="border-primary-foreground rounded-sm h-10"
                  />
                </FormControl>
                <FormMessage className="text-left" />
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
                    {...field}
                    disabled={isPending}
                    placeholder="********"
                    className="border-primary-foreground rounded-sm h-10"
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
          <Button size={"lg"} className="bg-primary-foreground w-full max-w-[70%] mx-auto text-primary hover:text-primary-foreground hover:bg-primary hover:border-primary-foreground hover:border transition-all duration-500 cursor-pointer" type="submit" disabled={isPending}>Sign Up</Button>
        </form>
      </Form>
      <Link href={'/sign-in'} className="block mt-4 text-sm underline">Already have an account? Sign In!</Link>
    </div>
  );
};
