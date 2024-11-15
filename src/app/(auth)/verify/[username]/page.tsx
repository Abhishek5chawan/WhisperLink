'use client';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            toast({
                title: "Success",
                description: response.data.message,
            });

            router.replace('sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Verification failed",
                description: axiosError.response?.data.message ?? "Error verifying code",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-indigo-600">Verify Your Account</h1>
                    <p className="mt-2 text-gray-500">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-600">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter code" 
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
                            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default VerifyAccount;
