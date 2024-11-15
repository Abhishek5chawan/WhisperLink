"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User.model";
import { X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  className?: string;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const date = new Date(message.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDeleteConfirm = async () => {
    const message_id = message.createdAt.toString();
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message_id}`);

    toast({
      title: response.data.message,
    });
    onMessageDelete(message_id);
  };

  return (
    <div className="w-full p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-lg transform transition-all hover:scale-105">
      <Card className="bg-white bg-opacity-80 rounded-lg shadow-xl overflow-hidden">
        <CardHeader className="flex items-center justify-between p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-800">{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-red-500 hover:bg-red-50 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold text-gray-800">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  This action cannot be undone. This will permanently delete your message.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex space-x-4 mt-4">
                <AlertDialogCancel className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        <CardContent className="p-4 text-gray-500 text-sm">
          <span>Sent on {formattedDate}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export { MessageCard };
