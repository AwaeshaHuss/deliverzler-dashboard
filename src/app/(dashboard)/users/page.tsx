'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
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
import { updateUserStatus } from '@/lib/actions';

export default function UsersPage() {
  const { data: users, isLoading } = useCollection<User>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModerationOpen, setIsModerationOpen] = useState(false);
  const [moderationResult, setModerationResult] = useState<{
    blockUser: boolean;
    reason: string;
  } | null>(null);
  const [isModerating, setIsModerating] = useState(false);
  const { toast } = useToast();

  const handleModerateClick = (user: User) => {
    setSelectedUser(user);
    setModerationResult(null);
    setIsModerationOpen(true);
  };

  const handleCheckBehavior = async () => {
    if (!selectedUser) return;
    setIsModerating(true);
    try {
      const result = await moderateUserBehavior({
        userActivitySummary: selectedUser.activitySummary,
      });
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
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to block user.',
      });
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
          <CardTitle className="font-headline">Users</CardTitle>
          <CardDescription>
            View and manage all registered users.
          </CardDescription>
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
                      variant={user.status === 'Blocked' ? 'destructive' : 'secondary'}
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleModerateClick(user)}
                        >
                          Moderate
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
              {selectedUser?.activitySummary}
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
                    moderationResult.blockUser
                      ? 'border-destructive/50 bg-destructive/10'
                      : 'border-green-500/50 bg-green-500/10'
                  }`}
                >
                  <p className="font-medium">AI Recommendation:</p>
                  <p
                    className={
                      moderationResult.blockUser
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
              <Button onClick={handleCheckBehavior} disabled={isModerating}>
                {isModerating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Check Behavior
              </Button>
            )}
            {moderationResult?.blockUser && (
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleBlockUser}>
                  Block User
                </Button>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
