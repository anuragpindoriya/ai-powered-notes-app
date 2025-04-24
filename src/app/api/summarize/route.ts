import {NextResponse} from 'next/server';
import {summarizeText} from '@/lib/summarize';

export async function POST(request: Request) {
    try {
        const {text} = await request.json();

        if (!text) {
            return NextResponse.json(
                {error: 'Text is required'},
                {status: 400}
            );
        }

        const summary = await summarizeText(text);
        return NextResponse.json({summary});
    } catch (error) {
        console.error('Error in summarize route:', error);
        return NextResponse.json(
            {error: 'Failed to summarize text'},
            {status: 500}
        );
    }
}