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
import { signup } from "@/lib/auth/actions";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  User2,
  KeyRound,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export function Signup() {
  const [state, formAction] = useFormState(signup, null);

  const wards = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

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
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started Today
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground/90">
              Join Our Survey <br />
              Management Platform
            </h1>
            <p className="text-muted-foreground max-w-sm">
              Create your account to start collecting and managing survey data
              efficiently. Join our network of dedicated enumerators.
            </p>
          </div>

          {/* Benefits list */}
          <div className="space-y-4">
            {[
              "Access to comprehensive survey tools",
              "Real-time data synchronization",
              "Secure data collection platform",
              "Interactive mapping features",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="relative w-full max-w-md mx-auto">
          <Card className="border-none shadow-lg shadow-primary/5">
            <CardHeader className="space-y-4 text-center pb-8">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Create Account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill in your details to create your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User2 className="h-4 w-4" />
                    </div>
                    <Input
                      required
                      id="name"
                      placeholder="Ram Prasad Koirala"
                      name="name"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Phone input with icon */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input
                      required
                      id="phoneNumber"
                      placeholder="9841234567"
                      name="phoneNumber"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Email input with icon */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      required
                      type="email"
                      id="email"
                      placeholder="ramprasadkoirala@gmail.com"
                      name="email"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Username input with icon */}
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
                      placeholder="ramprasad"
                      name="userName"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Ward select with icon */}
                <div className="space-y-2">
                  <Label htmlFor="wardNumber" className="text-sm font-medium">
                    Ward Number
                  </Label>
                  <div className="relative">
                    <Select name="wardNumber" required>
                      <SelectTrigger className="pl-9">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <SelectValue placeholder="Select your ward" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {wards.map((ward) => (
                            <SelectItem key={ward.value} value={ward.value}>
                              Ward {ward.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password inputs with icons */}
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
                      className="pl-9"
                      placeholder="********"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="repeatPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <PasswordInput
                      id="repeatPassword"
                      name="repeatPassword"
                      required
                      className="pl-9"
                      placeholder="********"
                    />
                  </div>
                </div>

                {/* Error states */}
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
                  Create Account
                </SubmitButton>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t bg-muted/50 p-6">
              <div className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline inline-flex items-center"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
