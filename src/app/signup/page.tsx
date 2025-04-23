'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '@/lib/supabase'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import Link from 'next/link'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        const {error} = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            router.push('/login')
        }

        setLoading(false)
    }

    const handleGoogleSignup = async () => {
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/notes`,
            },
        })

        if (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <form
                onSubmit={handleSignup}
                className="w-full max-w-sm p-6 space-y-4 border rounded-xl shadow-md"
            >
                <h2 className="text-2xl font-bold text-center">Create Account</h2>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignup}
                >
                    Continue with Google
                </Button>

                <p className="text-sm text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="underline text-blue-500">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}