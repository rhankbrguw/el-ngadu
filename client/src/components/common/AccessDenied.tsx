import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, User } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";

interface AccessDeniedActionsProps {
  onLogin: () => void;
  onHome: () => void;
}

const AccessDeniedActions = ({ onLogin, onHome }: AccessDeniedActionsProps) => (
  <div className="flex justify-center gap-2">
    <Button onClick={onLogin} className="flex items-center gap-2">
      <User className="h-4 w-4" />
      {APP_MESSAGES.AUTH.LOGIN_BUTTON}
    </Button>
    <Button variant="outline" onClick={onHome}>
      {APP_MESSAGES.COMMON.BACK_TO_HOME}
    </Button>
  </div>
);

export function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-4">
      <Card className="mx-auto max-w-2xl border shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-3 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <div>
              <h2 className="text-lg font-semibold text-destructive">{APP_MESSAGES.COMMON.ACCESS_DENIED}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{APP_MESSAGES.COMMON.ACCESS_DENIED_CITIZEN_DESC}</p>
            </div>
            <AccessDeniedActions onLogin={() => navigate("/login")} onHome={() => navigate("/")} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

