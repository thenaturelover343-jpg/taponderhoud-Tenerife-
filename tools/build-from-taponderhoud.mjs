import fs from "node:fs";
import path from "node:path";
import { load } from "/tmp/tap-tool/node_modules/cheerio/dist/esm/index.js";

const src = "/tmp/tap-src";
const out = process.cwd();

const pages = [
  ["index.html", "index.html"],
  ["index.html.1.html", "politica-de-cookies/index.html"],
  ["index.html.1.1.html", "mantenimiento-de-grifos/tenerife-norte/index.html"],
  ["index.html.1.2.html", "mantenimiento-de-grifos/santa-cruz-de-tenerife/index.html"],
  ["index.html.1.3.html", "mantenimiento-de-grifos/la-laguna/index.html"],
  ["index.html.1.4.html", "mantenimiento-de-grifos/costa-adeje/index.html"],
  ["index.html.1.5.html", "mantenimiento-de-grifos/los-cristianos/index.html"],
  ["index.html.1.6.html", "mantenimiento-de-grifos/playa-de-las-americas/index.html"],
  ["index.html.1.7.html", "reparacion-de-instalaciones-de-cerveza/index.html"],
  ["index.html.1.8.html", "mantenimiento-de-instalaciones-de-cerveza/index.html"],
  ["index.html.1.9.html", "limpieza-de-lineas-de-cerveza/index.html"],
];

const titleMap = new Map([
  ["index.html", "Mantenimiento, limpieza y reparacion de grifos de cerveza en Tenerife"],
  ["index.html.1.html", "Politica de cookies (UE) - Mantenimiento de Grifos Tenerife"],
  ["index.html.1.1.html", "Mantenimiento de grifos Tenerife Norte"],
  ["index.html.1.2.html", "Mantenimiento de grifos Santa Cruz de Tenerife"],
  ["index.html.1.3.html", "Mantenimiento de grifos La Laguna"],
  ["index.html.1.4.html", "Mantenimiento de grifos Costa Adeje"],
  ["index.html.1.5.html", "Mantenimiento de grifos Los Cristianos"],
  ["index.html.1.6.html", "Mantenimiento de grifos Playa de las Americas"],
  ["index.html.1.7.html", "Reparacion de instalaciones de cerveza en Tenerife"],
  ["index.html.1.8.html", "Mantenimiento de instalaciones de cerveza en Tenerife"],
  ["index.html.1.9.html", "Limpieza de lineas de cerveza en Tenerife"],
]);

const nav = [
  ["Start", "Inicio"],
  ["Bierleidingen reinigen", "Limpieza de lineas de cerveza"],
  ["Cookiebeleid (EU)", "Politica de cookies (UE)"],
  ["Tapinstallatie herstelling", "Reparacion de instalaciones"],
  ["Tapinstallatie onderhoud", "Mantenimiento de instalaciones"],
  ["Taponderhoud Antwerpen", "Mantenimiento Tenerife Sur"],
  ["Taponderhoud Brussel", "Mantenimiento La Laguna"],
  ["Taponderhoud Kempen", "Mantenimiento Costa Adeje"],
  ["Taponderhoud Limburg", "Mantenimiento Los Cristianos"],
  ["Taponderhoud Oost-Vlaanderen", "Mantenimiento Tenerife Norte"],
  ["Taponderhoud Vlaams-Brabant", "Mantenimiento Santa Cruz"],
  ["Selecteer een pagina", "Seleccione una pagina"],
];

const copyMap = [
  ["Uw tapinstallatie is onze zorg!", "Su instalacion de cerveza es nuestra prioridad"],
  ["Uw klanten drinken graag hun bier met smaak maar ook met vertrouwen!", "Sus clientes quieren una cerveza con buen sabor y con confianza."],
  ["Bij Taponderhoud.be kan u gerust zijn.", "Con nuestro servicio en Tenerife puede estar tranquilo."],
  ["Wij zorgen voor uw tapinstallatie en staan garant voor zuivere leidingen.", "Cuidamos su instalacion y dejamos las lineas limpias."],
  ["Weg met schimmels en bacterien!", "Fuera hongos y bacterias."],
  ["Geniet van het gerstenat zoals het hoort!", "Sirva la cerveza como debe servirse."],
  ["Onze diensten", "Nuestros servicios"],
  ["Contacteer ons", "Contactenos"],
  ["Wat doen we?", "Que hacemos?"],
  ["Wij onderhouden en reinigen uw bierleidingen op locatie", "Mantenemos y limpiamos sus lineas de cerveza en el local"],
  ["Onze werkzaamheden", "Nuestros trabajos"],
  ["Volledige chemische-mechanische reiniging van de gehele installatie", "Limpieza quimica y mecanica completa de toda la instalacion"],
  ["Ontsmetten van de vatenkoppelingen", "Desinfeccion de los acoples de barril"],
  ["Ontsmetten van de spoelkoppen", "Desinfeccion de los cabezales de lavado"],
  ["Reinigen van de tapkranen", "Limpieza de los grifos"],
  ["Preventief nazicht van de gehele installatie", "Revision preventiva de toda la instalacion"],
  ["Invullen van de onderhoudsfiche", "Registro de la ficha de mantenimiento"],
  ["Waarom kiezen voor taponderhoud?", "Por que elegir este mantenimiento?"],
  ["Het is belangrijk uw tapinstallatie te onderhouden.", "Es importante mantener su instalacion de cerveza."],
  ["Bekijk ook onze diensten:", "Ver tambien nuestros servicios:"],
  ["Ontdek onze tarieven", "Ver nuestras tarifas"],
  ["Ons werkgebied", "Zona de trabajo"],
  ["Hoe verloopt een onderhoudsbeurt?", "Como se realiza un mantenimiento?"],
  ["Hoeveel kost het?", "Cuanto cuesta?"],
  ["Tarieven", "Tarifas"],
  ["Aantal kranen", "Numero de grifos"],
  ["Prijs jaarabonnement", "Precio abono anual"],
  ["Prijs voor jaarabonnement", "Precio del abono anual"],
  ["Prijs voor enkele beurt", "Precio por servicio unico"],
  ["Al onze prijzen zijn exclusief BTW.", "Todos los precios son sin IGIC."],
  ["Bel ons:", "Llamenos:"],
  ["Neem contact met ons op", "Contacte con nosotros"],
  ["Voornaam", "Nombre"],
  ["Achternaam", "Apellido"],
  ["E-mailadres", "Email"],
  ["Telefoonnummer", "Telefono"],
  ["Bericht", "Mensaje"],
  ["Verzenden", "Enviar"],
  ["jaar", "ano"],
  ["beurten", "servicios"],
  ["enkele beurt", "servicio unico"],
  ["Onderhoud", "Mantenimiento"],
  ["Herstelling", "Reparacion"],
  ["Reiniging", "Limpieza"],
  ["bierleidingen", "lineas de cerveza"],
  ["tapinstallatie", "instalacion de cerveza"],
  ["tapinstallaties", "instalaciones de cerveza"],
  ["tapkranen", "grifos"],
  ["leidingen", "lineas"],
  ["koelingen", "refrigeracion"],
  ["herstellingen", "reparaciones"],
  ["Antwerpen", "Tenerife Sur"],
  ["Limburg", "Los Cristianos"],
  ["Vlaams-Brabant", "Santa Cruz de Tenerife"],
  ["Brussel", "La Laguna"],
  ["Oost-Vlaanderen", "Tenerife Norte"],
  ["Kempen", "Costa Adeje"],
  ["provincies", "zonas"],
  ["cafes", "bares"],
  ["restaurants", "restaurantes"],
  ["feestzalen", "salones de eventos"],
  ["bedrijven", "empresas"],
  ["Uw", "Su"],
  ["uw", "su"],
  ["Wij", "Trabajamos"],
  ["wij", "trabajamos"],
  ["Onze", "Nuestros"],
  ["onze", "nuestros"],
];

function clean(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function translateText(text) {
  let next = clean(text);
  for (const [from, to] of [...nav, ...copyMap]) {
    next = next.split(clean(from)).join(to);
  }
  next = next
    .replace(/Taponderhoud\.be/g, "Mantenimiento de Grifos Tenerife")
    .replace(/Taponderhoud/g, "Mantenimiento de Grifos")
    .replace(/taponderhoud\.be/g, "mantenimientogrifostenerife.es")
    .replace(/\bHCCP\b/g, "HACCP")
    .replace(/\s+/g, " ");
  return next.trim();
}

const cacheFile = path.join(out, "tools", ".translate-cache.json");
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};

async function translateRemote(text) {
  const prepared = translateText(text);
  if (prepared.length < 18 || !/[a-zA-Z]/.test(prepared)) return prepared;
  if (cache[prepared]) return cache[prepared];
  const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(prepared) + "&langpair=nl|es";
  try {
    const res = await fetch(url);
    const json = await res.json();
    const translated = json?.responseData?.translatedText;
    cache[prepared] = translated && json.responseStatus === 200 ? translated : prepared;
  } catch {
    cache[prepared] = prepared;
  }
  await new Promise((resolve) => setTimeout(resolve, 120));
  return cache[prepared];
}

function hrefFor(original) {
  const map = new Map([
    ["index.html", "./"],
    ["index.html.1.html", "politica-de-cookies/"],
    ["index.html.1.1.html", "mantenimiento-de-grifos/tenerife-norte/"],
    ["index.html.1.2.html", "mantenimiento-de-grifos/santa-cruz-de-tenerife/"],
    ["index.html.1.3.html", "mantenimiento-de-grifos/la-laguna/"],
    ["index.html.1.4.html", "mantenimiento-de-grifos/costa-adeje/"],
    ["index.html.1.5.html", "mantenimiento-de-grifos/los-cristianos/"],
    ["index.html.1.6.html", "mantenimiento-de-grifos/playa-de-las-americas/"],
    ["index.html.1.7.html", "reparacion-de-instalaciones-de-cerveza/"],
    ["index.html.1.8.html", "mantenimiento-de-instalaciones-de-cerveza/"],
    ["index.html.1.9.html", "limpieza-de-lineas-de-cerveza/"],
  ]);
  return map.get(original) || original;
}

function polish(html, dest) {
  const dir = path.dirname(dest);
  const prefix = dir === "." ? "." : path.relative(dir, ".").replaceAll(path.sep, "/");
  const routeFixes = [
    [/\.\/\.1\.html/g, `${prefix}/politica-de-cookies/`],
    [/\.\/\.1\.1\.html/g, `${prefix}/mantenimiento-de-grifos/tenerife-norte/`],
    [/\.\/\.1\.2\.html/g, `${prefix}/mantenimiento-de-grifos/santa-cruz-de-tenerife/`],
    [/\.\/\.1\.3\.html/g, `${prefix}/mantenimiento-de-grifos/la-laguna/`],
    [/\.\/\.1\.4\.html/g, `${prefix}/mantenimiento-de-grifos/costa-adeje/`],
    [/\.\/\.1\.5\.html/g, `${prefix}/mantenimiento-de-grifos/los-cristianos/`],
    [/\.\/\.1\.6\.html/g, `${prefix}/mantenimiento-de-grifos/playa-de-las-americas/`],
    [/\.\/\.1\.7\.html/g, `${prefix}/reparacion-de-instalaciones-de-cerveza/`],
    [/\.\/\.1\.8\.html/g, `${prefix}/mantenimiento-de-instalaciones-de-cerveza/`],
    [/\.\/\.1\.9\.html/g, `${prefix}/limpieza-de-lineas-de-cerveza/`],
    [/\.\/taponderhoud-antwerpen\//g, `${prefix}/mantenimiento-de-grifos/playa-de-las-americas/`],
    [/\.\/taponderhoud-kempen\//g, `${prefix}/mantenimiento-de-grifos/costa-adeje/`],
    [/\.\/taponderhoud-limburg\//g, `${prefix}/mantenimiento-de-grifos/los-cristianos/`],
    [/\.\/taponderhoud-vlaams-brabant\//g, `${prefix}/mantenimiento-de-grifos/santa-cruz-de-tenerife/`],
    [/\.\/taponderhoud-brussel\//g, `${prefix}/mantenimiento-de-grifos/la-laguna/`],
    [/\.\/taponderhoud-oost-vlaanderen\//g, `${prefix}/mantenimiento-de-grifos/tenerife-norte/`],
  ];
  let next = html;
  for (const [from, to] of routeFixes) next = next.replace(from, to);
  if (prefix !== ".") next = next.replace(/(["'(])assets\//g, `$1${prefix}/assets/`);
  next = next.replace(/url\((taponderhoud-[^)]+)\)/g, `url(${prefix}/assets/$1)`);
  return next
    .replace(/https?:\/\/taponderhoud\.be/gi, "https://mantenimientogrifostenerife.es")
    .replace(/Taponderhoud\.be/g, "Mantenimiento de Grifos Tenerife")
    .replace(/Taponderhoud/g, "Mantenimiento de Grifos")
    .replace(/taponderhoud(?!-)/gi, "mantenimiento de grifos")
    .replace(/info@taponderhoud\.be/g, "info@mantenimientogrifostenerife.es")
    .replace(/Kemelbeekstraat 16<br>2460 Kasterlee \(Tielen\)<br>/g, "Tenerife<br>")
    .replace(/Waarom/g, "Por que")
    .replace(/Bel ons/g, "Llamenos")
    .replace(/Naam/g, "Nombre")
    .replace(/Maak su keuze/g, "Elija una opcion")
    .replace(/Maak uw keuze/g, "Elija una opcion")
    .replace(/Maak een afspraak/g, "Solicitar una cita")
    .replace(/Administratieve vraag/g, "Pregunta administrativa")
    .replace(/Andere/g, "Otro")
    .replace(/Kies de reden voor su contactaanvraag\./g, "Elija el motivo de su solicitud.")
    .replace(/Su vraag/g, "Su pregunta")
    .replace(/onderhouden/g, "mantenemos")
    .replace(/reinigen/g, "limpiamos")
    .replace(/Brabant/g, "Santa Cruz de Tenerife")
    .replace(/in dit de acuerdo/g, "de acuerdo")
    .replace(/Trabajamos aseguramos/g, "Nos encargamos de")
    .replace(/Trabajamos tambien instalar/g, "Tambien instalamos")
    .replace(/Nuestros tecnicos tambien certificado de refrigeracion/g, "Nuestros tecnicos estan certificados en refrigeracion")
    .replace(/en la ubicacion, esto en el eje zonal/g, "en el local, en Tenerife:")
    .replace(/Trabajamos mantenemos en limpiamos su/g, "Mantenemos y limpiamos sus")
    .replace(/en la ubicación, esto en el eje zonal/g, "en el local, en Tenerife:")
    .replace(/Trabajamos también instalar/g, "Tambien instalamos")
    .replace(/Nuestros técnicos también certificado de refrigeración/g, "Nuestros tecnicos estan certificados en refrigeracion")
    .replace(/en dit de acuerdo/g, "de acuerdo")
    .replace(/Trabajamos <strong>mantenemos<\/strong> en <strong>limpiamos<\/strong> su <strong>lineas de cerveza<\/strong>/g, "Mantenemos y limpiamos sus <strong>lineas de cerveza</strong>")
    .replace(/Tambien instalamos y\/o desmontar/g, "Tambien instalamos y desmontamos")
    .replace(/Nuestros técnicos también <strong>certificado de refrigeración<\/strong>, en dit/g, "Nuestros tecnicos estan <strong>certificados en refrigeracion</strong>,")
    .replace(/hecho con hongos y bacterias/g, "se eliminan hongos y bacterias")
    .replace(/Ja, ik ga akkoord met het privacybeleid\./g, "Si, acepto la politica de privacidad.")
    .replace(/Onze service/g, "Nuestro servicio")
    .replace(/Nuestros service/g, "Nuestro servicio")
    .replace(/ in de Costa Adeje/g, " en Costa Adeje")
    .replace(/ in de Tenerife Norte/g, " en Tenerife Norte")
    .replace(/ in Tenerife Sur/g, " en Tenerife Sur")
    .replace(/Een bierleiding blijft niet vanzelf proper\. Door gebruik bosuen resten zich op in de installatie\. Dat heeft invloed op geur, smaak en algemene hygiene\. Wie dat te lang laat zitten, krijgt vroeg of laat klachten, kwaliteitsverlies of technische problemen\./g, "Una linea de cerveza no se mantiene limpia sola. Con el uso se acumulan residuos en la instalacion. Eso afecta al olor, al sabor y a la higiene. Si se deja demasiado tiempo, aparecen quejas, perdida de calidad y problemas tecnicos.")
    .replace(/voor het reinigen van su lineas de cerveza/g, "para limpiar sus lineas de cerveza")
    .replace(/zuivere lineas/g, "lineas limpias")
    .replace(/koelgecertificeerd/g, "certificados en refrigeracion")
    .replace(/volgens de geldende HACCP normen/g, "segun las normas HACCP vigentes")
    .replace(/gedaan met schimmels en bacterien/g, "se eliminan hongos y bacterias")
    .replace(/Bekijk nuestros regio/g, "Ver nuestras zonas")
    .replace(/su /g, "su ");
}

fs.rmSync(path.join(out, "assets"), { recursive: true, force: true });
fs.mkdirSync(path.join(out, "assets"), { recursive: true });
for (const file of fs.readdirSync(src)) {
  if (!file.endsWith(".html")) fs.copyFileSync(path.join(src, file), path.join(out, "assets", file));
}

for (const [source, dest] of pages) {
  const html = fs.readFileSync(path.join(src, source), "utf8");
  const $ = load(html, { decodeEntities: false });
  $("html").attr("lang", "es-ES");
  $("title").text(titleMap.get(source));
  $("meta[name='description']").attr("content", "Mantenimiento, limpieza y reparacion de instalaciones de cerveza para bares, restaurantes, hoteles y eventos en Tenerife.");
  $("meta[property='og:title']").attr("content", titleMap.get(source));
  $("meta[property='og:description']").attr("content", "Servicio de limpieza y mantenimiento de grifos de cerveza en Tenerife.");
  $("a[href]").each((_, el) => {
    let href = $(el).attr("href");
    for (const [from, to] of pages) {
      href = href.replace(from, hrefFor(from));
    }
    href = href.replace(/https?:\/\/taponderhoud\.be\/?/g, "./");
    $(el).attr("href", href);
  });
  $("img, source, link, script").each((_, el) => {
    if ($(el).is("link") && !$(el).attr("href") && $(el).attr("data-wphbdelayedstyle")) {
      $(el).attr("href", $(el).attr("data-wphbdelayedstyle"));
    }
    for (const attr of ["src", "srcset", "href", "data-src", "data-srcset", "data-original-sizes"]) {
      const val = $(el).attr(attr);
      if (val) {
        const local = val
          .replace(/https?:\/\/taponderhoud\.be\/wp-content\/uploads\/[0-9]{4}\/[0-9]{2}\//g, "assets/")
          .replace(/https?:\/\/taponderhoud\.be\/wp-content\/themes\/Divi\/core\/admin\/fonts\/modules\/all\//g, "assets/")
          .replace(/https?:\/\/hb\.wpmucdn\.com\/taponderhoud\.be\//g, "assets/");
        $(el).attr(attr, local.replace(/^((?!assets\/)[^:#?]+\\.(?:svg|png|jpe?g|webp|css|js|woff2?|ttf|eot))(\\?|$)/i, "assets/$1$2"));
      }
    }
    if ($(el).is("img") && $(el).attr("data-src")) $(el).attr("src", $(el).attr("data-src"));
  });
  $("script[type='application/ld+json'], script").remove();
  $("#logo").attr("src", "assets/logo-tenerife.svg").attr("alt", "Mantenimiento de Grifos Tenerife");
  const textNodes = [];
  $("body *").contents().each((_, node) => {
    if (node.type === "text") {
      const text = node.data;
      if (text.trim()) textNodes.push(node);
    }
  });
  for (const node of textNodes) {
    const trimmed = node.data.trim();
    node.data = node.data.replace(trimmed, await translateRemote(trimmed));
  }
  for (const el of $("img[alt]").toArray()) $(el).attr("alt", await translateRemote($(el).attr("alt")));
  for (const el of $("input[placeholder], textarea[placeholder]").toArray()) $(el).attr("placeholder", await translateRemote($(el).attr("placeholder")));
  $("body").prepend('<div class="tenerife-brand-note">Mantenimiento de Grifos Tenerife</div>');
  $("head").append('<link rel="stylesheet" href="assets/tenerife-fix.css">');
  const target = path.join(out, dest);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, polish("<!doctype html>\n" + $.html(), dest));
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

fs.writeFileSync(path.join(out, "assets", "tenerife-fix.css"), `
.tenerife-brand-note{position:absolute;left:-9999px}
#logo{max-height:56px!important;width:172px!important}
#et-top-navigation{padding-left:220px!important}
#top-menu li a,.mobile_menu_bar:before{color:#111!important}
body{font-family:'Open Sans',Arial,sans-serif}
`);

fs.writeFileSync(path.join(out, "assets", "logo-tenerife.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 160" role="img" aria-label="Mantenimiento de Grifos Tenerife"><rect width="820" height="160" fill="none"/><g fill="#e5ad2b"><rect x="20" y="46" width="20" height="82" rx="10"/><rect x="52" y="46" width="20" height="82" rx="10"/><path d="M84 0a10 10 0 0 1 10 10v118h50V62a10 10 0 1 1 20 0v34c0 23-10 32-19 40-6 5-11 10-11 24v10H0V10a10 10 0 0 1 20 0v140h94c2-14 9-22 18-30 7-6 12-11 12-24V62a10 10 0 0 1 20 0v34c0 23-10 32-19 40l-1 1V150H94V10A10 10 0 0 1 104 0z"/></g><text x="190" y="72" fill="#333" font-family="Arial Black, Arial, sans-serif" font-size="40" font-weight="900" letter-spacing="1">MANTENIMIENTO</text><text x="190" y="116" fill="#333" font-family="Arial Black, Arial, sans-serif" font-size="40" font-weight="900" letter-spacing="1">DE GRIFOS</text><text x="605" y="116" fill="#333" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="900">.ES</text></svg>`);
