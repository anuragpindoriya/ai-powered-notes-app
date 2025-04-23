import axios from "axios";
import {NextResponse} from "next/server";


const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

interface HuggingFaceResponse {
    summary_text: string;
}

export async function summarizeText(text: string): Promise<string> {
    try {
        const response = await axios.post<HuggingFaceResponse[]>(
            HUGGINGFACE_API_URL,
            {
                inputs: text,
                parameters: {
                    max_length: 150,
                    min_length: 30,
                    do_sample: false
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data[0].summary_text;
    } catch (error) {
        console.error('Error summarizing text:', error);
        throw new Error('Failed to summarize text');
    }
}


export async function POST(request: Request) {
    const {text} = await request.json();
    try {
        const summarizeData = await summarizeText(text);
        if (summarizeData) {
            return new NextResponse(summarizeData);
        }
    } catch (error) {
        // @ts-ignore
        return new NextResponse(error, 500);
    }

}