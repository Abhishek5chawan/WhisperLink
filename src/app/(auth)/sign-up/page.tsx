'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useDebounceCallback } from 'usehooks-ts';
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const Page = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username unique");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast({
                title: "Success",
                description: response.data.message,
            });
            router.replace(`/verify/${username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Signup failed",
                description: axiosError.response?.data.message ?? "Error signing up",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-indigo-600">Sign Up</h1>
                    <p className="mt-2 text-gray-500">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600">Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Choose a unique username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            className="border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin text-indigo-500" />}
                                    <p className={`text-sm ${usernameMessage === "Username available and unique" ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter your email"
                                            {...field} 
                                            className="border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200"
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
                                    <FormLabel className="text-gray-600">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="password"
                                            placeholder="Choose a strong password"
                                            {...field}
                                            className="border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up...
                                </>
                            ) : 'Sign Up'}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-6">
                    <p className="text-gray-500">
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-indigo-600 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;
