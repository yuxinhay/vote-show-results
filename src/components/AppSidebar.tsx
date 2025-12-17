import { Home, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import micLogo from '@/assets/mic-logo.png';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Overview', url: '/', icon: Home },
  { title: 'View Pain Points', url: '/pain-points', icon: FileText },
  { title: 'FAQ', url: '/faq', icon: HelpCircle },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6 border-b border-border">
        <Link to="/">
          <img src={micLogo} alt="MIC" className="h-12 object-contain" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Menu
        </p>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === '/'}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
