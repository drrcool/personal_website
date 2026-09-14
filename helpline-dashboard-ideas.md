# Helpline Dashboard — Operator Engagement & Coverage

**Superseded.** These working notes became the OpenSpec change
[`helpline-engagement-views`](openspec/changes/helpline-engagement-views/), which carries
the proposal, design, specs, and task breakdown. Start there.

Where each idea landed:

| Idea                                                    | Outcome                                                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **A** — gone-quiet operator list                        | Built. Operators tab → Follow Up.                                                                               |
| **B** — need score as a Color By option                 | Built, and now the Schedule tab's default.                                                                      |
| **F** — caller experience                               | Built. New Callers tab.                                                                                         |
| **G** — weekly digest                                   | **Deferred** to `helpline_tools` — it needs stored prior-run state and runs on a schedule, not in the browser.  |
| Operator roster + outreach log                          | **Deferred** to `helpline_tools` — stored data, not derivable from call history, and it needs anon-denying RLS. |
| "What if X leaves" simulation, recruiting-target export | Dropped, as in the original notes.                                                                              |

Two of the notes' assumptions turned out to be wrong, and the corrections are worth keeping:

- **The `rings` field does not matter.** Gap #2 guessed it might encode ring order, which
  would mean a later-position operator's low answer rate reflects position rather than
  disengagement. Tested directly against `assigned_operators` order instead of the scraper:
  the raw skew toward position 1 is real but disappears once controlled for operator
  identity — 10.5% (12/114) at position 1 versus 6.1% (6/98) later, on 18 answers. Reliable
  operators are simply listed first. No schema change needed. See
  [`rls-audit.md`](openspec/changes/helpline-engagement-views/rls-audit.md) § 1.3.
- **Caller phone numbers are not exposed.** `caller_number` and `operator_number` are
  SHA-256 hashed. What _is_ world-readable is every volunteer's first name and their
  covered hours, since the site has no authentication. That exposure was explicitly
  accepted; the deferred roster tables, which hold real contact details, are not. See
  `rls-audit.md` § 1.1–1.2.
