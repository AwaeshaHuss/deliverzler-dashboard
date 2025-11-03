'use client';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCollection } from '@/firebase';
import type { Promotion } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { deletePromotion } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import PromotionForm from '@/components/forms/PromotionForm';

export default function PromotionsPage() {
  const { data: promotions, isLoading } = useCollection<Promotion>('promotions');
  const { toast } = useToast();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const handleDeleteClick = (promo: Promotion) => {
    setSelectedPromo(promo);
    setDeleteAlertOpen(true);
  };
  
  const handleEditClick = (promo: Promotion) => {
    setSelectedPromo(promo);
    setSheetOpen(true);
  };
  
  const handleAddClick = () => {
    setSelectedPromo(null);
    setSheetOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPromo) {
      try {
        await deletePromotion(selectedPromo.id);
        toast({
          title: 'Promotion Deleted',
          description: `Promo code ${selectedPromo.code} has been deleted.`,
        });
      } catch (error) {
        // Error is handled by the global listener
      } finally {
        setDeleteAlertOpen(false);
        setSelectedPromo(null);
      }
    }
  };

  if (isLoading) {
    return (
       <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
           <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24 hidden md:block" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline">Promotions</CardTitle>
              <CardDescription>
                Manage promo codes and special offers.
              </CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleAddClick}>
              <PlusCircle className="h-4 w-4" />
              Add Promotion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">End Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions?.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium font-code">
                    {promo.code}
                  </TableCell>
                  <TableCell>{promo.discount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        promo.status === 'Expired' ? 'destructive' : 'default'
                      }
                    >
                      {promo.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {promo.endDate}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(promo)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClick(promo)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedPromo ? 'Edit' : 'Add'} Promotion</SheetTitle>
            <SheetDescription>
              {selectedPromo ? 'Update the details for this promotion.' : 'Enter the details for the new promotion.'}
            </SheetDescription>
          </SheetHeader>
          <PromotionForm
            promotion={selectedPromo}
            onSuccess={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isDeleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              promo code "{selectedPromo?.code}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
