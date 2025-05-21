import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  country: z.string().min(1, "País é obrigatório"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "Você deve concordar com os termos" }),
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formError, setFormError] = useState("");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      agreeToTerms: false,
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setFormError("");

      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao fazer login.");
      }

      const { access_token } = await response.json();
      localStorage.setItem("accessToken", access_token);

      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao Aegis Security.",
      });

      navigate("/welcome");
    } catch (error: any) {
      setFormError(error.message);
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setFormError("");

      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao fazer cadastro.");
      }

      const userProfile = await response.json();
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      localStorage.setItem("userEmail", userProfile.email);

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo ao Aegis Security.",
      });

      navigate("/welcome");
    } catch (error: any) {
      setFormError(error.message);
      toast({
        title: "Erro ao fazer cadastro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {isRegistering ? (
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(handleRegister)}>
            <FormField
              control={registerForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Outros campos de registro */}
          </form>
        </Form>
      ) : (
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleLogin)}>
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Outros campos de login */}
          </form>
        </Form>
      )}
    </div>
  );
};

export default Login;