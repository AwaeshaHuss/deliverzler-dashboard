
'use client';

import Image from 'next/image';
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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useCollection } from '@/firebase';
import type { MenuCategory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { deleteMenuCategory } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import MenuCategoryForm from '@/components/forms/MenuCategoryForm';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCollection<MenuCategory>('menu_categories');
  const { toast } = useToast();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);

  const handleDeleteClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setDeleteAlertOpen(true);
  };

  const handleEditClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setSheetOpen(true);
  };
  
  const handleAddClick = () => {
    setSelectedCategory(null);
    setSheetOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      await deleteMenuCategory(selectedCategory.id);
      toast({
        title: 'Category Deleted',
        description: `${selectedCategory.name} has been removed.`,
      });
      setDeleteAlertOpen(false);
      setSelectedCategory(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline">Menu Categories</CardTitle>
              <CardDescription>
                Manage your restaurant's menu categories.
              </CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleAddClick}>
              <PlusCircle className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="hidden sm:table-cell">
                    {category.imageUrl && category.imageUrl !== '' ? (
                      <Image
                        alt={category.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={category.imageUrl}
                        width="64"
                        data-ai-hint={category.dataAiHint}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {category.description}
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
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClick(category)}
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
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{categories?.length}</strong> of{' '}
            <strong>{categories?.length}</strong> categories
          </div>
        </CardFooter>
      </Card>
      
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedCategory ? 'Edit' : 'Add'} Menu Category</SheetTitle>
            <SheetDescription>
             {selectedCategory ? 'Update the details for this menu category.' : 'Enter the details for the new menu category.'}
            </SheetDescription>
          </SheetHeader>
          <MenuCategoryForm
            category={selectedCategory}
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
              category "{selectedCategory?.name}".
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
