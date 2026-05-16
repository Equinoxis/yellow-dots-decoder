import "@fontsource-variable/inter/index.css";
import "./styles.css";
import { initCookieConsent } from "./cookieConsent.js";
import { initTheme } from "./theme.js";
import "./scripts/grid.js";
import "./scripts/image.js";

async function bootstrap() {
  await initCookieConsent();
  initTheme();
}

bootstrap();
