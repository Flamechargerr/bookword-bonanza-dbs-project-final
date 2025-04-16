
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Successfully logged out!");
      navigate("/auth");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="ml-4"
    >
      Sign Out
    </Button>
  );
};

export default AuthButton;
