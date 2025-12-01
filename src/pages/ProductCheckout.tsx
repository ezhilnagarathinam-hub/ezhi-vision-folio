import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingBag, QrCode, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const ProductCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const upiId = "ezhil@upi"; // Replace with actual UPI ID
  const upiName = "Ezhil";

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('editable_content')
      .select('*')
      .eq('section_key', 'store')
      .single();

    if (data && data.content) {
      const products = (data.content as any).products || [];
      const foundProduct = products.find((p: Product) => p.id === id);
      setProduct(foundProduct);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast({ title: "UPI ID copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Please fill all required fields"
      });
      return;
    }

    toast({
      title: "Order Placed!",
      description: "Thank you for your order. We will contact you shortly to confirm payment.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Button onClick={() => navigate('/store')}>Back to Store</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/store')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </Button>
        </div>
      </header>

      {/* Checkout Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="flex gap-4">
                  <img
                    src={product.image || '/placeholder.svg'}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <Badge>{product.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {product.description}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              {/* UPI Payment Details */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-background">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">UPI Payment</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Pay to</Label>
                    <p className="text-lg font-semibold">{upiName}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">UPI ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-4 py-3 bg-background rounded-lg font-mono text-sm border">
                        {upiId}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={copyUpiId}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Amount to Pay</Label>
                    <p className="text-3xl font-bold text-primary">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-background rounded-lg border-l-4 border-primary">
                    <p className="text-sm">
                      <strong>Note:</strong> After completing the UPI payment, please submit the form below with your payment details. We'll verify and confirm your order shortly.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Form */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Your Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXXXXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your complete address (if applicable)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special instructions or payment reference number"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                >
                  Place Order
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you confirm that you have completed the UPI payment
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCheckout;
