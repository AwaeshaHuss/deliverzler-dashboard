'use client';

import { useState } from 'react';
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
import type { User } from '@/lib/types';
import { moderateUserBehavior } from '@/ai/flows/moderate-user-behavior';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase';
import { updateUserStatus, deleteUser } from '@/lib/actions';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import UserForm from '@/components/forms/UserForm';

export default function UsersPage() {
  const { data: users, isLoading } = useCollection<User>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModerationOpen, setIsModerationOpen] = useState(false);
  const [moderationResult, setModerationResult] = useState<{
    isHarmful: boolean;
    reason?: string;
    action?: 'warn' | 'flag' | 'block';
  } | null>(null);
  const [isModerating, setIsModerating] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleModerateClick = (user: User) => {
    setSelectedUser(user);
    setModerationResult(null);
    setIsModerationOpen(true);
  };
  
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setSheetOpen(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setSheetOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      toast({
        title: 'User Deleted',
        description: `${selectedUser.name} has been removed.`,
      });
      setDeleteAlertOpen(false);
      setSelectedUser(null);
    }
  };

  const handleCheckBehavior = async () => {
    if (!selectedUser?.activitySummary) return;
    setIsModerating(true);
    try {
      const result = await moderateUserBehavior(selectedUser.activitySummary);
      setModerationResult(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to moderate user behavior.',
      });
    } finally {
      setIsModerating(false);
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUserStatus(selectedUser.id, 'Blocked');
      toast({
        title: 'User Blocked',
        description: `${selectedUser.name} has been blocked.`,
      });
    } catch (error) {
      // Error is handled by the global listener
    } finally {
      setIsModerationOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Users</CardTitle>
          <CardDescription>
            View and manage all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <CardTitle className="font-headline">Users</CardTitle>
              <CardDescription>
                View and manage all registered users.
              </CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleAddClick}>
              <PlusCircle className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Avatar
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Avatar>
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={user.name}
                        data-ai-hint={user.dataAiHint}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'Blocked' ? 'destructive' : 'secondary'
                      }
                    >
                      {user.status}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => handleEditClick(user)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleModerateClick(user)}
                        >
                          Moderate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteClick(user)}
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
            <SheetTitle>{selectedUser ? 'Edit' : 'Add'} User</SheetTitle>
            <SheetDescription>
              {selectedUser
                ? 'Update the details for this user.'
                : 'Enter the details for the new user.'}
            </SheetDescription>
          </SheetHeader>
          <UserForm user={selectedUser} onSuccess={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <AlertDialog open={isModerationOpen} onOpenChange={setIsModerationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">
              Moderate User: {selectedUser?.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Review user activity and use the AI tool to check for behavior
              that violates community standards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 text-sm">
            <p className="font-medium">User Activity Summary:</p>
            <p className="p-3 bg-muted rounded-md border text-muted-foreground">
              {selectedUser?.activitySummary || 'No activity summary available.'}
            </p>
            {isModerating ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              moderationResult && (
                <div
                  className={`p-3 rounded-md border ${
                    moderationResult.isHarmful
                      ? 'border-destructive/50 bg-destructive/10'
                      : 'border-green-500/50 bg-green-500/10'
                  }`}
                >
                  <p className="font-medium">AI Recommendation:</p>
                  <p
                    className={
                      moderationResult.isHarmful
                        ? 'text-destructive'
                        : 'text-green-700'
                    }
                  >
                    {moderationResult.reason}
                  </p>
                </div>
              )
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {!moderationResult && (
              <Button onClick={handleCheckBehavior} disabled={isModerating || !selectedUser?.activitySummary}>
                {isModerating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Check Behavior
              </Button>
            )}
            {moderationResult?.isHarmful && (
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleBlockUser}>
                  Block User
                </Button>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user "{selectedUser?.name}".
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
