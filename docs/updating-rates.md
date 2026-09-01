# Updating posted rates

Every rate the website advertises lives in one file: **`src/data/rates.json`**.
Changing a rate does not require a developer.

## How to change a rate

1. Open `src/data/rates.json` on GitHub and click the pencil icon.
2. Edit the value you want to change. Keep the quotation marks and the `%`.
3. Change `"effective"` to today's date, in `YYYY-MM-DD` form.
4. Commit. The site rebuilds and republishes itself in about two minutes.

## What is in the file

| Section | What it is | Where it shows |
|---|---|---|
| `effective` | The date the rates below were last confirmed | "Rates effective …" on the home page and `/rates` |
| `rates` | The rates quoted outside the table — product cards, member notifications, calculators | Home page, `/mortgages`, `/accounts`, `/cards`, dashboard |
| `tables` | The full posted table, as `["term", "rate"]` rows | `/rates` |

Some rates appear in both places — the 5-year fixed mortgage, the 1- and
5-year GICs, the savings rate, and both credit cards. **Change them in both.**
If the two disagree the build stops and tells you which ones, because a
promotion that contradicts the posted table is a compliance problem, not a
typo. That is the check working, not a fault.

## What the build will refuse

- A missing rate, or one that is not in a recognisable form (`4.34%`,
  `Prime - 0.50%`, `$0`).
- A table row and a named rate for the same product that disagree.
- An `effective` date that is not a real date, or is in the future.

Rates last confirmed more than 90 days ago produce a warning, not a failure:
the deploy still goes out, but the log asks someone to confirm them.

## What it does not check

Whether the rate is *correct*. Nothing here can tell a 4.34% that should have
been 4.43%. Check the number against the rate sheet before you commit.
