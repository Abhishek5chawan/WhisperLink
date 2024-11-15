'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
      <main className="flex-grow flex flex-col items-center justify-center px-6 md:px-24 py-16 text-white max-h-[80vh]">
        
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Dive into the World of Mystery Messages
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-indigo-200">
            Explore the intriguing world of Mystery Messages
          </p>
        </section>
        
        <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full max-w-lg shadow-xl rounded-lg overflow-hidden">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="rounded-lg border border-transparent shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    <CardHeader className="px-4 py-3 bg-white bg-opacity-90 text-indigo-700 font-semibold text-center rounded-t-lg">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6 text-center text-lg font-medium text-gray-800 bg-white bg-opacity-90">
                      {message.content}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-indigo-200 hover:text-white transition-colors duration-200" />
          <CarouselNext className="text-indigo-200 hover:text-white transition-colors duration-200" />
        </Carousel>
        
      </main>
      
      <footer className="text-center p-6 text-sm md:text-base bg-gray-900 text-gray-400 border-t border-gray-700">
        © 2024 Mystery Message. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
