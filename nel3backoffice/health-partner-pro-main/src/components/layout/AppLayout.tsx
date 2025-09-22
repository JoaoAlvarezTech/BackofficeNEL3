import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockdb } from "@/lib/mockdb";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const notifications = mockdb.listNotifications() || [];
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger className="h-8 w-8" />
              
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar partners, usuários, operações..." 
                      className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-4 w-4" />
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="p-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">Notificações</h4>
                          {unreadCount > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                mockdb.markAllNotificationsRead();
                                navigate('/notifications');
                              }}
                            >
                              Ver todas
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {notifications.slice(0, 5).map(notif => (
                            <div 
                              key={notif.id}
                              className={`p-2 rounded-lg border ${
                                notif.priority === 'critical' ? 'bg-destructive/10 border-destructive/20' :
                                notif.priority === 'high' ? 'bg-orange-500/10 border-orange-500/20' :
                                notif.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                                'bg-primary/10 border-primary/20'
                              } ${!notif.read ? 'ring-1 ring-primary/20' : ''}`}
                            >
                              <p className="text-sm font-medium">{notif.title}</p>
                              <p className="text-xs text-muted-foreground">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notif.createdAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              Nenhuma notificação
                            </p>
                          )}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left hidden md:block">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Perfil</DropdownMenuItem>
                      <DropdownMenuItem>Configurações</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => { signOut(); navigate("/login", { replace: true }); }}>Sair</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}