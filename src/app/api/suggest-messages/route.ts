import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? ||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        // Fetch from the Hugging Face Inference API
        const response = await fetch("https://api-inference.huggingface.co/models/MysteryMsg", {
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

        // Parse the JSON response
        const data = await response.json();
        
        // Prepare a readable stream to progressively send chunks of data to the client
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                const output = data[0]?.generated_text || "No response from the model";
                controller.enqueue(encoder.encode(output));
                controller.close();
            },
        });

        return new NextResponse(stream);
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
