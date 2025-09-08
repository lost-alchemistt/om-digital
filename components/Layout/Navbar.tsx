import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

export function NavbarComponent() {
  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems
          items={[
            { name: "Home", link: "/" },
            { name: "About", link: "/about" },
            { name: "Contact", link: "/contact" },
          ]}
        />
        <NavbarButton href="/login">Login</NavbarButton>
      </NavBody>
    </Navbar>
  );
}

export default NavbarComponent ;