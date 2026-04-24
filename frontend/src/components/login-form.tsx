import { useState, type ComponentProps, type FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/api/authHooks";
import { Spinner } from "@/components/ui/spinner.tsx";
import { toast } from "sonner";
import { z } from "zod";
import { getApiBaseUrl } from "@/api/http.ts";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export function LoginForm({
    className,
    ...props
}: ComponentProps<"div">) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const loginMutation = useLoginMutation()
    const navigate = useNavigate()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrors({})

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const result = loginSchema.safeParse({ email, password })

        if (!result.success) {
            const fieldErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                const path = issue.path[0]
                if (typeof path === "string") {
                    fieldErrors[path] = issue.message
                }
            })
            setErrors(fieldErrors)
            return
        }

        loginMutation.mutate(result.data, {
            onSuccess: (response) => {
                localStorage.setItem("access_token", response.access_token)
                toast.success("Logged in successfully")
                navigate("/dashboard")
            },
            onError: (error: any) => {
                setErrors({
                    form: error.message || "Invalid email or password"
                })
            },
        })
    }

    const getGoogleLoginUrl = () => {
        return `${getApiBaseUrl()}/auth/google/login`;
    }

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-sm", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            {errors.form && (
                                <div role="alert" className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                                    {errors.form}
                                </div>
                            )}
                            <Field data-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="student@example.com"
                                    required
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>
                            <Field data-invalid={!!errors.password}>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input id="password" name="password" type="password" required />
                                <FieldError>{errors.password}</FieldError>
                            </Field>
                            <Field>
                                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                    {loginMutation.isPending ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner className="size-4" />
                                            Logging in
                                        </div>
                                    ) : "Login"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    onClick={() => window.location.href = getGoogleLoginUrl()}
                                >
                                    Login with Google
                                </Button>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link to="/signup" className="underline underline-offset-4">
                                        Sign up
                                    </Link>
                                </div>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
