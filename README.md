# Kadeřnictví Paula Docce — web

Jednoduchý web (HTML/CSS/JS, nic se nemusí instalovat ani sestavovat),
připravený na **GitHub Pages** (bezplatné hostování přímo z GitHubu).

Obsahuje: úvodní stránku, služby, ceník (který si můžeš sám/sama upravovat
přes zabezpečenou admin stránku), galerii fotek a kontakt.

Adresa, telefon a e-mail jsou už vyplněné podle salonu. Texty o tobě a
fotky jsou zatím orientační — nahraď je klidně postupně, nic se tím
nerozbije.

## Co je v souborech

```
index.html            Domů
sluzby.html            Služby
cenik.html             Ceník (ceny se berou z data/cenik.json)
portfolio.html         Fotky práce (seznam fotek je v data/portfolio.json)
kontakt.html           Kontakt
admin.html             Úprava ceníku (zaheslované)
css/style.css          Vzhled webu
js/                    Obsluha webu (menu, ceník, galerie, admin...)
data/cenik.json        Ceny — upravuješ přes admin.html
data/portfolio.json    Seznam fotek v galerii
images/portfolio/      Sem nahraješ vlastní fotky
```

## 1. Jak dostat web na internet (GitHub Pages)

1. Na GitHubu založ nový **veřejný** repozitář (např. `pauladocce-web`).
2. Nahraj do něj všechny tyto soubory a složky — nejjednodušší je přes
   webové rozhraní: v repozitáři klikni na **Add file → Upload files**
   a přetáhni tam všechno (i podsložky `css`, `js`, `data`, `images`).
3. V repozitáři jdi do **Settings → Pages**. U "Build and deployment"
   vyber **Deploy from a branch**, větev `main`, složku `/ (root)`, a
   ulož.
4. Za chvíli poběží web na adrese
   `https://TVOJE-JMENO.github.io/NAZEV-REPOZITARE/`.
5. Pokud budeš chtít vlastní doménu (např. `www.pauladocce.cz`), přidá
   se ve stejné sekci Pages přes pole **Custom domain** — GitHub sám
   ukáže, jaký záznam nastavit u domény.

Repozitář musí zůstat **veřejný**, jinak GitHub Pages zdarma nefunguje.

## 2. Jak upravovat ceník (admin stránka)

Otevři na svém webu `admin.html` a vyplň tři věci:

1. **Uživatelské jméno na GitHubu** — vidíš ho v adrese svého webu
   (`github.com/TOHLE-JMENO/...`).
2. **Název repozitáře** — taky z adresy (`github.com/.../TOHLE-JMENO`).
3. **GitHub token** — funguje jako heslo pro úpravy. Vytvoří se takto:
   - Na GitHubu klikni na svou ikonku vpravo nahoře → **Settings**.
   - Vlevo dole **Developer settings**.
   - **Personal access tokens → Fine-grained tokens → Generate new
     token**.
   - U *Repository access* vyber **Only select repositories** a
     zaškrtni jen svůj repozitář s webem.
   - U *Permissions* rozbal **Contents** a nastav na **Read and
     write**.
   - Klikni na **Generate token** a token si **zkopíruj** — zobrazí se
     jen jednou.

Token vlož do admin.html a klikni na **Přihlásit se**. Pak už jen
upravuješ ceny, přidáváš nebo mažeš položky a nakonec klikneš na
**Uložit změny**. Na webu se to projeví přibližně do minuty.

Všechno (jméno, repozitář i token) se pamatuje jen v tomto prohlížeči,
na tomto počítači/telefonu — nikam jinam se to neposílá.

**Pár rad, jak s tokenem zacházet:**
- Neposílej ho nikomu a adresu `admin.html` nikde veřejně nesdílej.
- Když si nebudeš jistá/jistý, jestli je v bezpečí, na GitHubu ho
  smažeš stejnou cestou, kudy jsi ho vytvořila (Developer settings →
  Personal access tokens → smazat) a klidně vytvoříš nový.

## 3. Jak přidat vlastní fotky

1. Nahraj fotky (podobný poměr stran, ideálně na výšku) do složky
   `images/portfolio/`.
2. Otevři `data/portfolio.json` a pro každou fotku přidej řádek:

```json
{ "file": "images/portfolio/muj-strih.jpg", "caption": "Krátký dámský střih" }
```

Dokud fotka ve složce ještě není, na jejím místě zůstane jen
orámovaný placeholder — takže nic nevadí, když je doplníš postupně.

Stejně to funguje i u úvodní fotky na `index.html`: řádek
`<div class="placeholder-photo">` stačí nahradit za
`<img src="images/hero/tvoje-foto.jpg" alt="popis fotky">`.

## 4. Google recenze

Na úvodní stránce je tlačítko **Zobrazit recenze na Google**, které
vede rovnou na Google profil salonu — funguje hned, bez zakládání
čehokoliv. Pokud by ses časem chtěla/chtěl, aby recenze byly vidět
přímo na webu (ne jen přes odkaz), jde to přes bezplatnou službu
**trustindex.io** — tam se založí účet, propojí se s Google profilem a
vygeneruje se krátký kód, který se vloží do `index.html` na místo
označené komentářem `GOOGLE RECENZE`.

## 5. Kontaktní formulář

Formulář v `kontakt.html` po odeslání otevře e-mailový program
s předvyplněnou zprávou — funguje rovnou, nic se nemusí nastavovat.

## 6. Změna barev a písma

Všechny barvy jsou na jednom místě: nahoře v souboru `css/style.css`
(sekce začínající `:root`). Stačí tam upravit pár hex kódů barev.
