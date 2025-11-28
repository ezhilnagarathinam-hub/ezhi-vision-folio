import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ServiceDetail {
  title: string;
  description: string;
  content: string;
  images?: string[];
  videos?: string[];
}

interface ServiceDetailDialogProps {
  service: ServiceDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServiceDetailDialog = ({ service, open, onOpenChange }: ServiceDetailDialogProps) => {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{service.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <p className="text-xl text-muted-foreground">{service.description}</p>

          {service.images && service.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {service.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${service.title} ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {service.videos && service.videos.length > 0 && (
            <div className="space-y-4">
              {service.videos.map((video, idx) => (
                <video 
                  key={idx}
                  controls 
                  className="w-full rounded-lg"
                  src={video}
                />
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-wrap">{service.content}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
