import { ReactNode } from "react";

type TRoute = {
  path: string;
  element: React.ReactNode;
  children?: TRoute[];
};

type TUserPath = {
  name: string;
  path?: string;
  element?: ReactNode;
  children?: TUserPath[];
};
export const routeGenerator = (items: TUserPath[]): TRoute[] => {
  const routes = items.map((item) => {
    const route: TRoute = {
      path: item.path || "", // Ensure the path is handled correctly
      element: item.element!,
    };

    if (item.children) {
      route.children = routeGenerator(item.children); // Recursive nesting for children
    }

    return route; // Return the individual route object
  });

  return routes; // Return the array of routes
};
