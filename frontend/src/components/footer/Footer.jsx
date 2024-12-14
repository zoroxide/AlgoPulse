import { Footer } from "flowbite-react";

function PageFooter() {
  return (
    <Footer>
        <Footer.Copyright href="/" by="ICPC Fandom" year={2024} />
        <Footer.LinkGroup>
          <Footer.Link href="/about">About</Footer.Link>
          <Footer.Link href="/login">Login</Footer.Link>
          <Footer.Link href="/signup">Sign up</Footer.Link>
          <Footer.Link href="/sheets">Roadmaps</Footer.Link>
        </Footer.LinkGroup>
    </Footer>
  );
}

export default PageFooter;
