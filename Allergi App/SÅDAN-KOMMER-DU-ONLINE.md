# Sådan får du Allergi Guide på personalets iPhones

Appen ligger klar i denne mappe. Den skal hostes på en HTTPS-adresse, før den kan installeres som app på iPhone. GitHub Pages er gratis og tager ca. 10 minutter.

## Trin 1: Opret GitHub-konto (spring over hvis du har en)

Gå til https://github.com/signup og opret en konto med din mail.

## Trin 2: Opret et repository

1. Gå til https://github.com/new
2. Repository name: `allergi-guide`
3. Vælg **Public**
4. Klik **Create repository**

## Trin 3: Upload filerne

1. På repository-siden: klik **uploading an existing file** (link midt på siden)
2. Træk disse 6 filer fra denne mappe ind i browseren:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-180.png`
   - `icon-192.png`
   - `icon-512.png`
3. Klik **Commit changes**

## Trin 4: Tænd GitHub Pages

1. I repositoryet: klik **Settings** → **Pages** (i venstremenuen)
2. Under "Branch": vælg `main` og klik **Save**
3. Vent 1-2 minutter. Din app ligger nu på:
   `https://DIT-BRUGERNAVN.github.io/allergi-guide/`

## Trin 5: Installer på personalets iPhones

1. Åbn adressen i **Safari** (skal være Safari)
2. Tryk på **Del-knappen** (firkant med pil op)
3. Vælg **"Føj til hjemmeskærm"**
4. Appen ligger nu som ikon på hjemmeskærmen og virker også uden net

## Når menuen ændrer sig

1. Send mig den nye CSV, så opdaterer jeg `index.html`
2. Upload den nye `index.html` til GitHub (samme sted, **Add file → Upload files** – den overskriver den gamle)
3. Personalets apps henter automatisk den nye version, næste gang de åbner appen med netforbindelse

## Tip

Repositoryet er offentligt (det er kravet for gratis Pages), men adressen er ikke noget, gæster falder over. Vil du have det helt privat, kan GitHub Pages på private repos fås med GitHub Pro, eller brug Netlify (også gratis).
