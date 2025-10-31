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
import Link from "@/components/ui/link";
import useRouter from "@/hooks/use-router";
import { ResponseBody } from "@/lib/types";
import { fetchAxios } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { StoreIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import zod from "zod";

const formSchema = zod.object({
  email: zod.string().email("Please enter a valid Email ID!"),
  password: zod.string().nonempty("Password is required!"),
});

type LoginFormSchema = zod.infer<typeof formSchema>;

export const SignIn = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (values: LoginFormSchema) => {
    startTransition(async () => {
      try {
        const { data } = await fetchAxios<ResponseBody>('post', '/api/auth/login', values);
        if (data.status !== 'success') {
          toast.error(data.message);
        } else {
          toast.success('Logged In! Redirecting...');
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
      <p className="text-base mb-8">Please login to view and handle your stores</p>

      <div>
        <Form {...form}>
          <form className="flex flex-col gap-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-primary-foreground rounded-sm h-10"
                        disabled={isPending}
                        placeholder="john.doe@mail.com"
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="border-primary-foreground rounded-sm h-10"
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                );
              }}
            />
            <Button size={"lg"} className="bg-primary-foreground w-full max-w-[70%] mx-auto text-primary hover:text-primary-foreground hover:bg-primary hover:border-primary-foreground hover:border transition-all duration-500 cursor-pointer" type="submit" disabled={isPending}>Sign In</Button>
          </form>
        </Form>
        <Link href={'/sign-up'} className="block text-sm underline mt-4">Don&apos;t have an account? Register now!</Link>
      </div>
    </div>
  );
};
