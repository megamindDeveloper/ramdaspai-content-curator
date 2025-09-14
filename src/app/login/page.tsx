
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth-context";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithEmailAndPassword, signUpWithEmailAndPassword, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleEmailAuth = async (data: FormValues, authFunction: (email: string, pass: string) => Promise<any>) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await authFunction(data.email, data.password);
    } catch (error: any) {
        let message = "An unexpected error occurred.";
        if (error.code) {
            switch(error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    message = 'Invalid email or password.';
                    break;
                case 'auth/email-already-in-use':
                    message = 'This email is already in use.';
                    break;
                case 'auth/weak-password':
                    message = 'The password is too weak.';
                    break;
                default:
                    message = 'Authentication failed. Please try again.';
            }
        }
      setAuthError(message);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onSignIn = (data: FormValues) => {
    handleEmailAuth(data, signInWithEmailAndPassword);
  }

  const onSignUp = (data: FormValues) => {
    handleEmailAuth(data, signUpWithEmailAndPassword);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Content Curator</CardTitle>
          <CardDescription>
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignIn)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {authError && <p className="text-sm font-medium text-destructive">{authError}</p>}
                  <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSignUp)} className="space-y-4 pt-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input
                                placeholder="m@example.com"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input
                                type="password"
                                placeholder="******"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {authError && <p className="text-sm font-medium text-destructive">{authError}</p>}
                    <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
          </div>

          <Button
            onClick={signInWithGoogle}
            className="w-full"
            variant="outline"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
