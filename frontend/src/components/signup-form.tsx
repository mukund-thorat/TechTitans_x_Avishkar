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
import { useRegisterMutation } from "@/api/authHooks";
import { Spinner } from "@/components/ui/spinner.tsx";
import { toast } from "sonner";
import { z } from "zod";
import { getApiBaseUrl } from "@/api/http.ts";

const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export function SignupForm({
    className,
    ...props
}: ComponentProps<"div">) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const signupMutation = useRegisterMutation()
    const navigate = useNavigate()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrors({})

        const formData = new FormData(event.currentTarget)
        const payload = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        }

        const result = signupSchema.safeParse(payload)

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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...signupData } = result.data
        signupMutation.mutate(signupData, {
            onSuccess: () => {
                sessionStorage.setItem("email", signupData.email)
                toast.success("Account created successfully. Please verify your email.")
                navigate("/signup/otp")
            },
            onError: (error: any) => {
                setErrors({
                    form: error.message || "Registration failed"
                })
            },
        })
    }

    const getGoogleLoginUrl = () => {
        return `${getApiBaseUrl()}/auth/google/login`;
    }

    return (
        <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
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
                            <div className="grid grid-cols-2 gap-4">
                                <Field data-invalid={!!errors.firstName}>
                                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                                    <Input id="firstName" name="firstName" type="text" placeholder="John" required />
                                    <FieldError>{errors.firstName}</FieldError>
                                </Field>
                                <Field data-invalid={!!errors.lastName}>
                                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                    <Input id="lastName" name="lastName" type="text" placeholder="Doe" required />
                                    <FieldError>{errors.lastName}</FieldError>
                                </Field>
                            </div>
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
                            <div className="grid grid-cols-2 gap-4">
                                <Field data-invalid={!!errors.password}>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input id="password" name="password" type="password" required />
                                </Field>
                                <Field data-invalid={!!errors.confirmPassword}>
                                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                                </Field>
                            </div>
                            {(errors.password || errors.confirmPassword) && (
                                <FieldError>{errors.password || errors.confirmPassword}</FieldError>
                            )}
                            <Field>
                                <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                                    {signupMutation.isPending ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <Spinner className="size-4" />
                                            Creating Account
                                        </div>
                                    ) : "Create Account"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    onClick={() => window.location.href = getGoogleLoginUrl()}
                                >
                                    Sign up with Google
                                </Button>
                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link to="/login" className="underline underline-offset-4">
                                        Login
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
