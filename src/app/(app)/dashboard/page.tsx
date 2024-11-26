'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User.model';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { useRouter } from 'next/navigation';

function UserDashboard() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.createdAt.toString() !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);

      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div className="text-xl font-sans text-gray-600 text-center mt-8">Session is over</div>;
  }

  const { username } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    alert('Profile URL has been copied to clipboard. Go to new tab and paste the link. To send messages using AI');
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-500 to-indigo-700 text-white">
      <main className="container max-w-4xl p-8 mx-auto mt-16 bg-white bg-opacity-90 rounded-lg shadow-lg space-y-8 text-gray-800">
        <h1 className="text-4xl font-bold text-indigo-600 text-center">User Dashboard</h1>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-indigo-600">Copy Your Unique Link</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-grow p-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
            />
            <Button onClick={copyToClipboard} className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-green-600">
              Copy
            </Button>
          </div>
        </section>

        <section className="flex items-center space-x-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-lg font-medium">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </section>

        <Separator className="border-t border-gray-200" />

        <Button
          className="flex items-center justify-center w-full py-2 mt-4 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-400"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
          <span className="ml-2">Refresh Messages</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message.createdAt.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
                className="transition-transform transform hover:scale-105 hover:shadow-2xl"
              />
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-500">No messages to display.</p>
          )}
        </div>
      </main>

      <footer className="w-full py-6 mt-8 text-center text-sm bg-gray-900 text-gray-400">
        © 2024 Mystery Message. All rights reserved.
      </footer>
    </div>
  );
}

export default UserDashboard;
