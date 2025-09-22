import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Hospital } from "lucide-react";

export default function Login() {
  const { isAuthenticated, signInAsHospital, signInAsNel3 } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Entrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full bg-gradient-primary" onClick={() => { signInAsNel3(); navigate("/", { replace: true }); }}>
            <Building2 className="h-4 w-4 mr-2" /> Entrar como NEL3 (Admin)
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => { signInAsHospital(); navigate("/", { replace: true }); }}>
            <Hospital className="h-4 w-4 mr-2" /> Entrar como Hospital (Parceiro)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}




