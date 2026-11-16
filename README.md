# Line Check — final duct inspection

A standalone web app. Nothing is sent anywhere: every taglist and every
inspection stays in the browser storage of the device that recorded it.

## It must be served over HTTPS

The camera only opens on a page served over **https://** (or from
`http://localhost` while testing). Opening `index.html` by double-clicking it
gives a `file://` page, and the browser will refuse the camera there.

Pick one of these.

### 1. GitHub Pages — free, 5 minutes, recommended

1. Create a GitHub account if you do not have one.
2. Create a new **public** repository, for example `line-check`.
3. Choose **Add file → Upload files**, drag in everything from this folder
   (`index.html`, `manifest.webmanifest`, `sw.js`, the three `icon-*.png`
   files and the whole `vendor` folder), and commit.
4. Go to **Settings → Pages**. Under *Source* pick **Deploy from a branch**,
   branch `main`, folder `/ (root)`. Save.
5. Wait about a minute. The address appears on that page, in the form
   `https://<your-name>.github.io/line-check/`.

### 2. Netlify Drop — no account needed to try

Open `https://app.netlify.com/drop` and drag this whole folder onto the page.
It returns an HTTPS address at once. Claim it with a free account to keep it.

### 3. Your own server

Copy the folder onto any web server that serves HTTPS. No backend, no
database, no build step — these are plain static files.

## Install it on the phone

Open the address in **Chrome on Android**, then either tap **Install** in the
app's header or use Chrome's menu → **Add to Home screen**. It then opens
full screen with its own icon, like any other app.

On an iPhone, use Safari → Share → **Add to Home Screen**. iOS has no
built-in barcode reader, so the app falls back to its own reader; it works
but is slower than on Android.

## Working offline

Everything the app needs is cached the first time it loads, so after that it
opens and runs with no signal: scanning, inspecting, the taglist, the hourly
figures and all three downloads. Only the first load needs a connection.

## Where the data lives, and how to protect it

Taglists and inspection records are kept in the phone browser's database
(IndexedDB) for this site. It holds thousands of inspections a day and survives
closing the app and restarting the phone. The app asks the browser to keep the
data permanently. Records saved by the previous version are moved across the
first time the new version opens.

The data is lost if someone clears the browser data for the site, uninstalls
the app, or the phone is lost. There is no server copy yet.

**So at the end of every shift, open the Log tab and tap *Download all
records (CSV)*, and download the taglist checklist whenever a taglist
finishes.** Those files are the backup.

To keep the phone fast, only the last 7 days of records are held in memory
(further back if an older taglist is still loaded, at most 62 days). Older
shifts are read from the phone when you pick their date on the Hourly tab,
and every record is in *Download all records*.

Do not use Private or Incognito mode: it throws the data away on close.

## Inspecting a piece: group ticks

Scan the label. The screen shows what to look for: sizes, extension and its
side, liner yes/no, the end type on each side, and the reason for every
conditional item. The checklist is in five groups: **Dimensions,
Construction, Ends, Liner, Sealing & finish**. A group is confirmed with one
tap on its *OK* button. A group tick covers every item in it, and the
checklist states that.

- **Defect** opens the group item by item. Mark the failed item and add a
  note; the rest of the group passes with it.
- Items the taglist cannot decide (label not in a taglist, missing columns,
  ducts over 2000 mm) stay open after the group tick and need their own Pass,
  Fail or N/A.
- Groups that do not apply (Liner on an unlined duct) show N/A and need no tap.
- Several pieces on one barcode: one piece at a time, or *Apply to all* for the
  ones not yet inspected. Each piece gets its own record and tag (AC-65-1, AC-65-2).
- **Joined parts** (tags differing only by a final letter, such as FF3-97 and
  FF3-97a, where any of them says Join): scanning any part opens the whole
  assembly. It is inspected once, assembled, and recorded against every part.
- **APS** in the remarks shows a "refer to the sketch" banner.

## The checklist and its rules

17 criteria. These depend on the piece:

- **Orientation**: only on M/C, Offset and Reducer pieces.
- **Neck**: on M/C pieces, and on a Linear PLM.Box (Width 2 = neck opening,
  Depth 2 = neck extension).
- **LS end / SS end**: from the LS and SS columns. EC = end cap fixed;
  IF, U, F, H = that flange fitted; WC = no connector; Plain = foil tape covers
  the phenolic; Join = sealed and taped to the next part. The end cap count
  comes from the Endcap column.
- **Liner, stick-up pins, adhesive, cloth/glasswool**: N/A when the
  Liner / Clad column has no "Liner".
- **Tiger clips (panel fasteners)**: used with adhesive, so only on pieces
  over 1000 mm long with a side over 500 mm. Spacing from the SMACNA panel
  fastener table: at most 508 mm apart along longitudinal seams and corners at
  125-500 Pa, 254 mm at 750-1000 Pa. Over 2000 mm: consult the panel maker.
- **Tie rods**: SMACNA Table 5-4 (22 mm panel, A and B/C flange joints), at the
  pressure class set on the Taglist tab (default up to 500 Pa), for the duct
  width and height separately. The screen shows the requirement for each side,
  e.g. "Width 1060 mm: 1 @ 900 mm (1 rod per row, 1 row on this 360 mm piece)".
  Not on pieces shorter than 300 mm. Over 2000 mm: consult the panel maker.
  On offsets and Linear PLM.Box, Width 2 and Depth 2 do not count as sizes.
- **Splitter vanes**: all bends are radius bends. Only in bends over 45
  degrees, by duct width (SMACNA Figure 4-4): up to 508 mm none; over 508-813 mm
  one at W/3; over 813-1626 mm two at W/4 and W/2; over 1626 mm three at W/8,
  W/3 and W/2, measured from the throat. The screen gives the positions in mm.
  No vanes in reducers, offsets or M/C pieces; reducer tapers are as the sketch.
- **APS pieces**: rules run on the taglist sizes, with a note to confirm the
  size on the sketch.

LS is the end with the bigger width; Width 2 of 0 means both ends are the same
size. Reducer-LS / Reducer-SS put the extension or end cap on that side.

The limits are settings on the Taglist tab, under *Rules for conditional items*.
All limits are SMACNA unless stated as factory practice.

## Taglists

Upload a single taglist or the whole daily planning file (CSV or Excel). A file
with several taglists is split by its Taglist Name column, and each taglist gets
its own checklist. Loading a taglist that is already on the phone replaces it;
inspections already recorded stay. "Adjustment" rows are left out. Taglists
loaded with an earlier version must be removed and loaded again, so the end,
liner and remarks columns are read.

## Totals

The Hourly tab, the hourly checklist and each taglist checklist show **passed
m²** (internal area of pieces that passed) and **lined m² passed** (the part
of it with acoustic liner).

## Scanning

- **Camera**: tap Camera, hold the label in the frame. The check opens by
  itself as soon as a code is read.
- **Bluetooth or ring scanner**: pair it and scan. The scanner types the code
  and sends Enter, which opens the check from any screen of the Check tab.
- **Command cards**: on the Check tab, *Download command cards (PDF)*, print
  and laminate. With a check open, scan *Dimensions OK*, *Construction OK*,
  *Ends OK*, *Liner OK*, *Sealing & finish OK*, *Select all remaining pieces*,
  *Submit* or *Discard*. Scanning the next duct label once every item is
  answered submits the open check and starts the new one; if items are still
  open, the app warns and keeps the current check.
- **By hand**: type the code and press Enter.

## Updating the app later

Replace the files on the host. The app picks up the new version the next time
it is opened with a connection; with no connection it keeps running the version
it already has. When the libraries in `vendor/` change, bump the cache name in
`sw.js` (currently `line-check-v3`) so phones fetch them again.

Inspection records and taglists are not touched by an update.

## If you later want it in the Play Store

This is a progressive web app, so it can be wrapped as a real Android package
with Google's Bubblewrap tool without rewriting anything. Only do that if the
Play Store listing itself is needed — installing from the browser gives the
same app.
