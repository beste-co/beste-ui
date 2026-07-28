# Security

## Reporting a vulnerability

Email **hello@beste.co** with `SECURITY` in the subject. Please do not open a
public issue for anything exploitable.

Useful in the report:

- what the issue is and where (a file and line, or a URL)
- how to reproduce it, ideally the smallest case that shows it
- what an attacker gets out of it
- your assessment of severity, if you have one

You will get a reply within a few days. If the report is valid we will tell you
what the fix is and when it ships, and credit you when it does, unless you would
rather we did not.

## Scope

**In scope**

- [ui.beste.co](https://ui.beste.co), the hosted registry and site
- this repository: the site code, the registry routes, and the sections
  themselves, including a section that mishandles the data it is given

**Out of scope**

- findings that need physical access, a compromised device, or social
  engineering
- automated scanner output with no demonstrated impact
- missing headers or best practices with no exploit behind them
- denial of service through volume
- anything in a dependency, which belongs upstream with that project

## A note on the sections

These are components you copy into your own project, which makes the boundary
worth stating.

Some sections accept a prop containing markup, so a heading can carry emphasis,
and render it as HTML. **That is only safe for content you control.** Passing
user-submitted text into one of those props is an XSS hole in your application,
not in the section. Where a section does this, its README says so.

Once installed, a section is your code. We fix issues in what we publish; what
you do with it afterwards is outside what we can reach.

## Supported versions

Sections are copied, not versioned: there is no release to patch. Fixes land in
the catalogue, and installing the section again picks them up. The hosted site
always serves the current version.
