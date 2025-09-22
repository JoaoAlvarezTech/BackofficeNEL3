import { useMemo, useState } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calculator, 
  TrendingUp, 
  FileText, 
  Settings,
  ChevronDown,
  ChevronRight,
  Bell
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "Partners",
    url: "/partners",
    icon: Building2,
    submenu: [
      { title: "Lista", url: "/partners" },
      { title: "Novo Partner", url: "/partners/new" },
      { title: "KYC Pendente", url: "/partners/approvals" }
    ]
  },
  {
    title: "Usuários", 
    url: "/affiliates",
    icon: Users,
    submenu: [
      { title: "Lista", url: "/affiliates" },
      { title: "Novo Usuário", url: "/affiliates/new" },
      { title: "Aprovações", url: "/affiliates/approvals" }
    ]
  },
  {
    title: "Mesa de Operações",
    url: "/operations",
    icon: Calculator,
    submenu: [
      { title: "Cobranças", url: "/operations/collections" },
      { title: "Taxas", url: "/operations/rates" },
      { title: "Liquidações", url: "/operations/settlements" },
      { title: "Conciliação", url: "/operations/reconciliation" }
    ]
  },
  {
    title: "Antecipações",
    url: "/advances",
    icon: TrendingUp,
    submenu: [
      { title: "Gestão Completa", url: "/advances" },
      { title: "Pedidos", url: "/advances/requests" },
      { title: "Aprovações", url: "/advances/approvals" },
      { title: "Liquidações", url: "/advances/settlements" }
    ]
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: FileText,
    submenu: [
      { title: "Financeiros", url: "/reports/financial" },
      { title: "Operacionais", url: "/reports/operational" },
      { title: "KYC Status", url: "/reports/kyc" }
    ]
  },
  {
    title: "Notificações",
    url: "/notifications",
    icon: Bell,
    exact: true
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user } = useAuth();

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const getNavClassName = (path: string, exact = false) => {
    const isItemActive = isActive(path, exact);
    return cn(
      "w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200",
      isItemActive && "bg-sidebar-accent text-sidebar-foreground font-medium border-r-2 border-sidebar-primary"
    );
  };

  const role = user?.role;
  const filteredMenu = useMemo(() => {
    if (role === "hospital") {
      return [
        { title: "Dashboard", url: "/", icon: LayoutDashboard, exact: true },
        {
          title: "Usuários",
          url: "/affiliates",
          icon: Users,
          submenu: [
            { title: "Lista", url: "/affiliates" },
            { title: "Novo Usuário", url: "/affiliates/new" },
            { title: "Aprovações", url: "/affiliates/approvals" },
          ],
        },
        { title: "Notas Fiscais", url: "/invoices/approvals", icon: FileText, exact: true },
      ];
    }
    return menuItems;
  }, [role]);

  return (
    <Sidebar className={cn("border-r border-sidebar-border", collapsed ? "w-16" : "w-64")}>
      <SidebarContent className="bg-sidebar">
        <div className="px-6 py-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">BackOffice</h2>
                <p className="text-xs text-sidebar-foreground/60">Financial Platform</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wide px-6 py-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {filteredMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <div>
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.title)}
                        className={cn(
                          "w-full justify-between text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200",
                          isActive(item.url) && "bg-sidebar-accent text-sidebar-foreground"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </div>
                        {!collapsed && (
                          expandedMenus.includes(item.title) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                      
                      {!collapsed && expandedMenus.includes(item.title) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <SidebarMenuButton key={subItem.url} asChild>
                              <NavLink to={subItem.url} className={getNavClassName(subItem.url)}>
                                <span className="text-sm">{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url, item.exact)}>
                        <item.icon className="mr-3 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-3 border-t border-sidebar-border">
          <SidebarMenuButton className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <Settings className="mr-3 h-4 w-4" />
            {!collapsed && <span>Configurações</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}