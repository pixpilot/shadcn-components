# @pixpilot/shadcn-dashboard

Responsive dashboard shell built with shadcn/ui: a sidebar on desktop, a sheet on mobile, a header and a main area, plus the page building blocks that sit inside it.

The package never imports host code. Routes, router, brand logo, user and sign-out are passed in.

## Install

```bash
pnpm add @pixpilot/shadcn-dashboard
```

Peers: `react` and `react-dom` 18 or 19. Styling needs Tailwind CSS v4 with your shadcn theme tokens; the header uses `@container` queries.

## Exports

| Export                                                              | Purpose                                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `Dashboard`                                                         | Root. Holds sidebar state; takes an optional `logo`.                     |
| `DashboardSidebar`, `DashboardSidebarTop`, `DashboardSidebarBottom` | Sidebar on desktop, sheet on mobile. Closes the sheet after a nav click. |
| `DashboardContent`, `DashboardHeader`, `DashboardMain`              | Right-hand column.                                                       |
| `DashboardNavigationButtons`, `DashboardItem`                       | Nav list with nested items. Mark root items `exact`.                     |
| `DashboardLogo`                                                     | Round icon button for the logo. Route from `onClick`.                    |
| `DashboardSidebarUser`                                              | Avatar, name, subtitle and an actions row.                               |
| `DashboardPageContent`, `DashboardPageHeader`, `DashboardCard`      | Page width, page header, section card.                                   |
| `DashboardProvider`, `useDashboard`                                 | Sidebar state, for custom pieces.                                        |
| `getInitials`                                                       | Avatar initials helper.                                                  |

## Usage

```tsx
import {
  Dashboard,
  DashboardCard,
  DashboardContent,
  DashboardLogo,
  DashboardMain,
  DashboardNavigationButtons,
  DashboardPageContent,
  DashboardPageHeader,
  DashboardSidebar,
  DashboardSidebarBottom,
  DashboardSidebarTop,
  DashboardSidebarUser,
} from '@pixpilot/shadcn-dashboard';

<Dashboard
  logo={
    <DashboardLogo onClick={() => router.push('/dashboard')}>
      <Logo />
    </DashboardLogo>
  }
>
  <DashboardSidebar>
    <DashboardSidebarTop>
      <DashboardNavigationButtons
        items={items}
        pathname={pathname}
        onItemClick={(item) => router.push(item.href)}
      />
    </DashboardSidebarTop>
    <DashboardSidebarBottom>
      <DashboardSidebarUser name={user.name} subtitle="Admin">
        <LogoutButton />
      </DashboardSidebarUser>
    </DashboardSidebarBottom>
  </DashboardSidebar>

  <DashboardContent>
    <DashboardMain>
      <DashboardPageContent>
        <DashboardPageHeader title="Jobs" />
        <DashboardCard title="Recent">…</DashboardCard>
      </DashboardPageContent>
    </DashboardMain>
  </DashboardContent>
</Dashboard>;
```

### Navigation items

```ts
const items: DashboardItem[] = [
  { href: '/dashboard', label: 'Home', icon: <Home />, exact: true },
  { href: '/dashboard/jobs', label: 'Jobs', icon: <Briefcase />, location: 'top' },
  { href: '/dashboard/settings', label: 'Settings', icon: <Cog />, location: 'bottom' },
];
```

- An item is active on its own route and every route beneath it. Set `exact` on a root item so it is not active everywhere.
- `location` lets you render the same list twice, once per sidebar section, with `<DashboardNavigationButtons location="top" />`.
- `children` nests items that show only while the parent is active.
