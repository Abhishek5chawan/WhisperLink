import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
    try {
        const randomWords = ["mystery", "wonder", "imagine", "surprise", "explore", "adventure", "travel", "", "fun", "food", "funny", "thought-provoking", "engaging", "lighthearted", "creative", "health", "love", "art", "travel", "adventure", "food", "fun", "funny", "thought-provoking", "engaging", "lighthearted", "creative", "health", "love", "art"];
        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
        const prompt = `Generate a random, short, and friendly message that is more than 15 characters but less than 100 characters. The message should be engaging, lighthearted, creative, and suitable for all audiences. Avoid personal or sensitive topics. Use the theme '${randomWord}' to inspire uniqueness in the response.`;


        // Fetch from the Hugging Face Inference API
        const response = await fetch("https://api-inference.huggingface.co/models/distilgpt2", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        // Ensure a successful response from Hugging Face API
        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(error, { status: response.status });
        }

        // Parse the JSON response and clean up the generated text
        const data = await response.json();
        let generatedText = data[0]?.generated_text || "No response from the model";

        // Remove the prompt part from the generated text if it appears
        if (generatedText.includes(prompt)) {
            generatedText = generatedText.replace(prompt, "").trim();
        }

        // Create a readable stream to send the cleaned generated output
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode(generatedText));
                controller.close();
            },
        });

        return new NextResponse(stream);
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
