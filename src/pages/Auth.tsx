import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/10 to-background px-4">
      <Card className="w-full max-w-md p-8 border-2 border-destructive/20 shadow-2xl text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Lock className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Admin Access Only
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            This area is restricted to administrators only.
          </p>
          
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Return to Homepage
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
