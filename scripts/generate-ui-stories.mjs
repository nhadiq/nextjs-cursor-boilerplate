#!/usr/bin/env node
/**
 * Generate Storybook stories for UI components.
 * Run: pnpm generate:stories
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const uiDir = 'src/components/ui';

function toTitle(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toPascal(name) {
  return toTitle(name);
}

const darkRtl = `
export const Dark: Story = {
  ...Default,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  ...Default,
  globals: { locale: 'ar' },
};
`;

const darkRtlRender = `
export const Dark: Story = {
  render: Default.render,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  render: Default.render,
  globals: { locale: 'ar' },
};
`;

/** @type {Record<string, { imports: string, component?: string, defaultStory: string, useRender?: boolean, layout?: string }>} */
const templates = {
  accordion: {
    imports: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to WAI-ARIA design patterns.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It uses Tailwind CSS and semantic tokens.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};`,
    useRender: true,
  },
  alert: {
    imports: `import { Alert, AlertDescription, AlertTitle } from './alert';
import { InfoIcon } from 'lucide-react';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <InfoIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
};`,
    useRender: true,
  },
  'alert-dialog': {
    imports: `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};`,
    useRender: true,
  },
  'aspect-ratio': {
    imports: `import { AspectRatio } from './aspect-ratio';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">16:9</div>
      </AspectRatio>
    </div>
  ),
};`,
    useRender: true,
  },
  avatar: {
    imports: `import { Avatar, AvatarFallback, AvatarImage } from './avatar';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};`,
    useRender: true,
  },
  badge: {
    imports: `import { Badge } from './badge';`,
    component: 'Badge',
    defaultStory: `export const Default: Story = {
  args: { children: 'Badge' },
};`,
  },
  breadcrumb: {
    imports: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};`,
    useRender: true,
  },
  calendar: {
    imports: `import { Calendar } from './calendar';`,
    defaultStory: `export const Default: Story = {
  render: () => <Calendar mode="single" className="rounded-md border" />,
};`,
    useRender: true,
  },
  card: {
    imports: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Card content with semantic theme tokens.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};`,
    useRender: true,
  },
  carousel: {
    imports: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './carousel';
import { Card, CardContent } from './card';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, i) => (
          <CarouselItem key={i}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-2xl font-semibold">{i + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};`,
    useRender: true,
  },
  chart: {
    imports: `import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart';
import type { ChartConfig } from './chart';`,
    defaultStory: `const chartData = [
  { month: 'Jan', desktop: 186 },
  { month: 'Feb', desktop: 305 },
  { month: 'Mar', desktop: 237 },
];

const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-[400px]">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};`,
    useRender: true,
    layout: 'padded',
  },
  checkbox: {
    imports: `import { Checkbox } from './checkbox';
import { Label } from './label';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};`,
    useRender: true,
  },
  collapsible: {
    imports: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { Button } from './button';
import { ChevronsUpDown } from 'lucide-react';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[350px] space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-semibold">3 starred repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/primitives</div>
        <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/colors</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};`,
    useRender: true,
  },
  command: {
    imports: `import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-[350px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};`,
    useRender: true,
  },
  'context-menu': {
    imports: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './context-menu';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Settings</ContextMenuItem>
        <ContextMenuItem>Sign out</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};`,
    useRender: true,
  },
  dialog: {
    imports: `import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Dialog content area.</p>
      </DialogContent>
    </Dialog>
  ),
};`,
    useRender: true,
  },
  drawer: {
    imports: `import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Drawer defaultOpen>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>Drawer description text.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};`,
    useRender: true,
  },
  'dropdown-menu': {
    imports: `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};`,
    useRender: true,
  },
  form: {
    imports: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';
import { Button } from './button';`,
    defaultStory: `const schema = z.object({ username: z.string().min(2) });

function FormDemo() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="w-[350px] space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const Default: Story = {
  render: () => <FormDemo />,
};`,
    useRender: true,
  },
  'hover-card': {
    imports: `import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <HoverCard open>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <p className="text-sm">The React Framework for the Web.</p>
      </HoverCardContent>
    </HoverCard>
  ),
};`,
    useRender: true,
  },
  input: {
    imports: `import { Input } from './input';`,
    component: 'Input',
    defaultStory: `export const Default: Story = {
  args: { type: 'email', placeholder: 'Email' },
};`,
  },
  'input-otp': {
    imports: `import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};`,
    useRender: true,
  },
  label: {
    imports: `import { Label } from './label';
import { Input } from './input';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Email" />
    </div>
  ),
};`,
    useRender: true,
  },
  menubar: {
    imports: `import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from './menubar';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};`,
    useRender: true,
  },
  'navigation-menu': {
    imports: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink className="block p-4">Introduction</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#">Documentation</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};`,
    useRender: true,
  },
  pagination: {
    imports: `import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};`,
    useRender: true,
  },
  popover: {
    imports: `import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <p className="text-sm">Popover content with semantic tokens.</p>
      </PopoverContent>
    </Popover>
  ),
};`,
    useRender: true,
  },
  progress: {
    imports: `import { Progress } from './progress';`,
    component: 'Progress',
    defaultStory: `export const Default: Story = {
  args: { value: 60, className: 'w-[300px]' },
};`,
  },
  'radio-group': {
    imports: `import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" className="grid gap-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
    </RadioGroup>
  ),
};`,
    useRender: true,
  },
  resizable: {
    imports: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">One</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};`,
    useRender: true,
    layout: 'padded',
  },
  'scroll-area': {
    imports: `import { ScrollArea } from './scroll-area';
import { Separator } from './separator';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-48 rounded-md border">
      <div className="p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>
            <div className="text-sm">Item {i + 1}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};`,
    useRender: true,
  },
  select: {
    imports: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Select defaultValue="apple">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};`,
    useRender: true,
  },
  separator: {
    imports: `import { Separator } from './separator';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
      </div>
    </div>
  ),
};`,
    useRender: true,
  },
  sheet: {
    imports: `import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};`,
    useRender: true,
  },
  sidebar: {
    imports: `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from './sidebar';
import { Home } from 'lucide-react';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar className="relative h-[300px]">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};`,
    useRender: true,
    layout: 'fullscreen',
  },
  skeleton: {
    imports: `import { Skeleton } from './skeleton';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};`,
    useRender: true,
  },
  slider: {
    imports: `import { Slider } from './slider';`,
    component: 'Slider',
    defaultStory: `export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1, className: 'w-[300px]' },
};`,
  },
  sonner: {
    imports: `import { Toaster } from './sonner';
import { Button } from './button';
import { toast } from 'sonner';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <>
      <Button onClick={() => toast('Event has been created')}>Show toast</Button>
      <Toaster />
    </>
  ),
};`,
    useRender: true,
  },
  switch: {
    imports: `import { Switch } from './switch';
import { Label } from './label';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
};`,
    useRender: true,
  },
  table: {
    imports: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Table className="w-[400px]">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jane Doe</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>John Smith</TableCell>
          <TableCell>Pending</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};`,
    useRender: true,
  },
  tabs: {
    imports: `import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
};`,
    useRender: true,
  },
  textarea: {
    imports: `import { Textarea } from './textarea';`,
    component: 'Textarea',
    defaultStory: `export const Default: Story = {
  args: { placeholder: 'Type your message here.' },
};`,
  },
  toggle: {
    imports: `import { Toggle } from './toggle';
import { Bold } from 'lucide-react';`,
    component: 'Toggle',
    defaultStory: `export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
};`,
    useRender: true,
  },
  'toggle-group': {
    imports: `import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};`,
    useRender: true,
  },
  tooltip: {
    imports: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from './button';`,
    defaultStory: `export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};`,
    useRender: true,
  },
};

function generateStory(base, template) {
  const title = toTitle(base);
  const component = template.component ?? toPascal(base);
  const metaType = template.component ? `Meta<typeof ${component}>` : 'Meta';
  const storyType = template.component
    ? `StoryObj<typeof ${component}>`
    : 'StoryObj';
  const layout = template.layout
    ? `\n  parameters: { layout: '${template.layout}', a11y: { test: 'error' } },`
    : `\n  parameters: { a11y: { test: 'error' } },`;
  const componentLine = template.component
    ? `\n  component: ${component},`
    : '';

  return `import type { Meta, StoryObj } from '@storybook/react';
${template.imports}

const meta: ${metaType} = {
  title: 'UI/${title}',${componentLine}
  tags: ['autodocs'],${layout}
};

export default meta;
type Story = ${storyType};

${template.defaultStory}
${template.useRender ? darkRtlRender : darkRtl}
`;
}

const files = readdirSync(uiDir).filter(
  (f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'),
);

let created = 0;
let skipped = 0;

for (const file of files) {
  const base = file.replace('.tsx', '');
  if (base === 'button') {
    skipped++;
    continue;
  }

  const template = templates[base];
  if (!template) {
    console.warn(`No template for ${base}, skipping`);
    skipped++;
    continue;
  }

  const storyPath = join(uiDir, `${base}.stories.tsx`);
  const content = generateStory(base, template);
  writeFileSync(storyPath, content);
  created++;
  console.log(`Generated ${storyPath}`);
}

console.log(
  `\nDone: ${created} generated, ${skipped} skipped (button has manual stories).`,
);
