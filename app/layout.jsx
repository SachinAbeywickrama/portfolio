import "../styles.css";
import RouteTransition from "../components/RouteTransition";

export const metadata = {
  metadataBase: new URL("https://sachinabeywickrama.dev"),
  title: "Sachin Abeywickrama — Software Engineer",
  description: "An interactive portfolio by Sachin Abeywickrama. Try a concurrency experiment and explore work in web applications, enterprise software, IoT, and machine learning.",
  openGraph: { title: "Sachin Abeywickrama — Software Engineer", description: "Software engineer turning complex problems into clear, useful digital products.", type: "website" }
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141613"
};

export default function RootLayout({ children }) {
  const themeScript = `(function(){try{var saved=localStorage.getItem('portfolio-theme-obsidian-v1');var theme=saved==='light'?'light':'dark';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme}catch(e){document.documentElement.dataset.theme='dark'}})()`;
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" /></head><body><RouteTransition />{children}</body></html>;
}
