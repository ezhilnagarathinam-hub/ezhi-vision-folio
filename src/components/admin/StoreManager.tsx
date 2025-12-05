import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

const StoreManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    available: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('*')
        .eq('section_key', 'store')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.content) {
        setProducts((data.content as any).products || []);
      } else {
        await supabase
          .from('editable_content')
          .insert([{
            section_key: 'store',
            section_name: 'Store',
            content: { products: [] }
          }]);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = async (updatedProducts: Product[]) => {
    try {
      const { error } = await supabase
        .from('editable_content')
        .upsert([{
          section_key: 'store',
          section_name: 'Store',
          content: { products: updatedProducts } as any
        }], { onConflict: 'section_key' });

      if (error) throw error;
      setProducts(updatedProducts);
      toast({ title: "Store updated successfully" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editing) {
      const updated = products.map(p => p.id === editing ? formData : p);
      saveProducts(updated);
    } else {
      const newProduct = { ...formData, id: crypto.randomUUID() };
      saveProducts([...products, newProduct]);
    }
    
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditing(product.id);
    setFormData(product);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
  };

  const toggleAvailability = (id: string) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, available: !p.available } : p
    );
    saveProducts(updated);
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      available: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Books, Courses, Services"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
            <Label htmlFor="available">Available for purchase</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {editing ? 'Update Product' : 'Add Product'}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Products</h2>
        {products.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No products yet. Add your first product above.
          </Card>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-sm text-primary">{product.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.available}
                          onCheckedChange={() => toggleAvailability(product.id)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{product.description}</p>
                    <p className="text-2xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Status: {product.available ? '✅ Available' : '❌ Unavailable'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManager;
