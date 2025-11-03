'use client';

import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  DropdownMenuSeparator,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection } from '@/firebase';
import type { Driver } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { updateDriverStatus, deleteDriver } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import DriverForm from '@/components/forms/DriverForm';

export default function DriversPage() {
  const { data: drivers, isLoading } = useCollection<Driver>('drivers');
  const { toast } = useToast();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const allDrivers = drivers || [];
  const pendingDrivers = allDrivers.filter((d) => d.status === 'Pending');

  const handleAddClick = () => {
    setSelectedDriver(null);
    setSheetOpen(true);
  };

  const handleEditClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setSheetOpen(true);
  };

  const handleDeleteClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setDeleteAlertOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (selectedDriver) {
      await deleteDriver(selectedDriver.id);
      toast({
        title: 'Driver Deleted',
        description: `${selectedDriver.name} has been removed.`,
      });
      setDeleteAlertOpen(false);
      setSelectedDriver(null);
    }
  };

  const handleUpdateStatus = async (
    driverId: string,
    status: 'Approved' | 'Rejected'
  ) => {
    await updateDriverStatus(driverId, status);
    toast({
      title: 'Driver Status Updated',
      description: `Driver has been ${status.toLowerCase()}.`,
    });
  };

  const getStatusBadgeVariant = (
    status: Driver['status']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getAvailabilityBadgeVariant = (
    availability: Driver['availability']
  ) => {
    switch (availability) {
      case 'Online':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Offline':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Busy':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    }
  };

  const DriverTable = ({ driverList }: { driverList: Driver[] }) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!driverList.length) {
      return <p className="text-muted-foreground">No drivers found.</p>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              Avatar
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="hidden md:table-cell">Vehicle</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {driverList.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell className="hidden sm:table-cell">
                <Avatar>
                  <AvatarImage
                    src={driver.avatarUrl}
                    alt={driver.name}
                    data-ai-hint={driver.dataAiHint}
                  />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{driver.name}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(driver.status)}>
                  {driver.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getAvailabilityBadgeVariant(driver.availability)}
                >
                  {driver.availability}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {driver.vehicle}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditClick(driver)}>
                      Edit
                    </DropdownMenuItem>
                    {driver.status === 'Pending' && (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateStatus(driver.id, 'Approved')
                          }
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleUpdateStatus(driver.id, 'Rejected')
                          }
                        >
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteClick(driver)}
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
    );
  };

  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Drivers</TabsTrigger>
            <TabsTrigger value="applications">
              Applications
              {pendingDrivers.length > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {pendingDrivers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="gap-1" onClick={handleAddClick}>
            <PlusCircle className="h-4 w-4" />
            Add Driver
          </Button>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">All Drivers</CardTitle>
              <CardDescription>
                Monitor and manage all drivers on the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DriverTable driverList={allDrivers} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Driver Applications</CardTitle>
              <CardDescription>
                Review and approve new driver applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DriverTable driverList={pendingDrivers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedDriver ? 'Edit' : 'Add'} Driver</SheetTitle>
            <SheetDescription>
              {selectedDriver
                ? 'Update the details for this driver.'
                : 'Enter the details for the new driver.'}
            </SheetDescription>
          </SheetHeader>
          <DriverForm
            driver={selectedDriver}
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
              driver "{selectedDriver?.name}".
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
