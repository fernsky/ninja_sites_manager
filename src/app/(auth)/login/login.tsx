"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/password-input";
import { APP_TITLE } from "@/lib/constants";
import { login } from "@/lib/auth/actions";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { Building2, User2, KeyRound, ArrowRight } from "lucide-react";

export function Login() {
  const [state, formAction] = useFormState(login, null);

  return (
    <div className="relative min-h-screen w-full grid place-items-center bg-gradient-to-tr from-background via-background to-primary/5 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-full max-w-6xl aspect-[2/1]">
          {/* Gradient circles */}
          <div className="absolute -left-4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -right-4 top-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-300" />

          {/* Decorative shapes */}
          <div className="absolute left-1/4 top-1/4 h-16 w-16 rounded-xl border border-primary/10 animate-float" />
          <div className="absolute right-1/4 bottom-1/4 h-20 w-20 rounded-full border border-primary/10 animate-float-slow" />
          <div className="absolute right-1/3 top-1/3 h-12 w-12 rounded-lg border border-primary/10 rotate-45 animate-float-slower" />
        </div>
      </div>

      {/* Content container with backdrop blur */}
      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center p-8">
        {/* Left side - Welcome content */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="relative space-y-4">
            <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <div className="mr-2 h-1 w-1 rounded-full bg-primary" />
              Welcome back
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
              Sites Management System
            </h1>
            <p className="text-muted-foreground max-w-sm">
              Access your dashboard to manage multiple websites, track
              performance, and streamline your digital presence across all
              platforms.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-4 text-muted-foreground">
            {[
              "Multi-site dashboard and analytics",
              "Centralized website management",
              "Performance monitoring and optimization",
              "SEO tracking and reporting tools",
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="relative w-full max-w-md mx-auto">
          <Card className="border-none shadow-lg shadow-primary/5">
            <CardHeader className="space-y-4 text-center pb-8">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                {APP_TITLE}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Log in to manage your websites and digital properties
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User2 className="h-4 w-4" />
                    </div>
                    <Input
                      required
                      id="userName"
                      placeholder="ramprasadkoirala"
                      autoComplete="userName"
                      name="userName"
                      type="text"
                      className="pl-9 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <PasswordInput
                      id="password"
                      name="password"
                      required
                      autoComplete="current-password"
                      placeholder="********"
                      className="pl-9"
                    />
                  </div>
                </div>

                {state?.fieldError && (
                  <div className="animate-in fade-in-50 slide-in-from-bottom-1">
                    <ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-3 text-[0.8rem] font-medium text-destructive">
                      {Object.values(state.fieldError).map((err) => (
                        <li className="ml-4" key={err}>
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {state?.formError && (
                  <div className="animate-in fade-in-50 slide-in-from-bottom-1">
                    <p className="rounded-lg border bg-destructive/10 p-3 text-[0.8rem] font-medium text-destructive">
                      {state.formError}
                    </p>
                  </div>
                )}

                <SubmitButton
                  className="w-full bg-primary font-medium hover:bg-primary/90"
                  size="lg"
                >
                  Sign In
                </SubmitButton>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t bg-muted/50 p-6">
              <div className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline inline-flex items-center"
                >
                  Create account
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
