'use client';
import Link from 'next/link'
import {Button} from "@/components/ui/button";

export default function LoginPage() {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const router = useRouter();
    //
    // const handleLogin = async () => {
    //     const {error} = await supabase.auth.signInWithPassword({email, password});
    //     if (!error) router.push('/notes');
    // };

    return (
        <div>
            <main
                className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-white to-gray-100">
                <div className="max-w-2xl text-center space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                        Welcome to <span className="text-blue-600">AI-Note</span>
                    </h1>

                    <p className="text-lg text-gray-600">
                        Capture thoughts, organize notes, and let AI summarize them for you. Your personal productivity
                        assistant.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/login">
                            <Button className="w-full sm:w-auto px-6">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="outline" className="w-full sm:w-auto px-6">Sign Up</Button>
                        </Link>
                    </div>
                </div>

                <footer className="absolute bottom-4 text-sm text-gray-500">
                    Built with ❤️ using Next.js, Supabase, and Shadcn UI
                </footer>
            </main>
        </div>
    );
}