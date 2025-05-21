import React, { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, FingerprintIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Login schema
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFaceRecognition, setIsFaceRecognition] = useState(false);
  const [formError, setFormError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturing, setCapturing] = useState(false);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setFormError("");

      const response = await axios.post("http://localhost:8000/login", {
        email: values.email,
        password: values.password,
      });

      const data = response.data;

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userEmail", values.email);

      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao Aegis Security.",
      });

      navigate("/welcome");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      setFormError("Erro ao fazer login. Verifique suas credenciais.");
      toast({
        title: "Erro ao fazer login",
        description:
          error?.response?.data?.detail || error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const openCamera = async () => {
    setCameraError("");
    setCapturing(true);
    setIsFaceRecognition(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setCameraError("Não foi possível acessar a câmera.");
      setCapturing(false);
      setIsFaceRecognition(false);
    }
  };

  const stopCamera = () => {
    setIsFaceRecognition(false);
    setCapturing(false);
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFaceRecognition = async () => {
    await openCamera();
  };

  const captureAndSend = async () => {
    if (!videoRef.current) return;

    // Captura o frame atual da webcam
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

    // Converte imagem para blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        const formData = new FormData();
        formData.append("face_image", blob, "face.jpg");

        // Chama endpoint de login facial
        const response = await axios.post(
          "http://localhost:8000/login-face",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const data = response.data;
        localStorage.setItem("token", data.access_token);
        toast({
          title: "Login facial bem-sucedido",
          description: "Bem-vindo ao Aegis Security.",
        });
        stopCamera();
        navigate("/welcome");
      } catch (error: any) {
        toast({
          title: "Falha no reconhecimento facial",
          description:
            error?.response?.data?.detail ||
            error.message ||
            "Erro desconhecido",
          variant: "destructive",
        });
        stopCamera();
      }
    }, "image/jpeg");
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background elements (mantido igual) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-0 w-full h-32 bg-aegis-purple/30 blur-[100px] transform -translate-y-1/2"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          ></div>
        ))}
        <div className="absolute top-[15%] right-[10%] text-white/20 transform rotate-12 animate-float">
          <ShieldCheck size={24} />
        </div>
        <div
          className="absolute bottom-[20%] left-[15%] text-white/20 transform -rotate-12 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <ShieldCheck size={32} />
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center backdrop-blur-lg bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(160,32,240,0.3)] z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-aegis-purple rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-medium text-white mb-2">Login Aegis</h1>
        <p className="text-white/60 text-center mb-8 text-sm">
          Entre na sua conta para proteger seus dados com o Aegis Security
        </p>
        {formError && (
          <div className="w-full bg-red-500/20 border border-red-500/50 rounded-md p-3 mb-4">
            <p className="text-red-400 text-sm">{formError}</p>
          </div>
        )}

        {isFaceRecognition ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-64 h-64 relative mb-8">
              <video
                ref={videoRef}
                width={256}
                height={256}
                className="rounded-lg border-2 border-aegis-purple"
                autoPlay
                muted
                playsInline
                style={{
                  display: capturing ? "block" : "none",
                  objectFit: "cover",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <FingerprintIcon className="h-24 w-24 text-aegis-purple/70 animate-pulse" />
              </div>
            </div>
            {cameraError && (
              <p className="text-red-400 text-center mb-4">{cameraError}</p>
            )}
            <div className="flex flex-row gap-4">
              <Button
                onClick={captureAndSend}
                className="bg-aegis-purple text-white"
                disabled={!capturing}
              >
                Capturar e Entrar
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="w-full space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          className="bg-white/5 border-white/10 text-white h-12 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Senha"
                            className="bg-white/5 border-white/10 text-white h-12 rounded-md pr-10"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30">
                            <Button
                              variant="ghost"
                              type="button"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                <line x1="2" x2="22" y1="2" y2="22"></line>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-aegis-purple to-blue-500 text-white h-12 rounded-md hover:opacity-90"
                >
                  ENTRAR
                </Button>
                <Button
                  type="button"
                  onClick={handleFaceRecognition}
                  className="w-full bg-transparent border border-aegis-purple/60 text-white h-12 rounded-md hover:bg-aegis-purple/10 flex items-center justify-center gap-2"
                >
                  <FingerprintIcon size={18} />
                  ENTRAR COM RECONHECIMENTO FACIAL
                </Button>
              </form>
            </Form>
            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Não possui conta?
                <Button
                  onClick={() => navigate("/register")}
                  variant="link"
                  className="text-aegis-purple p-0 h-auto text-sm font-medium ml-1"
                >
                  Cadastre-se
                </Button>
              </p>
            </div>
          </>
        )}
      </div>
      {/* CSS for the scanning animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
          100% { transform: translateY(0px) rotate(12deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default Login;