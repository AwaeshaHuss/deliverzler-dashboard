import { MoreHorizontal } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { drivers } from '@/lib/data';

export default function DriversPage() {
  const allDrivers = drivers;
  const pendingDrivers = drivers.filter(d => d.status === 'Pending');

  const getStatusBadgeVariant = (
    status: (typeof drivers)[0]['status']
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
    availability: (typeof drivers)[0]['availability']
  ) => {
    switch (availability) {
      case 'Online':
        return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Offline':
        return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'Busy':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    }
  }

  const DriverTable = ({ driverList }: { driverList: typeof drivers }) => (
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
                <AvatarImage src={driver.avatarUrl} alt={driver.name} data-ai-hint={driver.dataAiHint} />
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
              <Badge variant="outline" className={getAvailabilityBadgeVariant(driver.availability)}>{driver.availability}</Badge>
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
                  {driver.status === 'Pending' && (
                    <>
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem className='text-destructive'>Reject</DropdownMenuItem>
                      <DropdownMenuItem>View Application</DropdownMenuItem>
                    </>
                  )}
                  {driver.status !== 'Pending' && (
                     <DropdownMenuItem>View Details</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All Drivers</TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {pendingDrivers.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{pendingDrivers.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
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
  );
}
