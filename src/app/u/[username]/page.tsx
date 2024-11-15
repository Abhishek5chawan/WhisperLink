"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";

// Constants and functions
const specialChar = "||";
const parseStringMessages = (messageString: string): string[] => messageString.split(specialChar);

const MessagePage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const messageContent = form.watch("content");

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post<string>("/api/suggest-messages");
      setSuggestedMessages(parseStringMessages(response.data));
    } catch (error) {
      console.error("Error fetching suggested messages:", error);
      toast({
        title: "Error fetching messages",
        description: "Failed to fetch message suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        ...data,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });

      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 text-white">
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16 md:px-24 max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Send a Mystery Message to @{username}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-indigo-200">
            Share your thoughts anonymously
          </p>
        </section>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full bg-white bg-opacity-90 p-8 rounded-lg shadow-2xl space-y-6 transform transition-transform duration-300 hover:scale-105"
          >
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-gray-700">
                    Your Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none p-4 text-base border text-gray-700 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!messageContent}
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-500"
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <section className="w-full mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-white">
              Need Some Ideas?
            </h3>
            <Button
              onClick={fetchSuggestedMessages}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-400"
              disabled={isSuggestLoading}
            >
              {isSuggestLoading ? "Loading..." : "Suggest Messages"}
            </Button>
          </div>

          <Card className="shadow-xl rounded-lg bg-white bg-opacity-90">
            <CardHeader className="text-lg font-medium text-indigo-700 px-4 py-3">
              Suggested Messages
            </CardHeader>
            <CardContent className="flex flex-col space-y-3 p-4">
              {suggestedMessages.length === 0 ? (
                <p className="text-gray-500">
                  No messages available. Click "Suggest Messages" to get ideas.
                </p>
              ) : (
                suggestedMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full bg-gray-100 text-left px-4 py-2 rounded-md text-gray-800 hover:bg-indigo-50 hover:text-indigo-800 overflow-hidden whitespace-nowrap text-ellipsis"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8 border-gray-200" />

        <div className="text-center">
          <p className="text-lg mb-4">Create your own mystery board</p>
          <Link href={"/sign-up"}>
            <Button className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-400">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>

      <footer className="text-center p-6 text-sm bg-gray-900 text-gray-400 border-t border-gray-700">
        © 2024 Mystery Message. All rights reserved.
      </footer>
    </div>
  );
};

export default MessagePage;
